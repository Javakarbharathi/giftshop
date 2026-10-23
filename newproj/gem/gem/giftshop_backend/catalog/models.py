from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

class UserProfile(models.Model):
    """Extends the default Django User model to include specific platform roles."""
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('shop_owner', 'Shop Owner'),
        ('delivery_partner', 'Delivery Partner'),
    )
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class ShopSettings(models.Model):
    """Dynamic settings for the shop owner to update branding and contact info."""
    shop_name = models.CharField(max_length=255, default="TN36 Custom Gifts")
    shop_logo_url = models.ImageField(upload_to='shop_assets/', null=True, blank=True)
    contact_email = models.EmailField(default="tn36customgifts@gmail.com")
    contact_phone = models.CharField(max_length=20, default="+91 6379979364")
    address = models.TextField(default="Gobichettipalayam, Erode, Tamil Nadu - 638452")
    currency_symbol = models.CharField(max_length=10, default="₹")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Shop Settings"

    def __str__(self):
        return self.shop_name


class Category(models.Model):
    """Product categories (e.g., Keychains, Photo Frames, Coasters, Nameplates)."""
    name = models.CharField(max_length=100, unique=True)
    name_ta = models.CharField(max_length=150, blank=True, null=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    """Product details supporting both keychains and custom photo frames."""
    PRODUCT_TYPE_CHOICES = (
        ('keychain', 'Acrylic Photo Keychain'),
        ('frame', 'Custom Photo Frame'),
        ('mug', 'Ceramic Photo Mug'),
        ('coaster', 'Resin Photo Coaster'),
        ('nameplate', 'Wooden Door Nameplate'),
    )

    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    name_ta = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    product_type = models.CharField(max_length=30, choices=PRODUCT_TYPE_CHOICES, default='keychain')
    description = models.TextField(blank=True, null=True)
    description_ta = models.TextField(blank=True, null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=0.00)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=500, default='/keychain-hardware.png')
    gallery_images = models.TextField(blank=True, null=True, help_text="Comma-separated image URLs")
    stock = models.PositiveIntegerField(default=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductShape(models.Model):
    """Dynamic shapes supported by the product (Heart, Circle, Square, Shield, Oval, Hexagon, Star)."""
    product = models.ForeignKey(Product, related_name='shapes', on_delete=models.CASCADE)
    shape_id = models.CharField(max_length=50, default='circle')
    shape_name = models.CharField(max_length=100)
    shape_name_ta = models.CharField(max_length=100, blank=True, null=True)
    overlay_image = models.ImageField(upload_to='product_shapes/overlays/', null=True, blank=True)
    masking_path = models.TextField(blank=True, null=True)
    is_two_sided = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product.name} - {self.shape_name}"


class PricingTier(models.Model):
    """Buy More, Save More wholesale tiered pricing."""
    product = models.ForeignKey(Product, related_name='pricing_tiers', on_delete=models.CASCADE)
    min_quantity = models.PositiveIntegerField()
    max_quantity = models.PositiveIntegerField(null=True, blank=True)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ['min_quantity']

    def __str__(self):
        if self.max_quantity:
            return f"{self.product.name}: {self.min_quantity}-{self.max_quantity} qty @ ₹{self.price_per_unit}"
        return f"{self.product.name}: {self.min_quantity}+ qty @ ₹{self.price_per_unit}"


class Review(models.Model):
    """Product reviews and star ratings."""
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    customer_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, default='Tamil Nadu')
    rating = models.PositiveIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer_name} - {self.rating}★ on {self.product.name}"


class Coupon(models.Model):
    """Discount and promo codes."""
    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, blank=True)
    discount_percent = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(100)])
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} ({self.discount_percent}% / ₹{self.discount_amount} off)"


class SavedAddress(models.Model):
    """Customer address book for fast 1-click checkout."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='saved_addresses', on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    street = models.TextField()
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100, default='Erode')
    pincode = models.CharField(max_length=10)
    state = models.CharField(max_length=100, default='Tamil Nadu')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.city}, {self.district}"


class WishlistItem(models.Model):
    """Server-synced wishlist items."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='wishlist_items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='wishlisted_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} -> {self.product.name}"


class Order(models.Model):
    """Stores customer order details placed from the frontend."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField(blank=True, null=True)
    customer_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    coupon_code = models.CharField(max_length=50, blank=True, null=True)
    payment_method = models.CharField(max_length=50, default="Cash on Delivery")
    status = models.CharField(max_length=50, default="Pending") # Pending, Confirmed, In Fabrication, Dispatched, Delivered
    
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    upi_utr_number = models.CharField(max_length=50, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    
    tracking_checkpoints = models.TextField(default="Order Confirmed,Laser UV Printing & Fabrication,Handcrafted Quality Polish,Dispatched with Courier,Delivered to Doorstep")
    current_checkpoint_index = models.PositiveIntegerField(default=0)
    assigned_delivery_partner = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"


class OrderItem(models.Model):
    """Stores individual items within an order."""
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    shape = models.CharField(max_length=50, default='heart')
    frame_size = models.CharField(max_length=50, blank=True, null=True)
    frame_material = models.CharField(max_length=50, blank=True, null=True)
    custom_text = models.CharField(max_length=255, blank=True, null=True)
    custom_image = models.TextField(blank=True, null=True)
    custom_image_back = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.quantity}x {self.product_name} (Order #{self.order.id})"