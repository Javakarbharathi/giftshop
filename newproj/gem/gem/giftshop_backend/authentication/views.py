from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    OTPSendSerializer,
    OTPVerifySerializer
)

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPSendSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone_number']
            user, _ = User.objects.get_or_create(
                phone_number=phone,
                defaults={'email': f"{phone}@giftshop.local", 'username': phone, 'role': User.Role.CUSTOMER}
            )
            user.generate_otp()
            return Response({"message": "OTP sent successfully (Check console log)"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone_number']
            otp = serializer.validated_data['otp_code']
            full_name = serializer.validated_data.get('full_name', '')

            try:
                user = User.objects.get(phone_number=phone, otp_code=otp)
                if full_name and not user.first_name:
                    user.first_name = full_name
                    user.save()

                user.otp_code = None
                user.save()

                refresh = RefreshToken.for_user(user)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "phone_number": user.phone_number,
                        "role": user.role,
                        "preferred_language": user.preferred_language
                    }
                })
            except User.DoesNotExist:
                return Response({"error": "Invalid OTP or Phone Number"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)