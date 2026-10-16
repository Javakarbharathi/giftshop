import { useState } from 'react';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthModal from './AuthModal';
import { 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Gift, 
  X, 
  ShieldCheck, 
  Type 
} from 'lucide-react';

export default function Cart() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    subtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    addOns,
    toggleAddOn,
    addOnsTotal,
    finalTotal,
    getTierPrice
  } = useCart();
  
  const { t } = useTranslation();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    const result = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    if (result.success) {
      addToast(result.message, 'success');
      setCouponInput('');
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{t('cart_badge')}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            {t('cart_title')}
          </h1>
        </div>

        {cart.length > 0 && (
          <button 
            onClick={() => { clearCart(); addToast('Cart cleared', 'info'); }}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
          >
            <Trash2 size={13} /> {t('cart_clear_all')}
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        /* Empty State with Friendly Illustration */
        <div className="glass-card rounded-3xl p-10 sm:p-14 text-center max-w-md mx-auto space-y-4 shadow-sm border border-slate-200">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag size={28} />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900">{t('cart_empty_title')}</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              {t('cart_empty_desc')}
            </p>
          </div>
          <Link to="/products" className="btn-accent px-6 py-3 text-xs font-bold inline-flex shadow-sm">
            <span>{t('hero_cta_shop')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map(item => {
              const currentUnitPrice = getTierPrice(item.product?.offer_price, totalItemsCount);
              const itemTotal = currentUnitPrice * (item.quantity || 1);
              const isFrame = item.shape === 'frame' || Boolean(item.frameSize);
              const shapeClass = isFrame ? 'rounded-lg border-2 border-amber-900' : (item.shape ? `shape-mask-${item.shape}` : 'shape-mask-circle');

              return (
                <div 
                  key={item.cartId} 
                  className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  
                  {/* Thumbnails */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-14 h-14 bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center ${shapeClass}`}>
                        {item.finalImages?.front ? (
                          <img src={item.finalImages.front} alt="Front" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <span className="text-[9px] text-slate-400">Photo</span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold mt-1">
                        {isFrame ? 'Front Photo' : t('studio_side_front')}
                      </span>
                    </div>

                    {!isFrame && (
                      <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center ${shapeClass}`}>
                          {item.finalImages?.back ? (
                            <img src={item.finalImages.back} alt="Back" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <span className="text-[9px] text-slate-400">Back</span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold mt-1">{t('studio_side_back')}</span>
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-black text-slate-900 text-sm">{item.product?.name || 'Custom Gift'}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {isFrame 
                        ? `${item.frameSize || '5x7 Inch'} • ${item.frameMaterial || 'Walnut Wood'} • ₹${currentUnitPrice}/pc` 
                        : `Shape: ${item.shape?.toUpperCase() || 'HEART'} • ₹${currentUnitPrice}/pc`}
                    </p>
                    {item.customText && (
                      <p className="text-xs text-orange-950 font-semibold flex items-center gap-1">
                        <Type size={12} className="text-orange-600" /> "{item.customText}"
                      </p>
                    )}
                  </div>

                  {/* Stepper & Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <button 
                        onClick={() => updateQuantity(item.cartId, (item.quantity || 1) - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold min-h-[32px] min-w-[32px] flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2.5 py-1 font-black text-xs text-slate-900">{item.quantity || 1}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, (item.quantity || 1) + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold min-h-[32px] min-w-[32px] flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-black text-slate-900">₹{itemTotal.toFixed(2)}</p>
                      <button 
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {/* Gift Packaging Add-ons */}
            <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Gift size={14} className="text-orange-600" />
                {t('cart_packaging_total')}
              </h3>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox" 
                    checked={addOns.giftPackaging} 
                    onChange={() => toggleAddOn('giftPackaging')}
                    className="w-4 h-4 accent-orange-600 rounded" 
                  />
                  <span className="font-bold text-slate-800">{t('cart_packaging_checkbox')}</span>
                </div>
                <span className="font-black text-slate-700">+₹35</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox" 
                    checked={addOns.greetingNote} 
                    onChange={() => toggleAddOn('greetingNote')}
                    className="w-4 h-4 accent-orange-600 rounded" 
                  />
                  <span className="font-bold text-slate-800">{t('cart_greeting_checkbox')}</span>
                </div>
                <span className="font-black text-slate-700">+₹20</span>
              </label>
            </div>

          </div>

          {/* Right: Summary Card */}
          <div className="lg:col-span-4 glass-card rounded-2xl p-5 sm:p-6 space-y-4 sm:space-y-5 sticky top-24">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              {t('checkout_order_summary')}
            </h3>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="badge-pill bg-emerald-600 text-white text-[10px]">{appliedCoupon.code}</span>
                    <p className="text-[11px] text-emerald-800 font-bold mt-0.5">{appliedCoupon.label}</p>
                  </div>
                  <button onClick={removeCoupon} className="text-rose-500 hover:text-rose-700 font-bold text-xs p-1">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                  <input 
                    type="text" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="WELCOME10 / GOBI50"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase outline-none focus:border-orange-500 bg-white"
                  />
                  <button 
                    type="submit" 
                    disabled={isApplyingCoupon}
                    className="btn-secondary py-2 px-3 text-xs font-bold"
                  >
                    {isApplyingCoupon ? '...' : t('cart_apply_coupon')}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>{t('cart_items_subtotal')}</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>{t('cart_coupon_discount')}</span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              {addOnsTotal > 0 && (
                <div className="flex justify-between">
                  <span>{t('cart_packaging_total')}</span>
                  <span className="font-bold text-slate-900">+ ₹{addOnsTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping across TN:</span>
                <span className="text-emerald-600 font-bold">{t('cart_shipping_free')}</span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-slate-900">
                <span>{t('cart_total_payable')}</span>
                <span className="text-xl text-orange-600">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                if (!user) {
                  setShowAuthModal(true);
                } else {
                  navigate('/checkout');
                }
              }}
              className="btn-accent w-full py-3.5 text-sm font-black shadow-md flex items-center justify-center gap-2"
            >
              <span>{t('cart_proceed_checkout')}</span>
              <ArrowRight size={16} />
            </button>

            <div className="text-center pt-2 text-[11px] text-slate-400">
              <p className="flex items-center justify-center gap-1 text-slate-500 font-semibold">
                <ShieldCheck size={13} className="text-emerald-600" /> 100% Secure Checkout & Live Tracking
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Login / Register Modal Popup for Guest Checkout */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          navigate('/checkout');
        }}
        message="Please log in or register to complete your order and receive live SMS / WhatsApp tracking updates."
      />

    </div>
  );
}