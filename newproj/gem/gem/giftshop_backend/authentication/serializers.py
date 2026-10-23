from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        token['preferred_language'] = user.preferred_language
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'full_name': self.user.get_full_name() or self.user.username,
            'phone_number': self.user.phone_number,
            'role': self.user.role,
            'preferred_language': self.user.preferred_language
        }
        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'phone_number', 'password', 'preferred_language']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email']),
            phone_number=validated_data.get('phone_number'),
            password=validated_data['password'],
            role=User.Role.CUSTOMER,
            preferred_language=validated_data.get('preferred_language', User.Language.ENGLISH)
        )
        return user

class OTPSendSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)

class OTPVerifySerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)
    full_name = serializers.CharField(max_length=150, required=False)