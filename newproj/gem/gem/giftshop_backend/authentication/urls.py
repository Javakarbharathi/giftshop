from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomLoginView, RegisterView, SendOTPView, VerifyOTPView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('otp/send/', SendOTPView.as_view(), name='otp_send'),
    path('otp/verify/', VerifyOTPView.as_view(), name='otp_verify'),
]