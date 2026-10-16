import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ShoppingBag, Sparkles, ShoppingCart, User, Truck, MapPin, LayoutDashboard } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

export default function MobileBottomNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const { totalItemCount } = useCart();
  const { user } = useAuth();

  const role = user?.role ? String(user.role).toLowerCase() : 'guest';
  const isDeliveryPartner = role === 'delivery_partner' || role.includes('delivery');
  const isAdmin = role === 'admin' || role === 'shop_owner' || role === 'super_admin';

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        
        {/* 1. DELIVERY PARTNER MOBILE TABS */}
        {isDeliveryPartner ? (
          <>
            <Link 
              to="/partner-login" 
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive('/partner-login') ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <Truck size={20} className={isActive('/partner-login') ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">Dispatches</span>
            </Link>

            <Link 
              to="/track-order" 
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive('/track-order') ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <MapPin size={20} className={isActive('/track-order') ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">Route Map</span>
            </Link>

            <Link 
              to="/profile" 
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive('/profile') ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <User size={20} className={isActive('/profile') ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">Partner ID</span>
            </Link>
          </>
        ) : isAdmin ? (
          /* 2. ADMIN MOBILE TABS */
          <>
            <Link 
              to="/admin/products" 
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive('/admin/products') ? 'text-purple-700 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <LayoutDashboard size={20} className={isActive('/admin/products') ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">Admin</span>
            </Link>

            <Link 
              to="/track-order" 
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive('/track-order') ? 'text-purple-700 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <Truck size={20} className={isActive('/track-order') ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">Logistics</span>
            </Link>

            <Link 
              to="/profile" 
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive('/profile') ? 'text-purple-700 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <User size={20} className={isActive('/profile') ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">Account</span>
            </Link>
          </>
        ) : (
          /* 3. CUSTOMER / GUEST STANDARD TABS */
          <>
            {/* Home */}
            <Link 
              to="/" 
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive('/') ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <Home size={20} className={isActive('/') ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight">{t('nav_home')}</span>
            </Link>

            {/* Shop Catalog */}
            <Link 
              to="/products" 
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive('/products') && !location.pathname.startsWith('/customize') 
                  ? 'text-orange-600 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <ShoppingBag size={20} className={isActive('/products') && !location.pathname.startsWith('/customize') ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight">{t('nav_shop')}</span>
            </Link>

            {/* Studio / Customizer Center Highlight */}
            <Link 
              to="/products" 
              className="flex flex-col items-center justify-center flex-1 -mt-4 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-active:scale-95 transition-transform">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <span className="text-[10px] mt-1 text-slate-800 font-bold">Studio</span>
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
                isActive('/cart') ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <ShoppingCart size={20} className={isActive('/cart') ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{t('cart_title')?.split(' ')[0] || 'Cart'}</span>
            </Link>

            {/* Account / Profile */}
            <Link 
              to={user ? "/profile" : "/login"} 
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive('/profile') || isActive('/login') ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <User size={20} className={isActive('/profile') || isActive('/login') ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight">
                {user ? (t('nav_profile')?.split(' ')[0] || 'Account') : t('nav_login')}
              </span>
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}
