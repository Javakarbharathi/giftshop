from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ShopSettingsViewSet, CategoryViewSet, ProductViewSet, ProductShapeViewSet,
    OrderViewSet, ReviewViewSet, SavedAddressViewSet, WishlistViewSet,
    CouponValidateView, AdminAnalyticsView,
    LoginView, RegisterView, DeliveryPartnerListView,
    RazorpayCheckoutView, RazorpayVerifyView
)

router = DefaultRouter()
router.register(r'settings', ShopSettingsViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'shapes', ProductShapeViewSet)
router.register(r'products', ProductViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'addresses', SavedAddressViewSet, basename='addresses')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('coupons/validate/', CouponValidateView.as_view(), name='coupon-validate'),
    path('admin-analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('delivery-partners/', DeliveryPartnerListView.as_view(), name='delivery-partners'),
    path('razorpay/create/', RazorpayCheckoutView.as_view(), name='razorpay-create'),
    path('razorpay/verify/', RazorpayVerifyView.as_view(), name='razorpay-verify'),
]