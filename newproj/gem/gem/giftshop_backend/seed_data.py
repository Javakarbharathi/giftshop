import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'giftshop_backend.settings')
django.setup()

from catalog.models import Category, Product, ProductShape, PricingTier, Review, Coupon

def seed():
    print("Seeding catalog data...")

    # 1. Categories
    def get_or_create_cat(name, name_ta, slug, desc):
        cat = Category.objects.filter(name=name).first() or Category.objects.filter(slug=slug).first()
        if not cat:
            cat = Category.objects.create(name=name, name_ta=name_ta, slug=slug, description=desc)
        else:
            cat.name = name
            cat.name_ta = name_ta
            cat.slug = slug
            cat.description = desc
            cat.save()
        return cat

    cat_keychains = get_or_create_cat('Acrylic Keychains', 'சாவிக்கொத்துகள்', 'keychains', 'Double-sided acrylic keychains')
    cat_wedding = get_or_create_cat('Wedding & Return Gifts', 'திருமண சீர் பரிசுகள்', 'wedding-gifts', 'Bulk wedding and event keepsakes')
    cat_vehicles = get_or_create_cat('Vehicle Number Plates', 'வாகன எண் பலகை', 'vehicle-plates', 'TN bike & car acrylic registration tags')
    cat_frames = get_or_create_cat('Custom Photo Frames', 'புகைப்பட சட்டகங்கள்', 'photo-frames', 'Tabletop & wall acrylic and wooden frames')
    cat_coasters = get_or_create_cat('Resin Coasters & Plaques', 'கோஸ்டர்கள் & பலகைகள்', 'resin-coasters', 'UV resin floral coasters and wooden plaques')

    # 2. Products
    p1, _ = Product.objects.update_or_create(
        id=1,
        defaults={
            'name': 'South Indian Wedding Couple Heart Keychain',
            'name_ta': 'பாரம்பரிய திருமண ஜோடி இதய சாவிக்கொத்து',
            'category': cat_wedding,
            'product_type': 'keychain',
            'base_price': 249.00,
            'offer_price': 149.00,
            'description': 'Double-sided silk saree wedding portrait with date laser engraving.',
            'description_ta': 'இருபுறமும் பட்டுப் புடவை புகைப்படங்கள் மற்றும் திருமண தேதி லேசர் பொறிப்பு.',
            'image': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
            'stock': 250
        }
    )

    p2, _ = Product.objects.update_or_create(
        id=2,
        defaults={
            'name': 'TN Vehicle Number Plate Tag (TN 36 / 38 / 01)',
            'name_ta': 'தமிழ்நாடு வாகன எண் பலகை சாவிக்கொத்து',
            'category': cat_vehicles,
            'product_type': 'keychain',
            'base_price': 249.00,
            'offer_price': 159.00,
            'description': 'Vehicle registration number, owner name and emergency QR tag.',
            'description_ta': 'வண்டி எண், உரிமையாளர் பெயர் மற்றும் QR கோடுடன் கூடிய பலகை.',
            'image': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
            'stock': 180
        }
    )

    p3, _ = Product.objects.update_or_create(
        id=3,
        defaults={
            'name': 'Classic Family Portrait Circle Keychain',
            'name_ta': 'குடும்ப புகைப்பட வட்ட வடிவ சாவிக்கொத்து',
            'category': cat_keychains,
            'product_type': 'keychain',
            'base_price': 199.00,
            'offer_price': 149.00,
            'description': 'Preserve family moments and birthdays in a high-gloss acrylic circle.',
            'description_ta': 'குடும்ப விழாக்கள் மற்றும் பிறந்தநாள் நினைவுகளை தாங்கும் வட்ட சாவிக்கொத்து.',
            'image': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
            'stock': 300
        }
    )

    p4, _ = Product.objects.update_or_create(
        id=4,
        defaults={
            'name': 'Luxury Acrylic & Wood Tabletop Photo Frame',
            'name_ta': 'அக்ரிலிக் & மர மேஜை புகைப்பட சட்டகம்',
            'category': cat_frames,
            'product_type': 'frame',
            'base_price': 499.00,
            'offer_price': 299.00,
            'description': 'Custom photo frame available in 4x6, 5x7, 8x10 sizes with tabletop easel stand and optional laser engraved plaque.',
            'description_ta': 'வரவேற்பறை மற்றும் மேஜைக்கு உகந்த 4x6, 5x7, 8x10 அளவுகளில் மர சட்டகம் மற்றும் தமிழ் பெயர் பொறிப்பு.',
            'image': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
            'stock': 85
        }
    )

    p5, _ = Product.objects.update_or_create(
        id=5,
        defaults={
            'name': 'Temple Deity Car Mirror Hanging Charm',
            'name_ta': 'சாமி படம் & கார் கண்ணாடி தொங்கான்',
            'category': cat_keychains,
            'product_type': 'keychain',
            'base_price': 299.00,
            'offer_price': 189.00,
            'description': 'Lord Murugan, Vinayagar, or Meenakshi Amman devotional car charm.',
            'description_ta': 'முருகன், விநாயகர், மீனாட்சி அம்மன் அருள் தரும் வாகன கண்ணாடி தொங்கான்.',
            'image': 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
            'stock': 120
        }
    )

    p6, _ = Product.objects.update_or_create(
        id=6,
        defaults={
            'name': 'Resin Floral Photo Coasters (Set of 4)',
            'name_ta': 'ரெசின் மலர் புகைப்பட கோஸ்டர் (4 எண்ணிக்கை)',
            'category': cat_coasters,
            'product_type': 'coaster',
            'base_price': 499.00,
            'offer_price': 349.00,
            'description': 'Handcrafted UV resin coasters with embedded dried South Indian jasmine/marigold petals and photos.',
            'description_ta': 'உலர்ந்த பூ இதழ்கள் மற்றும் புகைப்படங்களுடன் கையால் செய்யப்பட்ட 4 கோஸ்டர்கள்.',
            'image': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80',
            'stock': 60
        }
    )

    p7, _ = Product.objects.update_or_create(
        id=7,
        defaults={
            'name': 'Wooden Engraved Family Door Nameplate',
            'name_ta': 'மர கதவு பெயர் பலகை & குடும்ப புகைப்படம்',
            'category': cat_coasters,
            'product_type': 'nameplate',
            'base_price': 699.00,
            'offer_price': 499.00,
            'description': 'Solid teak wood finish entrance plaque with brass letters and weatherproof family acrylic portrait.',
            'description_ta': 'வீட்டு வாசல் கதவுக்கான தேக்கு மர பெயர் பலகை மற்றும் தமிழ் எழுத்துக்கள்.',
            'image': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
            'stock': 40
        }
    )

    # 3. Shapes for Keychain Products
    all_shapes = [
        ('heart', 'Heart', 'இதயம்'),
        ('circle', 'Circle', 'வட்டம்'),
        ('square', 'Square', 'சதுரம்'),
        ('shield', 'TN Tag', 'TN பலகை'),
        ('oval', 'Oval', 'நீள்வட்டம்'),
        ('hexagon', 'Hexagon', 'அறுகோணம்'),
        ('star', 'Star', 'நட்சத்திரம்'),
    ]

    for prod in [p1, p2, p3, p5]:
        for s_id, s_name, s_name_ta in all_shapes:
            ProductShape.objects.get_or_create(
                product=prod,
                shape_id=s_id,
                defaults={
                    'shape_name': s_name,
                    'shape_name_ta': s_name_ta,
                    'is_two_sided': True
                }
            )

    # 4. Coupons
    Coupon.objects.get_or_create(
        code='WELCOME10',
        defaults={
            'description': '10% Off First Order',
            'discount_percent': 10,
            'min_order_amount': 0.00,
            'is_active': True
        }
    )
    Coupon.objects.get_or_create(
        code='GOBI50',
        defaults={
            'description': '₹50 Flat Discount on Orders above ₹299',
            'discount_amount': 50.00,
            'min_order_amount': 299.00,
            'is_active': True
        }
    )

    # 5. Sample Reviews
    Review.objects.get_or_create(
        product=p1,
        customer_name='Priya & Karthik',
        defaults={
            'location': 'Gobichettipalayam',
            'rating': 5,
            'comment': 'We ordered 100 heart keychains for our wedding reception. The acrylic clarity on the silk saree photo is outstanding!'
        }
    )
    Review.objects.get_or_create(
        product=p2,
        customer_name='Suresh Kumar',
        defaults={
            'location': 'Coimbatore',
            'rating': 5,
            'comment': 'Got the TN 38 number plate tag for my Bullet bike. The custom QR code and laser cut finish is super premium.'
        }
    )
    Review.objects.get_or_create(
        product=p4,
        customer_name='Anitha Ramesh',
        defaults={
            'location': 'Chennai',
            'rating': 5,
            'comment': 'Ordered the 8x10 tabletop frame for our anniversary. The wood border and engraved Tamil plaque looks fantastic on our desk!'
        }
    )

    print("Seed complete successfully!")

if __name__ == '__main__':
    seed()
