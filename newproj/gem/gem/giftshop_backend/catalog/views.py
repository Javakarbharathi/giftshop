from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db.models import Sum, Count, Avg, Q
from .models import (
    ShopSettings, Category, Product, ProductShape, Order, OrderItem,
    UserProfile, Review, Coupon, SavedAddress, WishlistItem
)
from .serializers import (
    ShopSettingsSerializer, CategorySerializer, ProductSerializer,
    ProductShapeSerializer, OrderSerializer, ReviewSerializer,
    CouponSerializer, SavedAddressSerializer, WishlistItemSerializer
)
from authentication.models import User
import razorpay
from django.conf import settings
from django.core.mail import send_mail

class ShopSettingsViewSet(viewsets.ModelViewSet):
    queryset = ShopSettings.objects.all()
    serializer_class = ShopSettingsSerializer
    permission_classes = [permissions.AllowAny]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductShapeViewSet(viewsets.ModelViewSet):
    queryset = ProductShape.objects.all()
    serializer_class = ProductShapeSerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all().order_by('-created_at')
        category_slug = self.request.query_params.get('category', None)
        product_type = self.request.query_params.get('type', None)
        search = self.request.query_params.get('search', None)

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if product_type:
            queryset = queryset.filter(product_type=product_type)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_id = self.request.query_params.get('product_id', None)
        if product_id:
            return Review.objects.filter(product_id=product_id)
        return Review.objects.all()

class CouponValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip().upper()
        subtotal = float(request.data.get('subtotal', 0))

        # Default system coupons
        if code == 'WELCOME10':
            discount = round(subtotal * 0.10, 2)
            return Response({
                'valid': True,
                'code': 'WELCOME10',
                'label': '10% First Order Discount',
                'discount_amount': discount
            })
        elif code == 'GOBI50':
            discount = 50.0 if subtotal >= 299 else 0
            if discount == 0:
                return Response({'valid': False, 'message': 'GOBI50 requires a minimum order of ₹299.'}, status=400)
            return Response({
                'valid': True,
                'code': 'GOBI50',
                'label': '₹50 Flat Discount',
                'discount_amount': discount
            })
        
        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
            if subtotal < float(coupon.min_order_amount):
                return Response({'valid': False, 'message': f'Minimum order amount of ₹{coupon.min_order_amount} required.'}, status=400)
            
            discount = 0.0
            if coupon.discount_percent > 0:
                discount = round(subtotal * (coupon.discount_percent / 100), 2)
            elif coupon.discount_amount > 0:
                discount = float(coupon.discount_amount)

            return Response({
                'valid': True,
                'code': coupon.code,
                'label': coupon.description or f"{coupon.code} Applied",
                'discount_amount': discount
            })
        except Coupon.DoesNotExist:
            return Response({'valid': False, 'message': 'Invalid promo coupon code.'}, status=400)

class SavedAddressViewSet(viewsets.ModelViewSet):
    serializer_class = SavedAddressSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return SavedAddress.objects.filter(user_id=user_id)
        if self.request.user.is_authenticated:
            return SavedAddress.objects.filter(user=self.request.user)
        return SavedAddress.objects.all()

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return WishlistItem.objects.filter(user_id=user_id)
        if self.request.user.is_authenticated:
            return WishlistItem.objects.filter(user=self.request.user)
        return WishlistItem.objects.all()

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Order.objects.all().order_by('-created_at')
        user_id = self.request.query_params.get('user_id', None)
        phone = self.request.query_params.get('phone', None)
        partner = self.request.query_params.get('partner', None)
        search = self.request.query_params.get('search', None)

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        elif partner:
            queryset = queryset.filter(assigned_delivery_partner__iexact=partner)
        elif phone:
            queryset = queryset.filter(customer_phone=phone)
        elif search:
            queryset = queryset.filter(
                Q(id__icontains=search) |
                Q(customer_name__icontains=search) |
                Q(customer_phone__icontains=search)
            )
        return queryset

    def perform_create(self, serializer):
        order = serializer.save()
        if order.customer_email:
            subject = f"Order Confirmed - ORD-{order.id} | TN36 Custom Gifts"
            message = (
                f"Hi {order.customer_name},\n\n"
                f"Thank you for your order with TN36 Custom Gifts! (ORD-{order.id}).\n\n"
                f"Total Amount: ₹{order.total_amount}\n"
                f"Payment Method: {order.payment_method}\n"
                f"Shipping Address: {order.shipping_address}\n\n"
                f"You can track live dispatch progress on our website.\n\n"
                f"TN36 Custom Gifts Team"
            )
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [order.customer_email],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Email sending failed: {e}")

class AdminAnalyticsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_orders = Order.objects.count()
        total_revenue = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0.00
        completed_orders = Order.objects.filter(status='Delivered').count()
        pending_orders = Order.objects.exclude(status='Delivered').count()
        total_products = Product.objects.count()
        low_stock_products = Product.objects.filter(stock__lte=15).values('id', 'name', 'stock')

        # Recent 5 orders
        recent_orders = Order.objects.order_by('-created_at')[:5]
        recent_orders_data = OrderSerializer(recent_orders, many=True).data

        return Response({
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'completed_orders': completed_orders,
            'pending_orders': pending_orders,
            'total_products': total_products,
            'low_stock_products': list(low_stock_products),
            'recent_orders': recent_orders_data
        })

# ---------------------------------------------------------
# Authentication & Role Views
# ---------------------------------------------------------
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = (request.data.get('email') or request.data.get('username') or '').strip()
        password = (request.data.get('password') or '').strip()

        if not identifier:
            return Response({'error': 'Please enter your username or email address.'}, status=status.HTTP_400_BAD_REQUEST)

        id_lower = identifier.lower()

        # Case 1: Delivery Partner (BlueDart Agent)
        if 'bluedart' in id_lower or 'agent' in id_lower or 'delivery' in id_lower or id_lower == 'agent_bala':
            user = User.objects.filter(Q(email='agent@bluedart.com') | Q(username__iexact='Agent_Bala')).first()
            if not user:
                user = User.objects.create_user(username='Agent_Bala', email='agent@bluedart.com', password=password or 'delivery123')
            else:
                if password:
                    user.set_password(password)
                    user.save()
            
            prof, _ = UserProfile.objects.get_or_create(user=user)
            prof.role = 'delivery_partner'
            prof.save()

            return Response({
                'id': user.id,
                'username': getattr(user, 'username', 'Agent_Bala'),
                'email': 'agent@bluedart.com',
                'role': 'delivery_partner'
            })

        # Case 2: Admin & Shop Owner
        if 'customgiftsgobi' in id_lower or 'admin' in id_lower:
            user = User.objects.filter(Q(email='customgiftsgobi@gmail.com') | Q(username__iexact='admin')).first()
            if not user:
                user = User.objects.create_superuser(username='admin', email='customgiftsgobi@gmail.com', password=password or 'admin123')
            else:
                if password:
                    user.set_password(password)
                    user.save()
            
            prof, _ = UserProfile.objects.get_or_create(user=user)
            prof.role = 'admin'
            prof.save()

            return Response({
                'id': user.id,
                'username': 'admin',
                'email': 'customgiftsgobi@gmail.com',
                'role': 'admin'
            })

        # Case 3: Customer / General User
        user = User.objects.filter(
            Q(username__iexact=identifier) | 
            Q(email__iexact=identifier)
        ).first()

        if not user and '@' in identifier:
            user = User.objects.filter(email__icontains=identifier.split('@')[0]).first()

        if not user:
            # Auto-provision new customer account seamlessly
            username = identifier.split('@')[0] if '@' in identifier else identifier
            email = identifier if '@' in identifier else f"{identifier}@gmail.com"
            try:
                user = User.objects.create_user(username=username, email=email, password=password or 'customer123')
            except Exception:
                user = User.objects.filter(Q(username=username) | Q(email=email)).first()

        if user:
            if password:
                user.set_password(password)
                user.save()

            role = 'customer'
            if hasattr(user, 'profile') and user.profile.role:
                role = user.profile.role.lower()

            prof, _ = UserProfile.objects.get_or_create(user=user)
            prof.role = role
            prof.save()

            return Response({
                'id': user.id,
                'username': getattr(user, 'username', user.email),
                'email': user.email,
                'role': role
            })

        return Response({'error': 'Invalid Credentials. Please check your username/email and password.'}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username') or request.data.get('email')
        email = request.data.get('email')
        password = request.data.get('password')
        phone = request.data.get('phone', '')

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
            return Response({'error': 'User with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, email=email, password=password)
        except TypeError:
            user = User.objects.create_user(email=email, password=password)

        UserProfile.objects.create(user=user, role='customer', phone=phone)
        return Response({'message': 'Customer registered successfully.'}, status=status.HTTP_201_CREATED)


class DeliveryPartnerListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        partners = UserProfile.objects.filter(role__icontains='delivery').select_related('user')
        result = []
        for p in partners:
            username = getattr(p.user, 'username', p.user.email)
            result.append({'username': username})
        return Response(result)

# ---------------------------------------------------------
# Razorpay Views
# ---------------------------------------------------------
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class RazorpayCheckoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        order_id = request.data.get('order_id')
        try:
            order = Order.objects.get(id=order_id)
            amount_in_paise = int(float(order.total_amount) * 100)
            
            razorpay_order = razorpay_client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "payment_capture": "1"
            })
            
            order.razorpay_order_id = razorpay_order['id']
            order.save()
            
            return Response({
                'razorpay_order_id': razorpay_order['id'],
                'razorpay_merchant_key': settings.RAZORPAY_KEY_ID,
                'amount': amount_in_paise,
                'currency': 'INR'
            })
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

class RazorpayVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        try:
            razorpay_order_id = data.get('razorpay_order_id')
            razorpay_payment_id = data.get('razorpay_payment_id')
            razorpay_signature = data.get('razorpay_signature')
            
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            razorpay_client.utility.verify_payment_signature(params_dict)
            
            order = Order.objects.get(razorpay_order_id=razorpay_order_id)
            order.razorpay_payment_id = razorpay_payment_id
            order.razorpay_signature = razorpay_signature
            order.is_paid = True
            order.status = 'Confirmed'
            order.save()
            
            return Response({'message': 'Payment successful'})
        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Invalid payment signature'}, status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)