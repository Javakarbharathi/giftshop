import { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  Truck, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  QrCode,
  Printer
} from 'lucide-react';
import UpiPaymentModal from './UpiPaymentModal';
import AuthModal from './AuthModal';
import { useToast } from './ToastContext';

const TAMIL_NADU_DISTRICTS = [
  'Erode',
  'Coimbatore',
  'Tiruppur',
  'Salem',
  'Chennai',
  'Madurai',
  'Tiruchirappalli',
  'Dindigul',
  'Namakkal',
  'Karur',
  'Thanjavur',
  'Tirunelveli',
  'Kanchipuram',
  'Vellore'
];

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { 
    cart, 
    clearCart,
    subtotal,
    appliedCoupon,
    discountAmount,
    finalTotal,
    getTierPrice
  } = useCart();
  
  const { user } = useAuth();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
    district: 'Erode',
    city: 'Gobichettipalayam',
    pincode: '638452',
    paymentMethod: 'upi_qr'
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [saveAddressToBook, setSaveAddressToBook] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(!user);

  const totalItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Sync user info when logged in
  useEffect(() => {
    if (user) {
      setShowAuthModal(false);
      setFormData(prev => ({
        ...prev,
        fullName: user.username || user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  // Fetch saved addresses if logged in
  useEffect(() => {
    if (user?.id) {
      fetch(`http://127.0.0.1:8000/api/catalog/addresses/?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setSavedAddresses(data);
            const defaultAddr = data.find(a => a.is_default) || data[0];
            if (defaultAddr) {
              setFormData(prev => ({
                ...prev,
                fullName: defaultAddr.full_name || prev.fullName,
                phone: defaultAddr.phone || prev.phone,
                address: defaultAddr.street || prev.address,
                city: defaultAddr.city || prev.city,
                district: defaultAddr.district || prev.district,
                pincode: defaultAddr.pincode || prev.pincode
              }));
            }
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectSavedAddress = (addr) => {
    setFormData(prev => ({
      ...prev,
      fullName: addr.full_name,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
      district: addr.district,
      pincode: addr.pincode
    }));
    addToast('Filled address from saved address book! 🏠');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      navigate('/products');
      return;
    }

    setIsProcessing(true);

    const orderPayload = {
      user: user?.id || null,
      customer_name: formData.fullName,
      customer_email: formData.email || null,
      customer_phone: formData.phone,
      shipping_address: `${formData.address}, ${formData.city}, ${formData.district} - ${formData.pincode}`,
      total_amount: finalTotal.toFixed(2),
      discount_amount: discountAmount.toFixed(2),
      coupon_code: appliedCoupon?.code || null,
      payment_method: formData.paymentMethod === 'upi_qr' 
        ? 'Direct UPI QR Scan' 
        : (formData.paymentMethod === 'online' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'),
      status: 'Pending',
      items: cart.map(item => ({
        product_name: `${item.product?.name || 'Custom Gift'} (${item.shape || 'Custom'})`,
        quantity: item.quantity || 1,
        price: getTierPrice(item.product?.offer_price, totalItemsCount),
        shape: item.shape || 'heart',
        frame_size: item.frameSize || null,
        frame_material: item.frameMaterial || null,
        custom_text: item.customText || '',
        custom_image: item.finalImages?.front || '',
        custom_image_back: item.finalImages?.back || ''
      }))
    };

    // Optionally save address to profile address book
    if (user?.id && saveAddressToBook) {
      fetch('http://127.0.0.1:8000/api/catalog/addresses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          district: formData.district,
          pincode: formData.pincode,
          is_default: true
        })
      }).catch(() => {});
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/catalog/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      let orderId = Math.floor(1000 + Math.random() * 9000);
      if (response.ok) {
        const orderData = await response.json();
        orderId = orderData.id;
      }
      setCreatedOrderId(orderId);

      if (formData.paymentMethod === 'upi_qr') {
        setIsProcessing(false);
        setShowUpiModal(true);
      } else if (formData.paymentMethod === 'online') {
        await triggerRazorpay(orderId, formData.fullName, formData.phone, formData.email);
      } else {
        completeOrderProcess(orderId);
      }
    } catch (error) {
      console.error('Order error:', error);
      const mockId = Math.floor(1000 + Math.random() * 9000);
      setCreatedOrderId(mockId);
      if (formData.paymentMethod === 'upi_qr') {
        setIsProcessing(false);
        setShowUpiModal(true);
      } else {
        completeOrderProcess(mockId);
      }
    }
  };

  const triggerRazorpay = async (orderId, customerName, customerPhone, customerEmail) => {
    const isSdkLoaded = await loadRazorpay();
    if (!isSdkLoaded) {
      alert('Failed to load Razorpay gateway. Please check internet connection.');
      setIsProcessing(false);
      return;
    }

    try {
      const orderRes = await fetch('http://127.0.0.1:8000/api/catalog/razorpay/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId })
      });

      let rzpData = {
        razorpay_merchant_key: 'rzp_test_TPgFLwPg4P836j',
        amount: Math.round(finalTotal * 100),
        currency: 'INR',
        razorpay_order_id: null
      };

      if (orderRes.ok) {
        rzpData = await orderRes.json();
      }

      const options = {
        key: rzpData.razorpay_merchant_key || 'rzp_test_TPgFLwPg4P836j',
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        name: "Gobi Custom Gifts",
        description: `Payment for Order ORD-${orderId}`,
        order_id: rzpData.razorpay_order_id,
        handler: async function (response) {
          try {
            await fetch('http://127.0.0.1:8000/api/catalog/razorpay/verify/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
          } catch (e) {}
          completeOrderProcess(orderId);
        },
        prefill: {
          name: customerName,
          contact: customerPhone,
          email: customerEmail
        },
        theme: {
          color: "#EA580C"
        },
        modal: {
          ondismiss: function() {
            alert('Payment cancelled. Your order is logged as Pending.');
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (e) {
      completeOrderProcess(orderId);
    }
  };

  const completeOrderProcess = (orderId) => {
    setOrderCompleted(true);
    setIsProcessing(false);
    setShowUpiModal(false);
    clearCart();
    addToast('Order placed successfully! 🎉', 'success');
  };

  // ======================================================================
  // ORDER CONFIRMED SCREEN (WITH PRINTABLE INVOICE RECEIPT)
  // ======================================================================
  if (orderCompleted) {
    return (
      <div className="max-w-lg mx-auto py-12 sm:py-16 px-4">
        <div className="glass-card rounded-3xl p-6 sm:p-10 text-center border border-slate-200 shadow-xl space-y-6 animate-in zoom-in-95 duration-150">
          
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-1">
            <span className="badge-pill bg-emerald-100 text-emerald-800 text-xs">
              {t('checkout_confirmed_badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('checkout_thankyou_title')}
            </h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Order ID: <strong className="text-orange-600">ORD-{createdOrderId || '1048'}</strong>. {t('checkout_thankyou_desc')}
            </p>
          </div>

          {/* Printable Receipt Card */}
          <div id="printable-receipt" className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b pb-2">
              <span className="font-bold text-slate-900">Tax Invoice Receipt</span>
              <span className="text-slate-400">ORD-{createdOrderId || '1048'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-800 truncate max-w-[200px]">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="font-medium text-slate-800 text-right truncate max-w-[220px]">{formData.address}, {formData.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment:</span>
              <span className="font-bold text-slate-800">{formData.paymentMethod.toUpperCase()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t text-sm font-black text-slate-900">
              <span>Total Paid:</span>
              <span className="text-emerald-600">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button 
              onClick={() => window.print()}
              className="btn-secondary py-2.5 px-4 text-xs font-bold flex-1 flex items-center justify-center gap-1.5"
            >
              <Printer size={14} />
              <span>Download Invoice</span>
            </button>
            <button 
              onClick={() => navigate(`/track-order?id=${createdOrderId || ''}`)} 
              className="btn-accent py-2.5 px-5 text-xs font-bold flex-1"
            >
              <Truck size={14} />
              <span>{t('checkout_track_btn')}</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ======================================================================
  // CHECKOUT FORM VIEW
  // ======================================================================
  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6 sm:space-y-8">
      
      <div className="border-b border-slate-200 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">{t('checkout_badge')}</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
          {t('checkout_title')}
        </h1>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Delivery Details & Payment */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Saved Address Book Selector (If Available) */}
          {savedAddresses.length > 0 && (
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Saved Address Book
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {savedAddresses.map(addr => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleSelectSavedAddress(addr)}
                    className="p-2.5 rounded-xl border border-slate-200 text-left bg-slate-50 hover:bg-orange-50 hover:border-orange-500 transition-all text-xs"
                  >
                    <p className="font-bold text-slate-900">{addr.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{addr.street}, {addr.district}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Form */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin size={16} className="text-orange-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {t('checkout_address_title')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">{t('checkout_fullname')}</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    name="fullName" 
                    required 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    placeholder="Karthik S" 
                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-bold bg-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">{t('checkout_email')}</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="customer@gmail.com" 
                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-orange-500 bg-white" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">{t('checkout_phone')}</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="9876543210" 
                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-bold bg-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">{t('checkout_district')}</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-bold bg-white cursor-pointer"
                >
                  {TAMIL_NADU_DISTRICTS.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">{t('checkout_street')}</label>
                <input 
                  type="text" 
                  name="address" 
                  required 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="14, Gandhi Road, Anna Nagar" 
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-medium bg-white" 
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">{t('checkout_pincode')}</label>
                <input 
                  type="text" 
                  name="pincode" 
                  required 
                  value={formData.pincode} 
                  onChange={handleChange} 
                  placeholder="638452" 
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-bold bg-white" 
                />
              </div>
            </div>

            {/* Save Address Checkbox for logged-in users */}
            {user && (
              <label className="flex items-center gap-2 pt-1 text-xs text-slate-600 font-bold cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={saveAddressToBook} 
                  onChange={(e) => setSaveAddressToBook(e.target.checked)}
                  className="accent-orange-600 rounded" 
                />
                <span>Save this address to my profile address book for future orders</span>
              </label>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard size={16} className="text-orange-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {t('checkout_payment_title')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* UPI QR */}
              <label className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                formData.paymentMethod === 'upi_qr' 
                  ? 'border-orange-600 bg-orange-50/70' 
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}>
                <div className="flex items-center justify-between">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="upi_qr" 
                    checked={formData.paymentMethod === 'upi_qr'} 
                    onChange={handleChange}
                    className="accent-orange-600"
                  />
                  <QrCode size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xs">{t('checkout_pay_upi')}</p>
                  <p className="text-[10px] text-slate-500">{t('checkout_pay_upi_desc')}</p>
                </div>
              </label>

              {/* Razorpay Gateway */}
              <label className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                formData.paymentMethod === 'online' 
                  ? 'border-orange-600 bg-orange-50/70' 
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}>
                <div className="flex items-center justify-between">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="online" 
                    checked={formData.paymentMethod === 'online'} 
                    onChange={handleChange}
                    className="accent-orange-600"
                  />
                  <CreditCard size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xs">{t('checkout_pay_online')}</p>
                  <p className="text-[10px] text-slate-500">{t('checkout_pay_online_desc')}</p>
                </div>
              </label>

              {/* COD */}
              <label className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                formData.paymentMethod === 'cod' 
                  ? 'border-orange-600 bg-orange-50/70' 
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}>
                <div className="flex items-center justify-between">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={formData.paymentMethod === 'cod'} 
                    onChange={handleChange}
                    className="accent-orange-600"
                  />
                  <Banknote size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xs">{t('checkout_pay_cod')}</p>
                  <p className="text-[10px] text-slate-500">{t('checkout_pay_cod_desc')}</p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-5 sm:p-6 space-y-4 sticky top-24">
          <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
            {t('checkout_order_summary')} ({totalItemsCount})
          </h3>

          <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-slate-100 pr-1">
            {cart.map(item => {
              const currentUnitPrice = getTierPrice(item.product?.offer_price, totalItemsCount);
              const itemTotal = currentUnitPrice * (item.quantity || 1);
              return (
                <div key={item.cartId} className="pt-2 flex justify-between items-center text-xs">
                  <div className="max-w-[170px]">
                    <p className="font-bold text-slate-800 truncate">{item.product?.name || 'Custom Gift'}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity || 1} • {item.frameSize || item.shape || 'Heart'}</p>
                  </div>
                  <span className="font-black text-slate-900">₹{itemTotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>{t('cart_items_subtotal')}</span>
              <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>{t('cart_coupon_discount')} ({appliedCoupon?.code}):</span>
                <span>- ₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping across TN:</span>
              <span className="text-emerald-600 font-bold">{t('cart_shipping_free')}</span>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t">
              <span>{t('cart_total_payable')}</span>
              <span className="text-xl text-orange-600">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isProcessing || cart.length === 0}
            className="btn-accent w-full py-3.5 text-sm font-black shadow-md"
          >
            {isProcessing ? 'Processing...' : `${t('checkout_submit_btn')} (₹${finalTotal.toFixed(2)})`}
          </button>

          <div className="text-center pt-2 text-[10px] text-slate-400">
            <p className="flex items-center justify-center gap-1 font-bold text-slate-500">
              <Lock size={12} className="text-emerald-600" /> 256-Bit Encrypted Payment
            </p>
          </div>

        </div>

      </form>

      {/* UPI QR Payment Modal */}
      {showUpiModal && (
        <UpiPaymentModal
          amount={finalTotal.toFixed(2)}
          orderId={createdOrderId}
          customerName={formData.fullName}
          onPaymentSuccess={() => completeOrderProcess(createdOrderId)}
          onClose={() => setShowUpiModal(false)}
        />
      )}

      {/* Auth Modal for non-logged-in checkout */}
      <AuthModal 
        isOpen={showAuthModal && !orderCompleted}
        onClose={() => {
          if (!user) navigate('/cart');
          else setShowAuthModal(false);
        }}
        onSuccess={() => setShowAuthModal(false)}
        message="Please log in or create an account to proceed with checkout and receive live order status."
      />

    </div>
  );
}