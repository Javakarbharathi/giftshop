import random
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
        SHOP_OWNER = 'SHOP_OWNER', 'Shop Owner'
        WORKER = 'WORKER', 'Worker'
        CUSTOMER = 'CUSTOMER', 'Customer'

    class Language(models.TextChoices):
        ENGLISH = 'en', 'English'
        TAMIL = 'ta', 'Tamil'

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    preferred_language = models.CharField(max_length=5, choices=Language.choices, default=Language.ENGLISH)
    otp_code = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.role})"

    def generate_otp(self):
        code = str(random.randint(1000, 9999))
        self.otp_code = code
        self.save()
        print(f"\n============================")
        print(f"[DEV OTP LOGGER] Mobile: {self.phone_number} | OTP: {code}")
        print(f"============================\n")
        return code