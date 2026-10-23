from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import ShopSettings, Category, Product, ProductShape, PricingTier, Order, OrderItem, UserProfile

# Dynamically fetch whatever User model your project is actually using
User = get_user_model()

# ---------------------------------------------------------
# User Profile & Role Administration
# ---------------------------------------------------------
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'User Roles & Extra Info'

# Define a new UserAdmin that includes the profile inline
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

# Safely unregister the old User admin (if it exists) and register our new one
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

admin.site.register(User, UserAdmin)


# ---------------------------------------------------------
# Product Catalog Administration
# ---------------------------------------------------------
class ProductShapeInline(admin.TabularInline):
    model = ProductShape
    extra = 1

class PricingTierInline(admin.TabularInline):
    model = PricingTier
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'base_price', 'offer_price', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductShapeInline, PricingTierInline] # Allows adding shapes & prices on the same page

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


# ---------------------------------------------------------
# Standard Model Registrations
# ---------------------------------------------------------
admin.site.register(ShopSettings)
admin.site.register(Order)
admin.site.register(OrderItem)