import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { 
  Bot, 
  X, 
  Send, 
  User, 
  ShieldCheck, 
  Truck, 
  Store, 
  RotateCcw,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

// =========================================================================
// STRICT ROLE-ISOLATED KNOWLEDGE BASES
// =========================================================================

const CUSTOMER_DATA = {
  roleBadgeEn: 'Customer Assistant',
  roleBadgeTa: 'வாடிக்கையாளர் வழிகாட்டி',
  roleIcon: User,
  greetingEn: "Hello! I'm your TN36 Gifts Assistant. How can I help you customize keepsakes, track orders, or manage your account today?",
  greetingTa: "வணக்கம்! நான் உங்கள் TN36 கிஃப்ட்ஸ் AI உதவியாளர். பரிசுகளை வடிவமைக்க, ஆர்டரை கண்காணிக்க அல்லது கணக்கை நிர்வகிக்க எவ்வாறு உதவலாம்?",
  categories: [
    {
      id: 'customize',
      titleEn: '🎨 Customizing & Studio Doubts',
      titleTa: '🎨 தனிப்பயன் ஸ்டுடியோ & வடிவமைப்பு',
      questions: [
        {
          qEn: 'How to customize a 2-sided acrylic photo keychain?',
          qTa: 'இருபுற சாவிக்கொத்தை எப்படி வடிவமைப்பது?',
          ansEn: "To customize your keepsake:\n1. Click 'Shop Gifts' from the top menu and pick your product.\n2. Click 'Customize' to enter the live studio.\n3. Choose your shape (Heart, Circle, Square, or TN Tag).\n4. Upload Front & Back photos, adjust zoom/crop, and type optional laser engraving text.\n5. Click 'Preview Keepsake' to inspect the 3D render before adding to cart!",
          ansTa: "சாவிக்கொத்தை வடிவமைக்க எளிய படிகள்:\n1. 'Shop Gifts' பக்கத்தில் சென்று தயாரிப்பைத் தேர்வு செய்து 'Customize' அழுத்தவும்.\n2. இதயம், வட்டம், சதுரம் அல்லது TN வாகன பலகை வடிவத்தை தேர்வு செய்யவும்.\n3. முன் & பின் பக்கங்களுக்கு தனித்தனியாக புகைப்படங்களை பதிவேற்றி, ஜூம் அட்ஜஸ்ட் செய்து, பெயர் பொறிப்பை சேர்க்கவும்.\n4. 'Preview' பொத்தானை அழுத்தி மாதிரி தோற்றத்தை சரிபார்த்து கூடையில் சேர்க்கவும்!",
          action: { labelEn: 'Open Products Catalog', labelTa: 'பொருட்களை பார்க்க', path: '/products' }
        },
        {
          qEn: 'How to zoom, rotate, or change photos for Front & Back sides?',
          qTa: 'முன் & பின் பக்க புகைப்படங்களை மாற்றுவது மற்றும் ஜூம் செய்வது எப்படி?',
          ansEn: "Inside the Studio, tap 'Front Side' or 'Back Side' to switch surfaces. Use the Zoom slider (+ / -) to center your face inside the silhouette cutout. Tap 'Change Photo' anytime to pick a different image.",
          ansTa: "ஸ்டுடியோவில் 'Front Side' அல்லது 'Back Side' பொத்தானை அழுத்தி பக்கத்தை மாற்றவும். ஜூம் ஸ்லைடரை (+ / -) பயன்படுத்தி முகத்தை மையத்தில் வைக்கவும். படத்தை மாற்ற 'Change Photo' அழுத்தவும்.",
          action: { labelEn: 'Go to Customizer', labelTa: 'ஸ்டுடியோ செல்ல', path: '/products' }
        },
        {
          qEn: 'How to add Tamil or English laser name engraving?',
          qTa: 'தமிழ் அல்லது ஆங்கிலத்தில் பெயர் பொறிப்பது எப்படி?',
          ansEn: "Under Step 3 in the studio, type your names or dates. You can also tap our instant Tamil phrase chips (e.g. 'அன்புடன்', 'என் இனிய குடும்பம்', 'அம்மா ❤️ அப்பா') or auspicious symbols (🕉️, 🪔, 🦚, ❤️).",
          ansTa: "ஸ்டுடியோவில் படி 3-ல் உங்கள் பெயர் அல்லது தேதியை தட்டச்சு செய்யலாம். மேலும் எங்களின் விரைவு தமிழ் வாசக சிப்ஸ்களை (எ.கா: 'அன்புடன்', 'குடும்பம்', 'அம்மா அப்பா') மற்றும் மங்கள சின்னங்களை (🕉️, 🪔, 🦚) ஒரு டச் மூலம் சேர்க்கலாம்.",
          action: { labelEn: 'Try Engraving Helper', labelTa: 'ஸ்டுடியோ செல்ல', path: '/products' }
        },
        {
          qEn: 'What photo resolution/format is best for printing?',
          qTa: 'எந்த வகையான புகைப்படங்கள் சிறந்தது?',
          ansEn: "Any clear smartphone photo in JPG or PNG format works great! Our studio applies high-gloss UV resin coating that enhances clarity and protects against scratches.",
          ansTa: "ஸ்மார்ட்போனில் எடுக்கப்பட்ட தெளிவான JPG அல்லது PNG புகைப்படங்கள் போதுமானது! எங்களின் UV ரெசின் கோட்டிங் படத்தின் தரத்தை அதிகரித்து கீறல்கள் விழாமல் பாதுகாக்கும்.",
          action: { labelEn: 'Browse Products', labelTa: 'பொருட்கள் பார்க்க', path: '/products' }
        }
      ]
    },
    {
      id: 'orders_tracking',
      titleEn: '🚚 Delivery, Tracking & Guarantees',
      titleTa: '🚚 டெலிவரி, டிராக்கிங் & உத்தரவாதம்',
      questions: [
        {
          qEn: 'How to track my live order delivery status?',
          qTa: 'ஆர்டர் நிலையை எப்படி டிராக்கிங் செய்வது?',
          ansEn: "Go to the 'Track Order' page from the navigation bar, enter your Order ID (e.g. ORD-1048), and click 'Track Route' to see all 5 dispatch checkpoints from laser cutting to doorstep courier delivery.",
          ansTa: "மேல் மெனுவில் 'Track Order' பக்கத்திற்கு சென்று உங்கள் ஆர்டர் எண்ணை (எ.கா: ORD-1048) உள்ளிட்டு 'Track Route' அழுத்தினால், லேசர் கட்டிங் முதல் வீட்டு டெலிவரி வரையிலான நேரடி நிலையை பார்க்கலாம்.",
          action: { labelEn: 'Live Route Tracker', labelTa: 'நேரடி டிராக்கிங்', path: '/track-order' }
        },
        {
          qEn: 'How long does delivery take across Tamil Nadu?',
          qTa: 'டெலிவரிக்கு எத்தனை நாட்கள் ஆகும்?',
          ansEn: "We laser-craft all items within 24-48 hours at our Gobichettipalayam workshop. Courier delivery takes 2-4 business days across all 38 districts of Tamil Nadu (Chennai, Coimbatore, Madurai, Salem, etc.).",
          ansTa: "கோபிசெட்டிபாளையம் பட்டறையில் 24 முதல் 48 மணி நேரத்தில் லேசர் பிரிண்ட் செய்யப்பட்டு, சென்னை, கோவை, மதுரை, சேலம் உட்பட தமிழ்நாடு முழுவதும் 2-4 நாட்களில் டெலிவரி செய்யப்படும்.",
          action: { labelEn: 'Track Existing Order', labelTa: 'ஆர்டரை கண்காணிக்க', path: '/track-order' }
        },
        {
          qEn: 'Is doorstep shipping free?',
          qTa: 'டெலிவரி கட்டணம் இலவசமா?',
          ansEn: "Yes! Doorstep courier delivery across Tamil Nadu is 100% FREE on all individual and bulk orders.",
          ansTa: "ஆம்! தமிழ்நாடு முழுவதும் அனைத்து ஆர்டர்களுக்கும் கூரியர் டெலிவரி 100% இலவசம்.",
          action: { labelEn: 'Shop Now', labelTa: 'ஷாப்பிங் செய்ய', path: '/products' }
        },
        {
          qEn: 'What if my package arrives damaged (Replacement Guarantee)?',
          qTa: 'பார்சல் சேதமடைந்தால் மாற்று உத்தரவாதம் உள்ளதா?',
          ansEn: "We offer a 100% Free Transit Replacement Guarantee. If your acrylic item is damaged during shipping, just send a photo to our WhatsApp care team (+91 6379979364) and we will dispatch a brand new piece free of cost.",
          ansTa: "ஆம், 100% இலவச மாற்று உத்தரவாதம் உண்டு! பார்சல் சேதமடைந்தால் அதன் புகைப்படத்தை எங்கள் வாட்ஸ்அப் உதவி எண்ணிற்கு (+91 6379979364) அனுப்பினால், உடனடியாக புதிய பரிசு இலவசமாக அனுப்பி வைக்கப்படும்.",
          action: { labelEn: 'Customer Support', labelTa: 'உதவி எண்', path: '/' }
        }
      ]
    },
    {
      id: 'payment_coupons',
      titleEn: '💳 Payments, Coupons & Bulk Offers',
      titleTa: '💳 கட்டணம், கூப்பன் & மொத்த தள்ளுபடி',
      questions: [
        {
          qEn: 'How does direct UPI QR code payment (GPay/PhonePe) work?',
          qTa: 'UPI QR மூலம் பணம் செலுத்துவது எப்படி?',
          ansEn: "During checkout, select 'GPay / PhonePe QR'. A dynamic QR code will appear on screen with your exact order total. Scan with Google Pay, PhonePe, Paytm, or BHIM, make payment with 0% extra transaction fee, and enter the 12-digit UPI UTR receipt number.",
          ansTa: "செக்அவுட்டில் 'GPay / PhonePe QR' தேர்வு செய்யவும். திரையில் தோன்றும் QR குறியீட்டை Google Pay, PhonePe, Paytm அல்லது BHIM மூலம் ஸ்கேன் செய்து 0% கட்டணத்தில் செலுத்திவிட்டு, 12-இலக்க UTR எண்ணை உள்ளிடவும்.",
          action: { labelEn: 'Go to Cart', labelTa: 'கூடை செல்ல', path: '/cart' }
        },
        {
          qEn: 'How to apply coupon codes like WELCOME10 or GOBI50?',
          qTa: 'கூப்பன் தள்ளுபடி பயன்படுத்துவது எப்படி?',
          ansEn: "In your Shopping Cart, find the 'Promo Code' input box, enter WELCOME10 (10% off) or GOBI50 (₹50 off), and click 'Apply' for instant deduction.",
          ansTa: "உங்கள் கூடையில் (Cart) உள்ள 'Promo Code' பெட்டியில் WELCOME10 (10% தள்ளுபடி) அல்லது GOBI50 (₹50 தள்ளுபடி) என உள்ளிட்டு 'Apply' அழுத்தினால் தொகை குறையும்.",
          action: { labelEn: 'Open Cart', labelTa: 'கூடை பார்க்க', path: '/cart' }
        },
        {
          qEn: 'Is Cash on Delivery (COD) available?',
          qTa: 'Cash on Delivery (COD) வசதி உள்ளதா?',
          ansEn: "Yes! You can select 'Cash on Delivery' at checkout and pay in cash when the delivery partner hands over your parcel.",
          ansTa: "ஆம்! செக்அவுட்டில் 'Cash on Delivery' தேர்வு செய்து பார்சல் வரும்போது நேரில் பணம் செலுத்தலாம்.",
          action: { labelEn: 'View Checkout', labelTa: 'செக்அவுட் பார்க்க', path: '/cart' }
        },
        {
          qEn: 'How do bulk wedding / Thamboolam wholesale discounts work?',
          qTa: 'திருமண தாம்பூல மொத்த ஆர்டர் தள்ளுபடி விவரங்கள்?',
          ansEn: "Bulk orders of 25 to 500+ pieces unlock wholesale pricing (from ₹99 to ₹129 per piece) with free individual yellow thamboolam pouches and name tags. Use our 'Bulk Gift Calculator' on the Home page to get an instant WhatsApp quote!",
          ansTa: "25 முதல் 500+ எண்ணிக்கை வரையிலான மொத்த ஆர்டர்களுக்கு தொழிற்சாலை நேரடி விலை (₹99 முதல் ₹129 வரை) மற்றும் இலவச மஞ்சள் தாம்பூலப் பைகள் உண்டு. முகப்பு பக்கத்தில் உள்ள கால்குலேட்டர் மூலம் கணித்து வாட்ஸ்அப்பில் புக் செய்யலாம்!",
          action: { labelEn: 'Bulk Calculator', labelTa: 'மொத்த கால்குலேட்டர்', path: '/' }
        }
      ]
    },
    {
      id: 'account_settings',
      titleEn: '👤 Account, Address & Language Settings',
      titleTa: '👤 கணக்கு, முகவரி & மொழி அமைப்புகள்',
      questions: [
        {
          qEn: 'How to update my saved shipping address or name?',
          qTa: 'சேமிக்கப்பட்ட முகவரியை மாற்றுவது எப்படி?',
          ansEn: "Go to 'My Account / Profile' from the top menu, select the 'Saved Address' tab, update your street, city, district, and pincode, and click 'Save Address'.",
          ansTa: "மேல் மெனுவில் 'சுயவிவரம் (Profile)' பக்கத்திற்கு சென்று 'Saved Address' டேப்பில் உங்கள் முகவரி, மாவட்டம், பின்கோடு போன்றவற்றை புதுப்பித்து 'Save' செய்யவும்.",
          action: { labelEn: 'Go to Profile', labelTa: 'சுயவிவரம் செல்ல', path: '/profile' }
        },
        {
          qEn: 'How to switch language between English and தமிழ்?',
          qTa: 'மொழியை English மற்றும் தமிழுக்கு மாற்றுவது எப்படி?',
          ansEn: "Click the '🌐 தமிழ் / English' button in the top navigation header or visit Profile > 'Language & Settings' to toggle between English and Tamil anytime.",
          ansTa: "மேல் மெனுவில் உள்ள '🌐 English / தமிழ்' பொத்தானை கிளிக் செய்தோ அல்லது Profile > 'Language & Settings' பக்கத்தில் சென்றோ மொழியை மாற்றலாம்.",
          action: { labelEn: 'Open Language Settings', labelTa: 'மொழி அமைப்புகள்', path: '/profile' }
        },
        {
          qEn: 'Where can I view my previous order history & receipts?',
          qTa: 'முந்தைய ஆர்டர் விவரங்களை எங்கு பார்ப்பது?',
          ansEn: "Sign in to your account and click 'Profile' > 'My Orders' to see all your past orders, amounts, and one-tap tracking links.",
          ansTa: "உங்கள் கணக்கில் உள்நுழைந்து Profile > 'My Orders' டேப்பில் சென்றால் அனைத்து முந்தைய ஆர்டர்கள் மற்றும் டிராக்கிங் இணைப்புகளை பார்க்கலாம்.",
          action: { labelEn: 'View Order History', labelTa: 'ஆர்டர்கள் விவரம்', path: '/profile' }
        }
      ]
    }
  ]
};

const ADMIN_DATA = {
  roleBadgeEn: 'System Admin Assistant',
  roleBadgeTa: 'நிர்வாகி AI வழிகாட்டி',
  roleIcon: ShieldCheck,
  greetingEn: "Admin Mode Active. Here are your administrator management controls for catalog products, driver assignments, and orders:",
  greetingTa: "நிர்வாகி பயன்முறை செயலில் உள்ளது. தயாரிப்புகள் மேலாண்மை மற்றும் டிரைவர் ஒதுக்கீடு வழிகாட்டல்கள்:",
  categories: [
    {
      id: 'admin_catalog',
      titleEn: '📦 Product Catalog Management',
      titleTa: '📦 தயாரிப்புகள் மேலாண்மை',
      questions: [
        {
          qEn: 'How to add a new product with prices and shapes?',
          qTa: 'புதிய தயாரிப்பை எப்படி சேர்ப்பது?',
          ansEn: "Go to Admin Dashboard (/admin/products), fill in Product Name, Category, Base Price, Offer Price, and Description, then click 'Save Product' to publish it immediately.",
          ansTa: "Admin Dashboard (/admin/products) சென்று 'Add New Product' படிவத்தில் பெயர், வகை, விலை மற்றும் விவரங்களை பூர்த்தி செய்து 'Save Product' அழுத்தவும்.",
          action: { labelEn: 'Admin Dashboard', labelTa: 'நிர்வாக பக்கம்', path: '/admin/products' }
        },
        {
          qEn: 'How to edit or delete existing catalog products?',
          qTa: 'பழைய தயாரிப்புகளை திருத்துவது அல்லது நீக்குவது எப்படி?',
          ansEn: "In Admin Dashboard > 'Catalog Products Table', click 'Edit' to update prices or 'Delete' to remove the item from the catalog.",
          ansTa: "Admin Dashboard-ல் உள்ள தயாரிப்புகள் அட்டவணையில் 'Edit' மூலம் விலையை மாற்றலாம் அல்லது 'Delete' மூலம் நீக்கலாம்.",
          action: { labelEn: 'Manage Catalog', labelTa: 'தயாரிப்புகள் மேலாண்மை', path: '/admin/products' }
        }
      ]
    },
    {
      id: 'admin_orders',
      titleEn: '🚚 Order Dispatch & Partner Assignment',
      titleTa: '🚚 ஆர்டர் விநியோகம் & டிரைவர் ஒதுக்கீடு',
      questions: [
        {
          qEn: 'How to assign a delivery partner/driver to an order?',
          qTa: 'ஆர்டருக்கு டெலிவரி பார்ட்னரை நியமிப்பது எப்படி?',
          ansEn: "In Admin Dashboard > 'Manage Orders', locate the pending order and select an active driver from the 'Assign Delivery Partner' dropdown.",
          ansTa: "Admin Dashboard-ல் உள்ள ஆர்டர்கள் அட்டவணையில் ஆர்டரை தேர்ந்தெடுத்து 'Assign Delivery Partner' டிராப்டவுனில் இருந்து டிரைவரை ஒதுக்கலாம்.",
          action: { labelEn: 'Assign Drivers', labelTa: 'டிரைவர் ஒதுக்கீடு', path: '/admin/products' }
        },
        {
          qEn: 'How to view revenue, order breakdown & statuses?',
          qTa: 'விற்பனை வருமானம் மற்றும் ஆர்டர் நிலையை பார்ப்பது எப்படி?',
          ansEn: "The Admin Dashboard summary cards display Total Revenue, Active Orders, Pending Laser Cuts, and Completed Dispatches in real time.",
          ansTa: "Admin Dashboard-ன் மேல் பகுதியில் மொத்த வருவாய், நிலுவையில் உள்ள ஆர்டர்கள் மற்றும் முடிவடைந்த டெலிவரிகள் நேரலையாக காட்டப்படும்.",
          action: { labelEn: 'View Metrics', labelTa: 'விவரங்கள் பார்க்க', path: '/admin/products' }
        }
      ]
    }
  ]
};

const SHOP_OWNER_DATA = {
  roleBadgeEn: 'Workshop Owner Guide',
  roleBadgeTa: 'பட்டறை உரிமையாளர் வழிகாட்டி',
  roleIcon: Store,
  greetingEn: "Workshop Owner Mode Active. Here are your fabrication queue tools and payment verification steps:",
  greetingTa: "பட்டறை உரிமையாளர் பயன்முறை செயலில் உள்ளது. லேசர் கட்டிங் வரிசை மற்றும் பணம் சரிபார்ப்பு வழிகாட்டல்கள்:",
  categories: [
    {
      id: 'workshop_laser',
      titleEn: '🔬 Laser Cutting & Photo Inspection',
      titleTa: '🔬 லேசர் கட்டிங் & புகைப்பட சரிபார்ப்பு',
      questions: [
        {
          qEn: 'How to download high-res customer photo PNG blobs for laser cutting?',
          qTa: 'வாடிக்கையாளர் புகைப்படங்களை லேசர் பிரிண்டருக்கு பதிவிறக்குவது எப்படி?',
          ansEn: "Open the Order Inspection view in Admin Orders. Each item contains cropped Front & Back PNG blob URLs ready for UV laser printing.",
          ansTa: "Admin Orders பக்கத்தில் ஆர்டர் விவரங்களை திறந்து, வாடிக்கையாளர் கிராப் செய்த Front/Back PNG படங்களை பதிவிறக்கி லேசர் பிரிண்டருக்கு அனுப்பலாம்.",
          action: { labelEn: 'View Orders Queue', labelTa: 'ஆர்டர்கள் வரிசை', path: '/admin/products' }
        },
        {
          qEn: 'How to verify 12-digit UPI UTR transaction numbers?',
          qTa: 'வாடிக்கையாளர் UPI UTR எண்களை வங்கி கணக்குடன் சரிபார்ப்பது எப்படி?',
          ansEn: "Each UPI order logs the customer's 12-digit UTR reference number. Cross-reference this with your Axis merchant statement to confirm settlement.",
          ansTa: "ஒவ்வொரு UPI ஆர்டரிலும் உள்ள 12-இலக்க UTR குறிப்பு எண்ணை உங்கள் வங்கி கணக்கு ஸ்டேட்மென்ட்டுடன் ஒப்பிட்டு உறுதிப்படுத்தலாம்.",
          action: { labelEn: 'Admin Orders', labelTa: 'ஆர்டர்கள் பார்க்க', path: '/admin/products' }
        }
      ]
    }
  ]
};

const DELIVERY_PARTNER_DATA = {
  roleBadgeEn: 'Delivery Driver Guide',
  roleBadgeTa: 'டெலிவரி டிரைவர் வழிகாட்டி',
  roleIcon: Truck,
  greetingEn: "Delivery Partner Mode Active. Here are your assigned dispatch tools and route checkpoint controls:",
  greetingTa: "டெலிவரி பார்ட்னர் பயன்முறை செயலில் உள்ளது. பார்சல்கள் விநியோகம் மற்றும் நேரடி வழிகாட்டல்கள்:",
  categories: [
    {
      id: 'driver_dispatches',
      titleEn: '📍 Assigned Dispatches & Checkpoints',
      titleTa: '📍 ஒதுக்கப்பட்ட பார்சல்கள் & நிலைகள்',
      questions: [
        {
          qEn: 'How to view my assigned parcel delivery list and addresses?',
          qTa: 'எனக்கு ஒதுக்கப்பட்ட பார்சல்கள் மற்றும் முகவரிகளை பார்ப்பது எப்படி?',
          ansEn: "Open the Delivery Partner Portal (/partner-login) to see all parcels assigned to your driver ID, including customer names, full addresses, and contact numbers.",
          ansTa: "டெலிவரி பார்ட்னர் போர்ட்டலில் (/partner-login) நுழைந்து உங்களுக்கு ஒதுக்கப்பட்ட பார்சல்கள், வாடிக்கையாளர் முகவரி மற்றும் போன் எண்களை பார்க்கலாம்.",
          action: { labelEn: 'Open Dispatches Portal', labelTa: 'விநியோக தளம்', path: '/partner-login' }
        },
        {
          qEn: 'How to advance route checkpoints (Dispatched -> In Transit -> Delivered)?',
          qTa: 'டெலிவரி நிலையை (In Transit / Delivered) மாற்றுவது எப்படி?',
          ansEn: "Inside the dispatch card on your driver portal, tap 'Advance Stage' to update the customer's live GPS route tracker in real time.",
          ansTa: "உங்கள் டிரைவர் போர்ட்டலில் உள்ள ஆர்டர் கார்டில் 'Advance Stage' பொத்தானை அழுத்தினால், வாடிக்கையாளரின் நேரடி டிராக்கிங்கில் நிலை உடனடியாக மாறும்.",
          action: { labelEn: 'Driver Portal', labelTa: 'போர்டல் செல்ல', path: '/partner-login' }
        },
        {
          qEn: 'How to call a customer directly with one-tap phone dialer?',
          qTa: 'வாடிக்கையாளரை போனில் நேரடியாக அழைப்பது எப்படி?',
          ansEn: "Tap the green 'Call Customer' button next to the customer's phone number to trigger your mobile phone dialer instantly.",
          ansTa: "வாடிக்கையாளர் போன் எண் அருகில் உள்ள பச்சை நிற 'Call Customer' பொத்தானை தட்டினால் உங்கள் போன் டயலர் நேரடியாக திறக்கும்.",
          action: { labelEn: 'View Dispatches', labelTa: 'பார்சல்கள் பார்க்க', path: '/partner-login' }
        }
      ]
    }
  ]
};

export default function AiChatbot() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuestionMenu, setShowQuestionMenu] = useState(true);

  const messagesEndRef = useRef(null);
  const isTamil = i18n.language === 'ta';

  // 100% STRICT LOGIN-ROLE DETERMINATION (No manual role switching possible)
  const userRole = user?.role ? String(user.role).toLowerCase() : 'customer';
  
  let roleData = CUSTOMER_DATA; // Defaults strictly to customer
  if (userRole === 'admin' || userRole === 'super_admin') {
    roleData = ADMIN_DATA;
  } else if (userRole === 'shop_owner') {
    roleData = SHOP_OWNER_DATA;
  } else if (userRole.includes('delivery') || userRole.includes('driver') || userRole.includes('partner')) {
    roleData = DELIVERY_PARTNER_DATA;
  }

  const RoleIcon = roleData.roleIcon;

  // Initialize greeting strictly for the logged-in role
  useEffect(() => {
    const greetingText = isTamil ? roleData.greetingTa : roleData.greetingEn;
    setMessages([
      {
        id: 'initial-greeting',
        sender: 'bot',
        text: greetingText,
        action: null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setShowQuestionMenu(true);
  }, [userRole, isTamil]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, showQuestionMenu]);

  const handleSelectQuestion = (qObj) => {
    const userQuery = isTamil ? qObj.qTa : qObj.qEn;
    const botAnswer = isTamil ? qObj.ansTa : qObj.ansEn;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botAnswer,
        action: qObj.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      setShowQuestionMenu(false);
    }, 350);
  };

  const handleSendMessage = (customText) => {
    const query = (customText || inputVal).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      // Find closest matching answer strictly within active role's categories
      let matchedAnswer = null;
      let matchedAction = null;
      const lowerQ = query.toLowerCase();

      roleData.categories.forEach(cat => {
        cat.questions.forEach(qItem => {
          const qText = (qItem.qEn + ' ' + qItem.qTa + ' ' + qItem.ansEn + ' ' + qItem.ansTa).toLowerCase();
          if (qText.includes(lowerQ) || lowerQ.split(' ').some(w => w.length > 3 && qText.includes(w))) {
            matchedAnswer = isTamil ? qItem.ansTa : qItem.ansEn;
            matchedAction = qItem.action;
          }
        });
      });

      if (!matchedAnswer) {
        matchedAnswer = isTamil
          ? "மன்னிக்கவும், உங்கள் கேள்விக்குரிய பதிலை அறிய கீழே உள்ள தலைப்புகளில் இருந்து தேர்ந்தெடுக்கலாம் அல்லது எங்கள் கைவினை பட்டறையுடன் வாட்ஸ்அப்பில் நேரடியாக தொடர்பு கொள்ளலாம்:"
          : "Please select any of the topics below to get instant guidance on customizing, tracking, payments, or your account, or chat directly with our workshop team on WhatsApp:";
        matchedAction = { labelEn: '💬 Chat on WhatsApp (+91 6379979364)', labelTa: '💬 வாட்ஸ்அப் உதவி (+91 6379979364)', path: 'whatsapp' };
        setShowQuestionMenu(true);
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: matchedAnswer,
        action: matchedAction,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    const greetingText = isTamil ? roleData.greetingTa : roleData.greetingEn;
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: greetingText,
        action: null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setShowQuestionMenu(true);
  };

  return (
    <>
      {/* Floating Chat Launcher Button (Responsive for mobile & desktop) */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-900 text-white shadow-xl hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center relative"
          title="Open AI Assistant"
        >
          {isOpen ? <X size={19} /> : <Bot size={21} className="animate-pulse" />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
          )}
        </button>
      </div>

      {/* AI Assistant Modal Window */}
      {isOpen && (
        <div className="fixed bottom-36 md:bottom-22 right-2 sm:right-6 z-50 w-[94vw] sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[490px] sm:h-[540px] animate-in slide-in-from-bottom-3 duration-150">
          
          {/* Header strictly showing active logged-in role only */}
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <RoleIcon size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  <span>TN36 Gifts AI Assistant</span>
                  <span className="badge-pill bg-emerald-500 text-slate-950 text-[9px] py-0 px-1.5 font-black">
                    ONLINE
                  </span>
                </h3>
                <p className="text-[10px] text-orange-400 font-bold">
                  {isTamil ? roleData.roleBadgeTa : roleData.roleBadgeEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Restart Chat & Show Menu"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Close Chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Transcript Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-slate-50/60 text-xs">
            
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[88%] rounded-2xl p-3 shadow-xs space-y-2 leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-orange-600 text-white rounded-br-none font-semibold' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Direct Action Shortcut */}
                  {msg.action && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        if (msg.action.path === 'whatsapp') {
                          window.open('https://wa.me/916379979364?text=Hi%20TN36%20Custom%20Gifts,%20I%20need%20custom%20assistance', '_blank');
                        } else {
                          navigate(msg.action.path);
                        }
                      }}
                      className="mt-2 w-full py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200 font-black text-[11px] flex items-center justify-between transition-all"
                    >
                      <span>{isTamil ? msg.action.labelTa : msg.action.labelEn}</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 px-1 mt-0.5">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 p-2 bg-white rounded-xl border border-slate-200 w-16 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            )}

            {/* List of Role Questions Strictly For Current Role */}
            {showQuestionMenu && (
              <div className="pt-2 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 border-b border-slate-200 pb-1.5">
                  <span>{isTamil ? 'அனைத்து கேள்விகள் & வழிகாட்டல்கள்:' : 'Browse All Help Topics & Doubts:'}</span>
                </div>

                {roleData.categories.map(cat => (
                  <div key={cat.id} className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2 shadow-xs">
                    <h4 className="font-black text-slate-900 text-xs">
                      {isTamil ? cat.titleTa : cat.titleEn}
                    </h4>

                    <div className="space-y-1">
                      {cat.questions.map((qObj, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectQuestion(qObj)}
                          className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-950 text-slate-700 text-[11px] font-bold flex items-center justify-between group transition-all border border-slate-100"
                        >
                          <span className="pr-2">{isTamil ? qObj.qTa : qObj.qEn}</span>
                          <ChevronRight size={13} className="text-slate-400 group-hover:text-orange-600 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showQuestionMenu && (
              <div className="pt-1 text-center">
                <button
                  onClick={() => setShowQuestionMenu(true)}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-800 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1"
                >
                  <HelpCircle size={12} />
                  <span>{isTamil ? 'அனைத்து கேள்விகளையும் மீண்டும் காட்டுக' : 'Show All Help Questions'}</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={isTamil ? "உங்கள் கேள்வியை தட்டச்சு செய்க..." : "Type your question..."}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-orange-500 bg-slate-50 font-medium"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-xs transition-colors shrink-0"
              title="Send Message"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
