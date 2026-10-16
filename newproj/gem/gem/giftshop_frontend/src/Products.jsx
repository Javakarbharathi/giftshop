import { useEffect, useState } from 'react';
import { getProducts } from './api';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Heart, 
  Star,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useWishlist } from './WishlistContext';
import { useToast } from './ToastContext';

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'South Indian Wedding Couple Heart Keychain',
    name_ta: 'பாரம்பரிய திருமண ஜோடி இதய சாவிக்கொத்து',
    category_name: 'wedding',
    product_type: 'keychain',
    base_price: '249.00',
    offer_price: '149.00',
    description: 'Double-sided silk saree wedding portrait with date laser engraving.',
    description_ta: 'இருபுறமும் பட்டுப் புடவை புகைப்படங்கள் மற்றும் திருமண தேதி லேசர் பொறிப்பு.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=500&q=80',
    rating: 5.0,
    reviews_count: 240,
    tag: 'Wedding Special'
  },
  {
    id: 4,
    name: 'Luxury Acrylic & Wood Tabletop Photo Frame',
    name_ta: 'அக்ரிலிக் & மர மேஜை புகைப்பட சட்டகம்',
    category_name: 'frame',
    product_type: 'frame',
    base_price: '499.00',
    offer_price: '299.00',
    description: 'Custom sizes 4x6, 5x7, 8x10 with tabletop easel stand and engraved plaque.',
    description_ta: 'வரவேற்பறை மற்றும் மேஜைக்கு உகந்த 4x6, 5x7, 8x10 அளவுகளில் மர சட்டகம்.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviews_count: 135,
    tag: 'Living Room Frame'
  },
  {
    id: 2,
    name: 'TN Vehicle Number Plate Tag (TN 36 / 38 / 01)',
    name_ta: 'தமிழ்நாடு வாகன எண் பலகை சாவிக்கொத்து',
    category_name: 'vehicle',
    product_type: 'keychain',
    base_price: '249.00',
    offer_price: '159.00',
    description: 'Vehicle registration number, owner name and emergency QR tag.',
    description_ta: 'வண்டி பதிவு எண், உரிமையாளர் பெயர் மற்றும் QR கோடுடன் கூடிய பலகை.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviews_count: 180,
    tag: 'Biker Favorite'
  },
  {
    id: 3,
    name: 'Classic Family Portrait Circle Keychain',
    name_ta: 'குடும்ப புகைப்பட வட்ட வடிவ சாவிக்கொத்து',
    category_name: 'keychain',
    product_type: 'keychain',
    base_price: '199.00',
    offer_price: '149.00',
    description: 'Preserve family moments and birthdays in a high-gloss acrylic circle.',
    description_ta: 'குடும்ப விழாக்கள் மற்றும் குழந்தைகளின் அழகிய புகைப்பட நினைவுகள்.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviews_count: 310,
    tag: 'Top Seller'
  },
  {
    id: 5,
    name: 'Temple Deity Car Mirror Hanging Charm',
    name_ta: 'சாமி படம் & கார் கண்ணாடி தொங்கான்',
    category_name: 'keychain',
    product_type: 'keychain',
    base_price: '299.00',
    offer_price: '189.00',
    description: 'Lord Murugan, Vinayagar, or Meenakshi Amman devotional car charm.',
    description_ta: 'முருகன், விநாயகர் அருள் தரும் வாகன கண்ணாடி தொங்கான்.',
    image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=500&q=80',
    rating: 5.0,
    reviews_count: 120,
    tag: 'Devotional'
  },
  {
    id: 6,
    name: 'Resin Floral Photo Coasters (Set of 4)',
    name_ta: 'ரெசின் மலர் புகைப்பட கோஸ்டர் (4 எண்ணிக்கை)',
    category_name: 'coaster',
    product_type: 'coaster',
    base_price: '499.00',
    offer_price: '349.00',
    description: 'Handcrafted UV resin coasters with embedded dried jasmine petals and photos.',
    description_ta: 'உலர்ந்த பூ இதழ்கள் மற்றும் புகைப்படங்களுடன் கூடிய 4 கோஸ்டர்கள்.',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    reviews_count: 65,
    tag: 'Resin Craft'
  },
  {
    id: 7,
    name: 'Wooden Engraved Family Door Nameplate',
    name_ta: 'மர கதவு பெயர் பலகை & குடும்ப புகைப்படம்',
    category_name: 'nameplate',
    product_type: 'nameplate',
    base_price: '699.00',
    offer_price: '499.00',
    description: 'Solid teak wood finish entrance plaque with brass letters and photo.',
    description_ta: 'வீட்டு வாசல் கதவுக்கான தேக்கு மர பெயர் பலகை மற்றும் தமிழ் எழுத்துக்கள்.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviews_count: 42,
    tag: 'Door Plaque'
  }
];

export default function Products() {
  const { t, i18n } = useTranslation();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'all';
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const isTamil = i18n.language === 'ta';

  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl) {
      setSelectedCategory(catFromUrl);
    } else if (!searchParams.has('category')) {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleWishlistClick = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const inList = isInWishlist(product.id);
    toggleWishlist(product);
    const prodTitle = isTamil ? (product.name_ta || product.name) : product.name;
    addToast(inList ? `Removed ${prodTitle} from Wishlist` : `Saved ${prodTitle} to Wishlist! ❤️`);
  };

  let filteredProducts = products.filter(product => {
    const pCat = (product.category_name || product.category?.name || product.product_type || '').toLowerCase();
    const matchesCategory = selectedCategory === 'all' || pCat.includes(selectedCategory.toLowerCase());
    const nameSearch = isTamil ? (product.name_ta || product.name || '') : (product.name || '');
    const matchesSearch = nameSearch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => parseFloat(a.offer_price) - parseFloat(b.offer_price));
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => parseFloat(b.offer_price) - parseFloat(a.offer_price));
  }

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      
      {/* Catalog Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="badge-pill bg-orange-50 text-orange-900 text-xs font-bold border border-orange-200">
          {t('catalog_badge')}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('catalog_title')}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          {t('catalog_subtitle')}
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          
          {/* Horizontal Category Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {[
              { id: 'all', labelEn: 'All Gifts', labelTa: 'அனைத்தும்' },
              { id: 'wedding', labelEn: 'Wedding Keepsakes', labelTa: 'திருமண சீர்' },
              { id: 'frame', labelEn: 'Photo Frames', labelTa: 'சட்டகங்கள்' },
              { id: 'keychain', labelEn: 'Keychains', labelTa: 'சாவிக்கொத்து' },
              { id: 'vehicle', labelEn: 'TN Plates', labelTa: 'வாகன பலகை' },
              { id: 'coaster', labelEn: 'Coasters & Decor', labelTa: 'கோஸ்டர்கள்' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchParams(cat.id === 'all' ? {} : { category: cat.id });
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'btn-accent text-white'
                    : 'btn-secondary text-slate-600'
                }`}
              >
                {isTamil ? cat.labelTa : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-slate-200 outline-none focus:border-orange-500 font-medium"
            />
          </div>

        </div>
      </div>

      {/* Skeleton Shimmer Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="glass-card rounded-2xl p-5 space-y-4">
              <div className="w-full aspect-square rounded-xl skeleton-shimmer"></div>
              <div className="h-4 w-3/4 rounded skeleton-shimmer"></div>
              <div className="h-3 w-1/2 rounded skeleton-shimmer"></div>
              <div className="h-10 rounded-xl skeleton-shimmer"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty Search State */
        <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            <ShoppingBag size={24} />
          </div>
          <h3 className="text-base font-black text-slate-900">No gifts found</h3>
          <p className="text-xs text-slate-500">Try changing your search term or select "All Gifts" to see our full collection.</p>
          <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} className="btn-secondary py-2 px-4 text-xs font-bold">
            Reset Filters
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const isFavorite = isInWishlist(product.id);
            const title = isTamil ? (product.name_ta || product.name) : product.name;
            const description = isTamil ? (product.description_ta || product.description) : product.description;
            const tag = product.tag || product.category_name;
            const isFrame = product.product_type === 'frame';

            return (
              <div 
                key={product.id} 
                className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="badge-pill bg-orange-50 text-orange-900 text-[10px] border border-orange-200 font-bold">
                      {tag || 'Custom Keepsake'}
                    </span>
                    <button 
                      onClick={(e) => handleWishlistClick(product, e)}
                      className={`p-2 rounded-full transition-all ${
                        isFavorite 
                          ? 'bg-rose-50 text-rose-500' 
                          : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                      }`}
                      title="Add to Wishlist"
                    >
                      <Heart size={16} className={isFavorite ? "fill-rose-500" : ""} />
                    </button>
                  </div>

                  {/* Thumbnail with Reserved Aspect Ratio */}
                  <div className="w-full aspect-square bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center mb-4 border border-slate-100 relative">
                    {!isFrame && (
                      <img src="/keychain-hardware.png" alt="Hardware" className="w-14 h-auto object-contain -mb-4 z-10" />
                    )}
                    <div className={`w-28 h-28 bg-white shadow-xs overflow-hidden border-2 border-white ${
                      isFrame ? 'rounded-xl border-4 border-amber-900' : 'shape-mask-heart'
                    }`}>
                      <img 
                        src={product.image || product.sample_img} 
                        alt={title} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star size={13} className="fill-amber-400" />
                      <span>{product.rating || product.average_rating || 4.9}</span>
                      <span className="text-slate-400 font-normal">({product.reviews_count || 120} {t('reviews_count')})</span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug">{title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through mr-1 font-semibold">₹{product.base_price}</span>
                    <span className="text-2xl font-black text-slate-900">₹{product.offer_price}</span>
                  </div>
                  <Link 
                    to={`/customize/${product.id}`}
                    className="btn-accent py-2 px-4 text-xs font-bold shadow-xs"
                  >
                    <span>{t('btn_customize')}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}