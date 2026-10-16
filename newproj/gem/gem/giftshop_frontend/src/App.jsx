import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Gift, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  Truck, 
  Globe, 
  LayoutDashboard,
  Heart,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles
} from 'lucide-react';

import Home from './Home';
import Products from './Products';
import Customizer from './Customizer';
import Cart from './Cart';
import Checkout from './Checkout';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import OrderTracking from './OrderTracking';
import AdminProducts from './AdminProducts';
import DeliveryPartner from './DeliveryPartner';
import MotionBackground from './MotionBackground';
import AiChatbot from './AiChatbot';
import MobileBottomNav from './MobileBottomNav';
import SvgClipDefinitions from './SvgClipDefinitions';
import ScrollToTop from './ScrollToTop';

import { CartProvider, useCart } from './CartContext';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastProvider, useToast } from './ToastContext';
import { WishlistProvider, useWishlist } from './WishlistContext';

function Navigation() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { totalItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role ? String(user.role).toLowerCase() : 'guest';
  const isDeliveryPartner = role === 'delivery_partner' || role.includes('delivery');
  const isAdmin = role === 'admin' || role === 'shop_owner' || role === 'super_admin';
  const isCustomerOrGuest = !isDeliveryPartner && !isAdmin;

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('gobi_gift_lang', newLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Role based home redirect target
  const logoTarget = isDeliveryPartner ? '/partner-login' : isAdmin ? '/admin/products' : '/';

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          
          {/* Brand Logo with Role Badge */}
          <Link 
            to={logoTarget} 
            className="flex items-center gap-2.5 group"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white flex items-center justify-center shadow-xs transition-colors ${
              isDeliveryPartner ? 'bg-emerald-600 group-hover:bg-emerald-700' : isAdmin ? 'bg-purple-700 group-hover:bg-purple-800' : 'bg-slate-900 group-hover:bg-orange-600'
            }`}>
              {isDeliveryPartner ? <Truck size={19} /> : <Gift size={19} />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 block leading-tight">
                  {t('brand_title')}
                </span>
                {isDeliveryPartner && (
                  <span className="badge-pill bg-emerald-100 text-emerald-800 text-[9px] font-black py-0 px-1.5">
                    DELIVERY
                  </span>
                )}
                {isAdmin && (
                  <span className="badge-pill bg-purple-100 text-purple-800 text-[9px] font-black py-0 px-1.5">
                    ADMIN
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                {isDeliveryPartner ? 'Field Logistics Portal' : isAdmin ? 'Management Console' : t('brand_subtitle')}
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation Links - STRICTLY ROLE ISOLATED */}
          <nav className="hidden md:flex items-center space-x-1">
            
            {/* 1. DELIVERY PARTNER VIEW ONLY */}
            {isDeliveryPartner && (
              <>
                <Link 
                  to="/partner-login" 
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive('/partner-login') ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <Truck size={14} />
                  <span>My Dispatches & Routes</span>
                </Link>

                <Link 
                  to="/track-order" 
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive('/track-order') ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <MapPin size={14} />
                  <span>Live Route Tracker</span>
                </Link>
              </>
            )}

            {/* 2. ADMIN VIEW ONLY */}
            {isAdmin && (
              <>
                <Link 
                  to="/admin/products" 
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive('/admin/products') ? 'bg-purple-700 text-white shadow-xs' : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                  }`}
                >
                  <LayoutDashboard size={14} />
                  <span>{t('nav_admin')}</span>
                </Link>

                <Link 
                  to="/track-order" 
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive('/track-order') ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Truck size={14} />
                  <span>{t('nav_track')}</span>
                </Link>
              </>
            )}

            {/* 3. LOGGED-IN CUSTOMER VIEW */}
            {user && isCustomerOrGuest && (
              <>
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('nav_home')}
                </Link>

                <Link 
                  to="/products" 
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/products') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('nav_shop')}
                </Link>

                <Link 
                  to="/track-order" 
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive('/track-order') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Truck size={14} />
                  <span>{t('nav_track')}</span>
                </Link>
              </>
            )}

            {/* 4. GUEST (NO LOGIN) VIEW */}
            {!user && (
              <>
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('nav_home')}
                </Link>

                <Link 
                  to="/products" 
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/products') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('nav_shop')}
                </Link>
              </>
            )}

          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="btn-secondary py-1.5 px-2.5 sm:py-2 sm:px-3 text-xs font-bold flex items-center gap-1.5 rounded-xl"
              title="Switch Language (English / தமிழ்)"
            >
              <Globe size={13} className="text-orange-600" />
              <span>{i18n.language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Customer Wishlist Icon (Hidden for Delivery Partner & Admin) */}
            {isCustomerOrGuest && (
              <Link 
                to="/profile" 
                className="hidden sm:flex relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Saved Wishlist"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Customer Cart Icon (Hidden for Delivery Partner & Admin) */}
            {isCustomerOrGuest && (
              <Link 
                to="/cart" 
                className="hidden sm:flex relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="View Cart"
              >
                <ShoppingCart size={19} />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {totalItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Account / Auth Actions */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-slate-200">
                <Link 
                  to="/profile" 
                  className={`btn-secondary py-1.5 px-3 text-xs font-bold flex items-center gap-1.5 rounded-xl border-slate-200 ${
                    isDeliveryPartner ? 'text-emerald-800 bg-emerald-50/70 border-emerald-200' : ''
                  }`}
                >
                  <UserIcon size={13} className={isDeliveryPartner ? 'text-emerald-700' : 'text-slate-600'} />
                  <span className="max-w-[95px] truncate">{user.username || user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="hidden sm:inline-flex btn-accent py-2 px-3.5 text-xs font-bold"
              >
                {t('nav_login')}
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}

function FloatingSupport() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40">
      {open && (
        <div className="mb-3 glass-card rounded-2xl p-4 shadow-xl border border-slate-200 w-72 space-y-3 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles size={13} className="text-orange-500" />
              TN36 Studio Support
            </h4>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">✕</button>
          </div>
          
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Need custom design help or wedding/event bulk order quotes? Connect directly with our artisan workshop!
          </p>

          <a 
            href="https://wa.me/916379979364?text=Hi%20TN36%20Custom%20Gifts,%20I%20have%20a%20question%20about%20custom%20acrylic%20gifts"
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-success w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
          >
            <MessageCircle size={14} />
            <span>Chat on WhatsApp (+91 6379979364)</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center"
        title="Live WhatsApp Support"
      >
        <MessageCircle size={19} />
      </button>
    </div>
  );
}

function Footer() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const role = (user?.role || '').toLowerCase();
  const isDeliveryPartner = role === 'delivery_partner' || role.includes('delivery');
  const isAdmin = role === 'admin' || role === 'shop_owner' || role === 'super_admin';

  if (isDeliveryPartner) {
    return (
      <footer className="bg-slate-900 text-slate-300 pt-8 pb-20 md:pb-6 border-t border-slate-800 mt-auto relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Truck size={14} />
              </div>
              <span className="font-black text-white">TN36 Field Logistics Driver Portal</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <Link to="/partner-login" className="hover:text-emerald-400 font-bold transition-colors">Assigned Dispatches</Link>
              <Link to="/track-order" className="hover:text-emerald-400 font-bold transition-colors">Live Route Tracker</Link>
              <Link to="/profile" className="hover:text-emerald-400 font-bold transition-colors">Driver Profile</Link>
            </div>
            <a href="tel:6379979364" className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Phone size={12} /> Workshop Hotline: +91 6379979364
            </a>
          </div>
          <div className="pt-4 text-center text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} TN36 Custom Gifts • Field Logistics & Dispatch System
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-8 border-t border-slate-800 mt-auto relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* 1. Brand Info & Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                <Gift size={16} />
              </div>
              <span className="text-base font-black text-white">{t('brand_title')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Handcrafted high-gloss acrylic photo keychains, vehicle tags, photo frames, and wedding keepsakes made with love in Gobichettipalayam.
            </p>
            <div className="pt-1 text-xs text-slate-400 space-y-1.5">
              <p className="flex items-center gap-2"><MapPin size={13} className="text-orange-400 shrink-0" /> Gobichettipalayam, Erode, Tamil Nadu</p>
              <a href="mailto:tn36customgifts@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={13} className="text-orange-400 shrink-0" /> tn36customgifts@gmail.com
              </a>
              <a href="tel:6379979364" className="flex items-center gap-2 hover:text-white transition-colors font-bold text-slate-200">
                <Phone size={13} className="text-orange-400 shrink-0" /> +91 6379979364
              </a>
            </div>
          </div>

          {/* 2. Shop Gifts Category Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t('nav_shop')}</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/products?category=wedding" className="hover:text-white transition-colors">Wedding & Return Gifts</Link></li>
              <li><Link to="/products?category=vehicle" className="hover:text-white transition-colors">Vehicle Number Plate Tags</Link></li>
              <li><Link to="/products?category=frame" className="hover:text-white transition-colors">Custom Photo Frames</Link></li>
              <li><Link to="/products?category=keychain" className="hover:text-white transition-colors">Classic Photo Keychains</Link></li>
              <li><Link to="/products?category=coaster" className="hover:text-white transition-colors">Resin Coasters & Plaques</Link></li>
            </ul>
          </div>

          {/* 3. Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">{t('nav_home')}</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">All Products Catalog</Link></li>
              {user && <li><Link to="/track-order" className="hover:text-white transition-colors">{t('nav_track')}</Link></li>}
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              {user ? (
                <li><Link to="/profile" className="hover:text-white transition-colors">{t('nav_profile')}</Link></li>
              ) : (
                <li><Link to="/login" className="hover:text-white transition-colors">{t('nav_login')}</Link></li>
              )}
            </ul>
          </div>

          {/* 4. Direct Workshop Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Workshop Care</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Express courier shipping across all 38 districts of Tamil Nadu. 100% replacement guarantee against transit damage.
            </p>
            <div className="pt-1">
              <a 
                href="https://wa.me/916379979364?text=Hi%20TN36%20Custom%20Gifts,%20I%20have%20a%20query%20regarding%20custom%20gifts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <MessageCircle size={14} />
                <span>WhatsApp: 6379979364</span>
              </a>
            </div>
          </div>

        </div>

        {/* Clean Footer Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} TN36 Custom Gifts. All rights reserved.</p>
          <p className="text-slate-400">Handcrafted with precision in Gobichettipalayam, Tamil Nadu</p>
        </div>

      </div>
    </footer>
  );
}

function AppContent() {
  const { user } = useAuth();
  const role = (user?.role || '').toLowerCase();
  const isDeliveryPartner = role === 'delivery_partner' || role.includes('delivery');
  const isAdmin = role === 'admin' || role === 'shop_owner' || role === 'super_admin';

  return (
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      
      <SvgClipDefinitions />
      <MotionBackground />

      <Navigation />

      <main className="flex-grow w-full relative z-10 pb-16 md:pb-0">
        <Routes>
          {/* Driver accounts automatically land on their dispatches portal */}
          <Route path="/" element={isDeliveryPartner ? <Navigate to="/partner-login" replace /> : isAdmin ? <Navigate to="/admin/products" replace /> : <Home />} />
          <Route path="/products" element={isDeliveryPartner ? <Navigate to="/partner-login" replace /> : <Products />} />
          <Route path="/customize/:id" element={isDeliveryPartner ? <Navigate to="/partner-login" replace /> : <Customizer />} />
          <Route path="/cart" element={isDeliveryPartner ? <Navigate to="/partner-login" replace /> : <Cart />} />
          <Route path="/checkout" element={isDeliveryPartner ? <Navigate to="/partner-login" replace /> : <Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/partner-login" element={<DeliveryPartner />} />
        </Routes>
      </main>

      {/* Floating WhatsApp Support & Chatbot (Hidden for delivery partner) */}
      {!isDeliveryPartner && <FloatingSupport />}
      {!isDeliveryPartner && <AiChatbot />}

      {/* Native App-Feel Bottom Navigation for Mobile */}
      <MobileBottomNav />

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <ScrollToTop />
              <AppContent />
            </Router>
          </ToastProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;