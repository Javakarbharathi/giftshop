import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header & Navigation
      "brand_title": "TN36 Custom Gifts",
      "brand_subtitle": "Personalized Keepsakes Studio",
      "nav_home": "Home",
      "nav_shop": "Shop Gifts",
      "nav_track": "Track Order",
      "nav_admin": "Admin",
      "nav_dispatches": "Dispatches",
      "nav_profile": "Profile",
      "nav_login": "Login",
      "nav_logout": "Logout",
      "switch_language": "தமிழ்",

      // Hero Section
      "hero_badge": "Gobichettipalayam Personalized Keepsakes • Handcrafted in Tamil Nadu",
      "hero_title_prefix": "Turn Cherished Moments Into",
      "hero_title_highlight": "Custom Keepsakes",
      "hero_desc": "Two-sided crystal clear acrylic photo keychains, vehicle registration tags, and wedding return gifts handcrafted with precision laser fabrication.",
      "hero_cta_shop": "Explore Custom Gifts",
      "hero_cta_track": "Live Route Tracker",
      "hero_stat_delivered": "25k+ Gifts Delivered",
      "hero_stat_rating": "4.9 Customer Rating",
      "hero_stat_dispatch": "24-48h Fast Dispatch",
      "hero_preview_badge": "Live Studio Sample",
      "hero_preview_category": "Wedding Keepsake",
      "hero_preview_cta": "Customize Now",

      // Popular Gifts Showcase
      "popular_tagline": "Curated Collections",
      "popular_title": "Popular Personalized Keepsakes",
      "popular_view_all": "View All Products →",
      "price_free_ship": "Free Ship",

      // 3 Easy Steps Guide
      "steps_tagline": "Frictionless 3-Step Process",
      "steps_title": "Customize Your Gift in Seconds",
      "step1_title": "1. Pick Your Shape",
      "step1_desc": "Choose romantic heart, classic circle, modern square, or Tamil Nadu vehicle plate tags.",
      "step2_title": "2. Photos & Engraving",
      "step2_desc": "Upload front and back photos with optional custom Tamil or English laser name engraving.",
      "step3_title": "3. Doorstep Delivery",
      "step3_desc": "Fabricated at our workshop and dispatched across Tamil Nadu with live tracking.",

      // Testimonials & FAQs
      "testimonials_tagline": "Verified Customer Reviews",
      "testimonials_title": "Loved by Customers Across Tamil Nadu",
      "faq_tagline": "Got Questions?",
      "faq_title": "Frequently Asked Questions",

      // Products Catalog Page
      "catalog_badge": "Tamil Nadu Collection",
      "catalog_title": "Custom Acrylic Keepsakes Catalog",
      "catalog_subtitle": "Select any gift item to open the live photo studio and preview your design.",
      "cat_all": "All Items",
      "cat_wedding": "Wedding Gifts",
      "cat_keychains": "Photo Keychains",
      "cat_vehicles": "TN Vehicle Plates",
      "search_placeholder": "Search gifts (e.g. TN 36, Wedding)...",
      "sort_label": "Sort By:",
      "sort_featured": "Featured Picks",
      "sort_low": "Price: Low to High",
      "sort_high": "Price: High to Low",
      "sort_name": "Name: A to Z",
      "btn_customize": "Customize",
      "quick_view": "Quick View",

      // Customizer Studio Page
      "studio_step_badge": "Personalized Studio",
      "studio_step_title": "Step 1 of 2",
      "studio_shape_label": "1. Select Silhouette Shape",
      "studio_side_label": "2. Choose Surface Side",
      "studio_side_front": "Front Side",
      "studio_side_back": "Back Side",
      "studio_engraving_label": "3. Laser Name Engraving (Optional)",
      "studio_engraving_placeholder": "e.g. Karthik & Priya (24.08.2024)",
      "studio_editing_badge": "Currently Editing:",
      "studio_change_photo": "Change Photo",
      "studio_upload_btn": "Upload Photo",
      "studio_preview_btn": "Preview Keepsake →",
      "studio_starting_from": "Starting From",
      "studio_render_ready": "Mockup Render Ready",
      "studio_back_btn": "Back to Studio",
      "studio_edit_btn": "Adjust",
      "studio_quantity": "Quantity:",
      "studio_add_cart": "Add to Cart",
      "studio_free_shipping": "Free Shipping Included",

      // Cart Page
      "cart_badge": "Review & Packaging",
      "cart_title": "Your Shopping Cart",
      "cart_empty_title": "Your Shopping Cart is Empty",
      "cart_empty_desc": "Browse our catalog and personalize a gift with your favourite memories!",
      "cart_clear_all": "Clear Entire Cart",
      "cart_items_subtotal": "Items Subtotal:",
      "cart_coupon_discount": "Coupon Discount:",
      "cart_packaging_total": "Gift Packaging:",
      "cart_shipping_free": "FREE",
      "cart_total_payable": "Total Payable:",
      "cart_proceed_checkout": "Proceed to Checkout",
      "cart_packaging_checkbox": "Yellow Thamboolam Silk Gift Pouch (+₹35)",
      "cart_greeting_checkbox": "Handwritten Greeting Card (+₹20)",
      "cart_apply_coupon": "Apply",

      // Checkout Page
      "checkout_badge": "Step 2 of 2",
      "checkout_title": "Checkout & Delivery Details",
      "checkout_address_title": "Delivery Address in Tamil Nadu",
      "checkout_fullname": "Full Name *",
      "checkout_email": "Email Address *",
      "checkout_phone": "WhatsApp / Phone Number *",
      "checkout_district": "TN District *",
      "checkout_street": "Street & Door No *",
      "checkout_pincode": "Postal Pincode *",
      "checkout_payment_title": "Choose Payment Option",
      "checkout_pay_upi": "GPay / PhonePe QR",
      "checkout_pay_upi_desc": "Direct UPI QR Scan (0% Fee)",
      "checkout_pay_online": "Cards / Netbanking",
      "checkout_pay_online_desc": "Razorpay Secure Gateway",
      "checkout_pay_cod": "Cash on Delivery",
      "checkout_pay_cod_desc": "Pay cash when delivered",
      "checkout_order_summary": "Order Summary",
      "checkout_submit_btn": "Pay Securely & Place Order →",
      "checkout_confirmed_badge": "Order Confirmed & Logged",
      "checkout_thankyou_title": "Thank You for Your Order!",
      "checkout_thankyou_desc": "Our Gobichettipalayam workshop has received your custom order and started fabrication.",
      "checkout_track_btn": "Live Route Tracking",
      "checkout_home_btn": "Return Home",

      // Profile & Settings
      "profile_badge": "Customer Portal",
      "profile_title": "My Account",
      "profile_tab_orders": "My Orders",
      "profile_tab_wishlist": "My Wishlist",
      "profile_tab_address": "Saved Address",
      "profile_tab_settings": "Language & Settings",
      "profile_lang_title": "Display Language (மொழி தேர்வு)",
      "profile_lang_desc": "Select your preferred language for the entire website:",
      "profile_lang_en": "English (Default)",
      "profile_lang_ta": "தமிழ் (Tamil)",

      // Bulk Return Gift Calculator
      "bulk_calc_badge": "Wedding & Event Return Gifts",
      "bulk_calc_title": "Bulk Gift Calculator",
      "bulk_calc_subtitle": "Instant wholesale discounts for weddings, ear piercing, housewarming, and family events.",
      "bulk_calc_occasion": "1. Select Occasion:",
      "bulk_calc_qty": "2. Total Quantity:",
      "bulk_calc_shape": "3. Silhouette Shape:",
      "bulk_calc_estimate": "Instant Wholesale Estimate",
      "bulk_calc_savings": "You Save On This Order:",
      "bulk_calc_whatsapp_btn": "Book Bulk Order on WhatsApp →"
    }
  },
  ta: {
    translation: {
      // Header & Navigation
      "brand_title": "TN36 தனிப்பயன் பரிசுகள்",
      "brand_subtitle": "தனிப்பயன் அக்ரிலிக் பட்டறை",
      "nav_home": "முகப்பு",
      "nav_shop": "பரிசுகள்",
      "nav_track": "ஆர்டர் டிராக்கிங்",
      "nav_admin": "நிர்வாகம்",
      "nav_dispatches": "விநியோகம்",
      "nav_profile": "சுயவிவரம்",
      "nav_login": "உள்நுழைவு",
      "nav_logout": "வெளியேறு",
      "switch_language": "English",

      // Hero Section
      "hero_badge": "கோபிசெட்டிபாளையம் அக்ரிலிக் கைவினைப் பொருட்கள் • Made in TN",
      "hero_title_prefix": "உங்கள் இனிய நினைவுகளை",
      "hero_title_highlight": "அக்ரிலிக் பரிசாக மாற்றுங்கள்",
      "hero_desc": "இருபுறமும் ஒளிரும் அக்ரிலிக் புகைப்பட சாவிக்கொத்துகள், வாகன எண் பலகைகள், மற்றும் திருமண தாம்பூல சீர் பரிசுகள்.",
      "hero_cta_shop": "பரிசுகளை தேர்ந்தெடுக்க",
      "hero_cta_track": "நேரடி டிராக்கிங்",
      "hero_stat_delivered": "25k+ ஆர்டர்கள் விநியோகம்",
      "hero_stat_rating": "4.9 வாடிக்கையாளர் மதிப்பு",
      "hero_stat_dispatch": "24-48 மணி நேர தயாரிப்பு",
      "hero_preview_badge": "நேரடி மாதிரி",
      "hero_preview_category": "திருமண சீர் பரிசு",
      "hero_preview_cta": "இப்போதே உருவாக்குக",

      // Popular Gifts Showcase
      "popular_tagline": "விருப்பமான தயாரிப்புகள்",
      "popular_title": "பிரபலமான அக்ரிலிக் பரிசுகள்",
      "popular_view_all": "அனைத்தையும் பார்க்க →",
      "price_free_ship": "இலவச டெலிவரி",

      // 3 Easy Steps Guide
      "steps_tagline": "சுலபமான 3 படிகள்",
      "steps_title": "30 வினாடிகளில் உங்கள் பரிசை உருவாக்குங்கள்",
      "step1_title": "1. வடிவத்தை தேர்வு செய்க",
      "step1_desc": "இதயம், வட்டம், சதுரம், அல்லது தமிழ்நாடு வாகன எண் பலகை போன்ற வடிவங்களை தேர்வு செய்யவும்.",
      "step2_title": "2. புகைப்படம் & தமிழ் பெயர்",
      "step2_desc": "முன் & பின் பக்க புகைப்படங்களை பதிவேற்றி, பெயர் அல்லது தேதியை தமிழில் லேசரில் பொறிக்கவும்.",
      "step3_title": "3. நேரடி விநியோகம் & டிராக்கிங்",
      "step3_desc": "உங்கள் வீட்டு வாசலுக்கு விரைவாக டெலிவரி செய்யப்பட்டு நேரடி டிராக்கிங் வசதி வழங்கப்படும்.",

      // Testimonials & FAQs
      "testimonials_tagline": "உண்மை வாடிக்கையாளர் கருத்துக்கள்",
      "testimonials_title": "தமிழ்நாடு வாடிக்கையாளர்களின் ஆதரவு",
      "faq_tagline": "பொதுவான சந்தேகங்கள்",
      "faq_title": "அடிக்கடி கேட்கப்படும் கேள்விகள் & விடைகள்",

      // Products Catalog Page
      "catalog_badge": "தமிழ்நாடு பிரத்யேக பரிசுகள்",
      "catalog_title": "தனிப்பயன் அக்ரிலிக் பரிசுகள் பட்டியல்",
      "catalog_subtitle": "பரிசுகளை தேர்ந்தெடுத்து உங்கள் புகைப்படங்களுடன் தனிப்பயனாக்குங்கள்.",
      "cat_all": "அனைத்தும்",
      "cat_wedding": "திருமண சீர்",
      "cat_keychains": "சாவிக்கொத்துகள்",
      "cat_vehicles": "வாகன பலகை",
      "search_placeholder": "பரிசுகளை தேடுக (எ.கா: TN 36, Wedding)...",
      "sort_label": "வரிசைப்படுத்து:",
      "sort_featured": "பிரபலமானவை",
      "sort_low": "விலை: குறைவு முதல் அதிகம்",
      "sort_high": "விலை: அதிகம் முதல் குறைவு",
      "sort_name": "பெயர் வாரியாக",
      "btn_customize": "உருவாக்குக",
      "quick_view": "நேரடி பார்வை",

      // Customizer Studio Page
      "studio_step_badge": "தனிப்பயன் ஸ்டுடியோ",
      "studio_step_title": "படி 1 / 2",
      "studio_shape_label": "1. வடிவத்தை தேர்வு செய்க",
      "studio_side_label": "2. பக்கத்தை தேர்வு செய்க",
      "studio_side_front": "முன் பக்கம்",
      "studio_side_back": "பின் பக்கம்",
      "studio_engraving_label": "3. லேசர் பெயர் பொறிப்பு",
      "studio_engraving_placeholder": "எ.கா: கார்த்திக் & பிரியா (24.08.2024)",
      "studio_editing_badge": "தற்போது எடிட்டிங்:",
      "studio_change_photo": "படத்தை மாற்ற",
      "studio_upload_btn": "புகைப்படம் பதிவேற்றுக",
      "studio_preview_btn": "முன்னோட்டம் காண்க →",
      "studio_starting_from": "தொடக்க விலை",
      "studio_render_ready": "மாதிரி வடிவம் தயார்",
      "studio_back_btn": "மீண்டும் வடிவமைக்க",
      "studio_edit_btn": "மாற்றியமைக்க",
      "studio_quantity": "எண்ணிக்கை:",
      "studio_add_cart": "கூடையில் சேர்க்க",
      "studio_free_shipping": "இலவச டெலிவரி",

      // Cart Page
      "cart_badge": "கூடை ஆய்வு",
      "cart_title": "உங்கள் கூடை",
      "cart_empty_title": "உங்கள் கூடை காலியாக உள்ளது",
      "cart_empty_desc": "பரிசுகளை தேர்ந்தெடுத்து உங்கள் புகைப்படங்களுடன் தனிப்பயனாக்குங்கள்!",
      "cart_clear_all": "கூடையை காலியாக்குக",
      "cart_items_subtotal": "பொருட்கள் விலை:",
      "cart_coupon_discount": "கூப்பன் தள்ளுபடி:",
      "cart_packaging_total": "சிறப்பு பேக்கிங்:",
      "cart_shipping_free": "இலவசம்",
      "cart_total_payable": "செலுத்த வேண்டிய மொத்த தொகை:",
      "cart_proceed_checkout": "செக்அவுட் செய்ய",
      "cart_packaging_checkbox": "மஞ்சள் தாம்பூல சீர் பை (+₹35)",
      "cart_greeting_checkbox": "வாழ்த்து அட்டை (+₹20)",
      "cart_apply_coupon": "பயன்படுத்து",

      // Checkout Page
      "checkout_badge": "படி 2 / 2",
      "checkout_title": "முகவரி & கட்டணம்",
      "checkout_address_title": "டெலிவரி முகவரி (தமிழ்நாடு)",
      "checkout_fullname": "முழு பெயர் *",
      "checkout_email": "மின்னஞ்சல் முகவரி *",
      "checkout_phone": "தொலைபேசி எண் (WhatsApp) *",
      "checkout_district": "மாவட்டம் *",
      "checkout_street": "தெரு / கதவு எண் *",
      "checkout_pincode": "அஞ்சல் குறியீட்டு எண் *",
      "checkout_payment_title": "கட்டண முறை தேர்வு",
      "checkout_pay_upi": "GPay / PhonePe QR",
      "checkout_pay_upi_desc": "நேரடி UPI ஸ்கேனர் (0% கட்டணம்)",
      "checkout_pay_online": "கார்டுகள் / நெட்பேங்கிங்",
      "checkout_pay_online_desc": "Razorpay கேட்வே",
      "checkout_pay_cod": "Cash on Delivery",
      "checkout_pay_cod_desc": "நேரில் பணம் செலுத்துங்கள்",
      "checkout_order_summary": "ஆர்டர் சுருக்கம்",
      "checkout_submit_btn": "செலுத்தி ஆர்டர் செய்ய →",
      "checkout_confirmed_badge": "ஆர்டர் உறுதியானது",
      "checkout_thankyou_title": "உங்கள் ஆர்டருக்கு மிக்க நன்றி!",
      "checkout_thankyou_desc": "கோபிசெட்டிபாளையம் பட்டறையில் உங்கள் தனிப்பயன் பரிசு லேசர் கட்டிங் தொடங்கப்பட்டுவிட்டது.",
      "checkout_track_btn": "நேரடி டிராக்கிங்",
      "checkout_home_btn": "முகப்பு பக்கம்",

      // Profile & Settings
      "profile_badge": "வாடிக்கையாளர் தளம்",
      "profile_title": "என் கணக்கு",
      "profile_tab_orders": "என் ஆர்டர்கள்",
      "profile_tab_wishlist": "என் விருப்பப்பட்டியல்",
      "profile_tab_address": "சேமிக்கப்பட்ட முகவரி",
      "profile_tab_settings": "மொழி & அமைப்புகள்",
      "profile_lang_title": "மொழி தேர்வு (Language)",
      "profile_lang_desc": "இணையதளத்தை பார்க்க விரும்பும் மொழியை தேர்வு செய்யவும்:",
      "profile_lang_en": "English (ஆங்கிலம்)",
      "profile_lang_ta": "தமிழ் (Tamil - முன்னிருப்பு)",

      // Bulk Return Gift Calculator
      "bulk_calc_badge": "தாம்பூல சீர் பரிசுகள்",
      "bulk_calc_title": "மொத்த ஆர்டர் கால்குலேட்டர்",
      "bulk_calc_subtitle": "திருமணம், காதுகுத்து, கிரகப்பிரவேசம் நிகழ்வுகளுக்கு தொழிற்சாலை நேரடி தள்ளுபடி விலை.",
      "bulk_calc_occasion": "1. நிகழ்வு வகை:",
      "bulk_calc_qty": "2. பரிசு எண்ணிக்கை:",
      "bulk_calc_shape": "3. வடிவமைப்பு:",
      "bulk_calc_estimate": "மொத்த மதிப்பு கணிப்பு",
      "bulk_calc_savings": "நீங்கள் சேமிக்கும் தொகை:",
      "bulk_calc_whatsapp_btn": "வாட்ஸ்அப் மூலம் ஆர்டர் செய்ய →"
    }
  }
};

const savedLang = localStorage.getItem('gobi_gift_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;