import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Circle, 
  Square, 
  Shield, 
  Star, 
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import BulkReturnGiftCalculator from './BulkReturnGiftCalculator';

const POPULAR_GIFTS = [
  {
    id: 1,
    nameKey: 'South Indian Wedding Couple Heart Keychain',
    tamilName: 'பாரம்பரிய திருமண ஜோடி இதய சாவிக்கொத்து',
    price: '149',
    originalPrice: '249',
    badgeKey: 'Wedding Special',
    tamilBadge: 'திருமண சீர்',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    shape: 'heart',
    rating: '5.0',
    reviewsCount: '240',
    descKey: 'Double-sided silk saree wedding portrait with date laser engraving.',
    tamilDesc: 'இருபுறமும் பட்டுப் புடவை புகைப்படங்கள் மற்றும் திருமண தேதி லேசர் பொறிப்பு.'
  },
  {
    id: 4,
    nameKey: 'Luxury Acrylic & Wood Tabletop Photo Frame',
    tamilName: 'அக்ரிலிக் & மர மேஜை புகைப்பட சட்டகம்',
    price: '299',
    originalPrice: '499',
    badgeKey: 'Living Room Frame',
    tamilBadge: 'மேஜை சட்டகம்',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    shape: 'square',
    rating: '4.9',
    reviewsCount: '135',
    descKey: 'Custom sizes 4x6, 5x7, 8x10 with tabletop easel stand and engraved dedication.',
    tamilDesc: '4x6, 5x7, 8x10 அளவுகளில் மர சட்டகம் மற்றும் தமிழ் பெயர் பொறிப்பு.'
  },
  {
    id: 2,
    nameKey: 'TN Vehicle Number Plate Tag (TN 36 / 38 / 01)',
    tamilName: 'தமிழ்நாடு வாகன எண் பலகை சாவிக்கொத்து',
    price: '159',
    originalPrice: '249',
    badgeKey: 'Biker Favorite',
    tamilBadge: 'வாகன பலகை',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    shape: 'shield',
    rating: '4.9',
    reviewsCount: '180',
    descKey: 'Vehicle registration number, owner name and emergency QR tag.',
    tamilDesc: 'வண்டி எண், உரிமையாளர் பெயர் மற்றும் QR கோடுடன் கூடிய பலகை.'
  },
  {
    id: 5,
    nameKey: 'Temple Deity Car Mirror Hanging Charm',
    tamilName: 'சாமி படம் & கார் கண்ணாடி தொங்கான்',
    price: '189',
    originalPrice: '299',
    badgeKey: 'Devotional Keepsake',
    tamilBadge: 'பக்தி பரிசு',
    image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
    shape: 'star',
    rating: '5.0',
    reviewsCount: '95',
    descKey: 'Lord Murugan or Vinayagar acrylic charm for motorcycle & car rearview mirror.',
    tamilDesc: 'முருகன், விநாயகர் அருள் தரும் வாகன கண்ணாடி தொங்கான்.'
  }
];

// 7 Supported Shapes in Quick Preview
const SHAPE_BUTTONS = [
  { id: 'heart', labelEn: 'Heart', labelTa: 'இதயம்', icon: Heart, cssClass: 'shape-mask-heart' },
  { id: 'circle', labelEn: 'Circle', labelTa: 'வட்டம்', icon: Circle, cssClass: 'shape-mask-circle' },
  { id: 'square', labelEn: 'Square', labelTa: 'சதுரம்', icon: Square, cssClass: 'shape-mask-square' },
  { id: 'shield', labelEn: 'TN Tag', labelTa: 'TN பலகை', icon: Shield, cssClass: 'shape-mask-shield' },
  { id: 'oval', labelEn: 'Oval', labelTa: 'நீள்வட்டம்', icon: Circle, cssClass: 'shape-mask-oval' },
  { id: 'hexagon', labelEn: 'Hexagon', labelTa: 'அறுகோணம்', icon: Layers, cssClass: 'shape-mask-hexagon' },
  { id: 'star', labelEn: 'Star', labelTa: 'நட்சத்திரம்', icon: Sparkles, cssClass: 'shape-mask-star' },
];

const TESTIMONIALS = [
  {
    nameEn: 'Priya & Karthik',
    nameTa: 'பிரியா & கார்த்திக்',
    locationEn: 'Gobichettipalayam',
    locationTa: 'கோபிசெட்டிபாளையம்',
    commentEn: 'We ordered 100 heart keychains for our wedding reception. The acrylic clarity on the silk saree photo is outstanding!',
    commentTa: 'எங்கள் திருமண வரவேற்பிற்கு 100 இதய சாவிக்கொத்துகளை ஆர்டர் செய்தோம். பட்டுப் புடவை புகைப்படத்தில் அக்ரிலிக் பளபளப்பு அருமை!',
    itemEn: 'Wedding Keepsakes (Pack of 100)',
    itemTa: 'திருமண தாம்பூல சீர் (Pack of 100)'
  },
  {
    nameEn: 'Suresh Kumar',
    nameTa: 'சுரேஷ் குமார்',
    locationEn: 'RS Puram, Coimbatore',
    locationTa: 'ஆர்.எஸ்.புரம், கோவை',
    commentEn: 'Got the TN 38 number plate tag for my Bullet bike. The custom QR code and laser cut finish is super premium.',
    commentTa: 'என் புல்லட் வண்டிக்கு TN 38 நம்பர் பிளேட் சாவிக்கொத்து வாங்கினேன். QR கோடுடன் வந்திருப்பது மிகவும் பயனுள்ளது.',
    itemEn: 'TN 38 Vehicle Number Tag',
    itemTa: 'TN 38 வாகன எண் பலகை'
  },
  {
    nameEn: 'Anitha Ramesh',
    nameTa: 'அனிதா ரமேஷ்',
    locationEn: 'Anna Nagar, Chennai',
    locationTa: 'அண்ணா நகர், சென்னை',
    commentEn: 'Ordered the 8x10 wooden tabletop frame for our anniversary. Delivered in 2 days with safe packaging!',
    commentTa: 'எங்கள் திருமண ஆண்டுவிழாவிற்கு 8x10 மர சட்டகம் வாங்கினோம். 2 நாட்களில் பார்சல் வந்துவிட்டது. மிகச் சிறந்த தரம்!',
    itemEn: 'Custom Photo Frame (8x10)',
    itemTa: 'புகைப்பட சட்டகம் (8x10)'
  }
];

const FAQS = [
  {
    qEn: 'Which districts in Tamil Nadu do you deliver to?',
    qTa: 'தமிழ்நாட்டின் எந்தெந்த மாவட்டங்களுக்கு டெலிவரி செய்யப்படும்?',
    aEn: 'We deliver across all 38 districts of Tamil Nadu (Chennai, Coimbatore, Erode, Tiruppur, Salem, Madurai, Trichy, etc.) in 2-4 days with live courier tracking.',
    aTa: 'சென்னை, கோவை, ஈரோடு, திருப்பூர், சேலம், மதுரை, திருச்சி உட்பட தமிழ்நாட்டின் அனைத்து 38 மாவட்டங்களுக்கும் Professional & ST Courier வழியாக 2 முதல் 4 நாட்களில் டெலிவரி செய்யப்படுகிறது.'
  },
  {
    qEn: 'Can I customize Photo Frames with different sizes & orientations?',
    qTa: 'புகைப்பட சட்டகங்களை (Photo Frames) வெவ்வேறு அளவுகளில் செய்ய முடியுமா?',
    aEn: 'Yes! Our new Photo Frame Studio supports 4x6, 5x7, 8x10, and A4 sizes in Portrait or Landscape with Walnut Wood, Obsidian Black, or Champagne Gold frames.',
    aTa: 'ஆம்! எங்கள் புகைப்பட சட்டக ஸ்டுடியோவில் 4x6, 5x7, 8x10, மற்றும் A4 அளவுகளில் செங்குத்து அல்லது கிடைமட்டமாக மர விளிம்புடன் தேர்வு செய்யலாம்.'
  },
  {
    qEn: 'Can I engrave custom text in Tamil script?',
    qTa: 'சாவிக்கொத்தில் தமிழ் எழுத்துக்களில் பெயர் பொறிக்க முடியுமா?',
    aEn: 'Yes! Our built-in Tamil Typography studio helper allows you to easily engrave bride & groom names, dates, or messages in Tamil.',
    aTa: 'ஆம்! எங்கள் இணையதளத்தில் உள்ள தமிழ் எழுத்துரு உதவியாளர் மூலம் மணமக்கள் பெயர், திருமண தேதி அல்லது பிடித்த வாசகங்களை தமிழில் லேசரில் துல்லியமாக பொறிக்கலாம்.'
  },
  {
    qEn: 'Do you provide bulk discounts for weddings and events?',
    qTa: 'திருமணம், காதுகுத்து விழாக்களுக்கு மொத்தமாக ஆர்டர் செய்ய முடியுமா?',
    aEn: 'Yes, we offer direct factory wholesale pricing (from ₹99/pc to ₹129/pc) for bulk orders of 25, 50, 100, 250, and 500 pieces with free gift packaging.',
    aTa: 'ஆம், 25, 50, 100, 250, 500 எண்ணிக்கை வரை மொத்த ஆர்டர்களுக்கு தொழிற்சாலை நேரடி விலை (Wholesale Price ₹99 முதல் ₹129 வரை) மற்றும் இலவச மஞ்சள் தாம்பூலப் பை பேக்கிங் வசதி உண்டு.'
  }
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const [selectedShape, setSelectedShape] = useState('heart');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const isTamil = i18n.language === 'ta';
  const activeShape = SHAPE_BUTTONS.find(s => s.id === selectedShape) || SHAPE_BUTTONS[0];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="pt-6 sm:pt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold">
                <Sparkles size={13} className="text-orange-600" />
                <span>{t('hero_badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                {t('hero_title_prefix')} <br />
                <span className="text-gradient-warm">{t('hero_title_highlight')}</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                {t('hero_desc')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link 
                  to="/products" 
                  className="btn-accent w-full sm:w-auto px-7 py-3.5 text-sm font-black shadow-md"
                >
                  <span>{t('hero_cta_shop')}</span>
                  <ArrowRight size={16} />
                </Link>

                <Link 
                  to="/track-order" 
                  className="btn-secondary w-full sm:w-auto px-6 py-3.5 text-sm font-bold"
                >
                  <Truck size={16} className="text-slate-600" />
                  <span>{t('hero_cta_track')}</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-emerald-600" /> {t('hero_stat_delivered')}</span>
                <span className="flex items-center gap-1.5"><Star size={15} className="fill-amber-400 text-amber-400" /> {t('hero_stat_rating')}</span>
                <span className="flex items-center gap-1.5"><Truck size={15} className="text-blue-600" /> {t('hero_stat_dispatch')}</span>
              </div>

            </div>

            {/* Right Interactive Preview (7 Shapes) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-200 w-full max-w-sm space-y-4">
                
                <div className="flex justify-between items-center text-xs">
                  <span className="badge-pill bg-orange-50 text-orange-900 font-bold border border-orange-200">
                    {t('hero_preview_badge')}
                  </span>
                  <span className="text-slate-400 font-semibold">{t('hero_preview_category')}</span>
                </div>

                {/* Mockup Canvas */}
                <div className="bg-slate-100/90 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[260px] border border-slate-200/80">
                  <img 
                    src="/keychain-hardware.png" 
                    alt="Ring" 
                    className="w-16 h-auto object-contain z-10 -mb-5 drop-shadow-xs" 
                  />
                  <div className={`w-36 h-36 bg-white shadow-md border-2 border-white overflow-hidden flex items-center justify-center transition-all duration-200 ${activeShape.cssClass}`}>
                    <img 
                      src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=500&q=80" 
                      alt="South Indian Wedding Couple" 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-700">
                    {isTamil ? activeShape.labelTa : activeShape.labelEn} Silhouette
                  </p>
                </div>

                {/* 7 Shapes Switcher Bar */}
                <div className="flex gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
                  {SHAPE_BUTTONS.map(shape => {
                    const Icon = shape.icon;
                    const isSelected = selectedShape === shape.id;
                    return (
                      <button
                        key={shape.id}
                        onClick={() => setSelectedShape(shape.id)}
                        className={`flex-1 min-w-[36px] py-1.5 rounded-lg flex items-center justify-center transition-all ${
                          isSelected ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title={isTamil ? shape.labelTa : shape.labelEn}
                      >
                        <Icon size={15} />
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through">₹249</span>
                    <p className="text-xl font-black text-slate-900">₹149 <span className="text-xs text-emerald-600 font-bold">{t('price_free_ship')}</span></p>
                  </div>
                  <Link to="/products" className="btn-accent py-2 px-4 text-xs font-bold">
                    {t('hero_preview_cta')}
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          POPULAR GIFTS SHOWCASE
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{t('popular_tagline')}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              {t('popular_title')}
            </h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1">
            {t('popular_view_all')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_GIFTS.map(gift => (
            <div 
              key={gift.id} 
              className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="badge-pill bg-orange-50 text-orange-900 text-[10px] border border-orange-200 font-bold">
                    {isTamil ? gift.tamilBadge : gift.badgeKey}
                  </span>
                  <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                    <Star size={12} className="fill-amber-400" /> {gift.rating}
                  </span>
                </div>

                <div className="w-full aspect-square bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center mb-3 border border-slate-100 relative">
                  {gift.id !== 4 && (
                    <img src="/keychain-hardware.png" alt="Hardware" className="w-12 h-auto object-contain -mb-3 z-10" />
                  )}
                  <div className={`w-24 h-24 bg-white shadow-xs overflow-hidden border-2 border-white ${
                    gift.id === 4 ? 'rounded-xl border-4 border-amber-900' : (gift.shape === 'heart' ? 'shape-mask-heart' : (gift.shape === 'shield' ? 'shape-mask-shield' : 'rounded-full'))
                  }`}>
                    <img src={gift.image} alt={gift.nameKey} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>

                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {isTamil ? gift.tamilName : gift.nameKey}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium line-clamp-2">
                  {isTamil ? gift.tamilDesc : gift.descKey}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through">₹{gift.originalPrice}</span>
                  <p className="text-lg font-black text-slate-900">₹{gift.price}</p>
                </div>
                <Link to={`/customize/${gift.id}`} className="btn-accent py-2 px-3.5 text-xs font-bold shadow-xs">
                  {t('btn_customize')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          3-STEP SIMPLE GUIDE
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{t('steps_tagline')}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('steps_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 text-center space-y-3">
            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 font-black text-base flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('step1_title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {t('step1_desc')}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center space-y-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 font-black text-base flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('step2_title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {t('step2_desc')}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 font-black text-base flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('step3_title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {t('step3_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BULK RETURN GIFTS CALCULATOR
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BulkReturnGiftCalculator />
      </section>

      {/* =========================================================================
          TESTIMONIALS
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{t('testimonials_tagline')}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('testimonials_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((tItem, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-medium">
                  "{isTamil ? tItem.commentTa : tItem.commentEn}"
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{isTamil ? tItem.nameTa : tItem.nameEn}</p>
                  <p className="text-[11px] text-slate-400">{isTamil ? tItem.locationTa : tItem.locationEn}</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  {isTamil ? tItem.itemTa : tItem.itemEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{t('faq_tagline')}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('faq_title')}
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex justify-between items-center font-bold text-slate-900 text-sm hover:bg-slate-50 transition-colors"
                >
                  <span>{isTamil ? faq.qTa : faq.qEn}</span>
                  {isOpen ? <ChevronUp size={16} className="text-orange-600 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {isTamil ? faq.aTa : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
