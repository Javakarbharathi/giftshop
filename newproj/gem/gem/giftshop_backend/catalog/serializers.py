from rest_framework import serializers
from .models import (
    ShopSettings, Category, Product, ProductShape, PricingTier,
    Order, OrderItem, Review, Coupon, SavedAddress, WishlistItem
)

class ShopSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopSettings
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductShape
        fields = '__all__'

class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTier
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    shapes = ProductShapeSerializer(many=True, read_only=True)
    pricing_tiers = PricingTierSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name', 'name_ta', 'slug',
            'product_type', 'description', 'description_ta', 'base_price',
            'offer_price', 'image', 'gallery_images', 'stock',
            'is_active', 'shapes', 'pricing_tiers', 'reviews',
            'average_rating', 'reviews_count'
        ]

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 5.0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    def get_reviews_count(self, obj):
        return obj.reviews.count()

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'

class SavedAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedAddress
        fields = '__all__'

class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = WishlistItem
        fields = ['id', 'user', 'product', 'product_id', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_name', 'quantity', 'price', 'shape',
            'frame_size', 'frame_material', 'custom_text',
            'custom_image', 'custom_image_back'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'customer_name', 'customer_email', 'customer_phone', 
            'shipping_address', 'total_amount', 'discount_amount', 'coupon_code',
            'payment_method', 'status', 'razorpay_order_id', 'upi_utr_number', 'is_paid',
            'tracking_checkpoints', 'current_checkpoint_index', 
            'assigned_delivery_partner', 'created_at', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order