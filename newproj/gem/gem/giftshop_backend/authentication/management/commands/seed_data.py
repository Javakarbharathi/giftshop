from django.core.management.base import BaseCommand
from authentication.models import User

class Command(BaseCommand):
    help = 'Seeds initial administrative, worker, and customer accounts.'

    def handle(self, *args, **options):
        # 1. Create Super Admin
        admin_user, created = User.objects.get_or_create(
            email='customgiftsgobi@gmail.com',
            defaults={
                'username': 'admin',
                'role': User.Role.SUPER_ADMIN,
                'is_staff': True,
                'is_superuser': True,
                'preferred_language': User.Language.ENGLISH
            }
        )
        if created:
            admin_user.set_password('admin@!')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Super Admin Created: admin / admin@!"))

        # 2. Create Initial Customer Account
        customer_user, created = User.objects.get_or_create(
            email='javakar1411@gmail.com',
            defaults={
                'username': 'javakar',
                'phone_number': '6379979364',
                'role': User.Role.CUSTOMER,
                'preferred_language': User.Language.ENGLISH
            }
        )
        if created:
            customer_user.set_password('Javakar@96_')
            customer_user.save()
            self.stdout.write(self.style.SUCCESS("Customer Account Created: javakar1411@gmail.com"))