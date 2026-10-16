import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut, 
  Truck, 
  Globe, 
  CheckCircle2, 
  Check 
} from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [wishlist] = useState([
    { id: 1, name: 'South Indian Wedding Couple Heart Keychain', price: '₹149.00', image: '/keychain-hardware.png' }
  ]);

  const [address, setAddress] = useState({
    street: '14, Gandhi Road, Anna Nagar',
    city: 'Gobichettipalayam',
    pincode: '638452',
    district: 'Erode'
  });

  useEffect(() => {
    if (user) {
      fetch('http://127.0.0.1:8000/api/catalog/orders/')
        .then(res => res.json())
        .then(data => {
          const currentUsername = (user.username || user.name || '').toLowerCase();
          const userOrders = data.filter(order => {
            const orderName = (order.customer_name || '').toLowerCase();
            return orderName.includes(currentUsername) || currentUsername.includes(orderName);
          });

          const formattedOrders = userOrders.map(order => ({
            rawId: order.id,
            id: `ORD-${order.id}`,
            date: order.created_at ? order.created_at.split('T')[0] : 'Recent',
            total: parseFloat(order.total_amount),
            status: order.status || 'Pending',
            items: order.items && order.items.length > 0 
              ? order.items.map(i => `${i.product_name} (x${i.quantity})`).join(', ') 
              : 'Personalized Acrylic Keepsake'
          }));
          
          setOrders(formattedOrders);
          setLoadingOrders(false);
        })
        .catch(err => {
          console.error('Failed to fetch orders:', err);
          setLoadingOrders(false);
        });
    }
  }, [user]);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('gobi_gift_lang', lang);
  };

  const handleAddressUpdate = (e) => {
    e.preventDefault();
    alert('Address saved to profile!');
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="glass-card rounded-3xl p-8 border border-slate-200 space-y-4">
          <p className="text-slate-600 text-sm font-semibold">Please sign in to view your profile and orders.</p>
          <button onClick={() => navigate('/login')} className="btn-accent py-3 px-6 text-xs font-bold">
            {t('nav_login')}
          </button>
        </div>
      </div>
    );
  }

  const displayName = user.username || user.name || 'Valued Customer';
  const displayEmail = user.email || 'customer@example.com';
  const roleName = user.role ? user.role.toUpperCase() : 'CUSTOMER';

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{t('profile_badge')}</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">{t('profile_title')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar */}
        <div className="md:col-span-4 glass-card rounded-2xl p-5 space-y-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-3 space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Holder</p>
            <p className="text-sm font-black text-slate-900 truncate">{displayName}</p>
            <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
            <div className="pt-1">
              <span className="badge-pill bg-orange-50 text-orange-800 text-[10px] border border-orange-200 font-bold">
                {roleName}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2.5 ${
              activeTab === 'orders' ? 'bg-orange-50 text-orange-800 border border-orange-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Package size={16} />
            <span>{t('profile_tab_orders')} ({orders.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2.5 ${
              activeTab === 'wishlist' ? 'bg-orange-50 text-orange-800 border border-orange-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart size={16} />
            <span>{t('profile_tab_wishlist')} ({wishlist.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('address')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2.5 ${
              activeTab === 'address' ? 'bg-orange-50 text-orange-800 border border-orange-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MapPin size={16} />
            <span>{t('profile_tab_address')}</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2.5 ${
              activeTab === 'settings' ? 'bg-orange-50 text-orange-800 border border-orange-200' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Globe size={16} />
            <span>{t('profile_tab_settings')}</span>
          </button>

          <div className="pt-3 border-t border-slate-100">
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="w-full text-left px-3.5 py-2 rounded-xl font-bold text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
              <LogOut size={14} />
              <span>{t('nav_logout')}</span>
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="md:col-span-8 glass-card rounded-2xl p-6 sm:p-7">
          
          {/* Tab 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Package size={16} className="text-orange-600" />
                <span>{t('profile_tab_orders')}</span>
              </h3>

              {loadingOrders ? (
                <p className="text-xs text-slate-500 py-6 text-center">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <p className="text-slate-500 text-xs sm:text-sm">No orders found under this account.</p>
                  <Link to="/products" className="btn-accent py-2 px-4 text-xs font-bold inline-flex">
                    {t('hero_cta_shop')} →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.rawId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900">{order.id}</span>
                          <span className="text-xs text-slate-500">• {order.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{order.items}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <div className="text-left sm:text-right">
                          <p className="font-black text-emerald-600 text-sm">₹{order.total.toFixed(2)}</p>
                          <span className="badge-pill bg-blue-50 text-blue-700 text-[10px]">
                            {order.status}
                          </span>
                        </div>

                        <Link 
                          to={`/track-order?id=${order.rawId}`}
                          className="btn-secondary py-1.5 px-3 text-xs font-bold text-orange-600 flex items-center gap-1"
                        >
                          <Truck size={13} /> Track
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Heart size={16} className="text-rose-500" />
                <span>{t('profile_tab_wishlist')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-white rounded-lg p-1 border" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.name}</h4>
                      <p className="text-orange-600 font-black text-sm">{item.price}</p>
                      <Link to="/products" className="text-[11px] text-blue-600 font-bold hover:underline">
                        Customize →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Address */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin size={16} className="text-orange-600" />
                <span>{t('profile_tab_address')}</span>
              </h3>

              <form onSubmit={handleAddressUpdate} className="space-y-3 text-xs max-w-md">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">{t('checkout_street')}</label>
                  <input 
                    type="text" 
                    value={address.street} 
                    onChange={(e) => setAddress({...address, street: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl p-2.5 bg-white outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-slate-600 mb-1">City / Town</label>
                    <input 
                      type="text" 
                      value={address.city} 
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl p-2.5 bg-white outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-slate-600 mb-1">{t('checkout_pincode')}</label>
                    <input 
                      type="text" 
                      value={address.pincode} 
                      onChange={(e) => setAddress({...address, pincode: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl p-2.5 bg-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-accent py-2 px-4 text-xs font-bold">
                  Save Address
                </button>
              </form>
            </div>
          )}

          {/* Tab 4: Language & Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Globe size={16} className="text-orange-600" />
                <span>{t('profile_lang_title')}</span>
              </h3>

              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-medium">
                  {t('profile_lang_desc')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                  
                  {/* English Selector */}
                  <button
                    onClick={() => changeLang('en')}
                    className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                      i18n.language === 'en'
                        ? 'border-orange-600 bg-orange-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-black text-slate-900 text-sm">{t('profile_lang_en')}</p>
                      <p className="text-[11px] text-slate-500">English display across all pages</p>
                    </div>
                    {i18n.language === 'en' && <Check size={18} className="text-orange-600" />}
                  </button>

                  {/* Tamil Selector */}
                  <button
                    onClick={() => changeLang('ta')}
                    className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                      i18n.language === 'ta'
                        ? 'border-orange-600 bg-orange-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-black text-slate-900 text-sm">{t('profile_lang_ta')}</p>
                      <p className="text-[11px] text-slate-500">தமிழ் வழியிலான பரிசுகள் & முன்பதிவு</p>
                    </div>
                    {i18n.language === 'ta' && <Check size={18} className="text-orange-600" />}
                  </button>

                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}