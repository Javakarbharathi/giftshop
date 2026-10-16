import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  User, 
  Phone, 
  ArrowLeft,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Lock,
  ArrowRight
} from 'lucide-react';

const DEFAULT_STAGES = [
  "Order Confirmed",
  "Laser UV Printing & Fabrication",
  "Handcrafted Quality Polish",
  "Dispatched with Courier",
  "Delivered to Doorstep"
];

function OrderTracking() {
  const [searchParams] = useSearchParams();
  const orderParam = searchParams.get('id');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState(orderParam || '');
  const [trackingResult, setTrackingResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch logged in user orders with multi-attribute fallback matching
  const fetchMyOrders = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/catalog/orders/');
      if (res.ok) {
        const data = await res.json();
        const currentUsername = (user.username || user.name || '').toLowerCase();
        const userEmail = (user.email || '').toLowerCase();
        const userPhone = (user.phone || '').trim();
        const userId = user.id;

        const userOrders = data.filter(order => {
          if (userId && order.user === userId) return true;
          if (userEmail && (order.customer_email || '').toLowerCase() === userEmail) return true;
          if (userPhone && (order.customer_phone || '').trim() === userPhone) return true;
          
          const orderName = (order.customer_name || '').toLowerCase();
          if (currentUsername && (orderName.includes(currentUsername) || currentUsername.includes(orderName))) return true;
          return false;
        });

        setMyOrders(userOrders);
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // Handle instant selection of an active order
  const handleSelectOrder = (order) => {
    setOrderId(`ORD-${order.id}`);
    setErrorMessage('');
    
    const itemsSummary = order.items && order.items.length > 0 
      ? order.items.map(i => `${i.product_name} (x${i.quantity})`).join(', ')
      : 'Custom Acrylic Keepsake Gift';

    const stagesList = order.tracking_checkpoints 
      ? order.tracking_checkpoints.split(',').map(s => s.trim()).filter(Boolean) 
      : DEFAULT_STAGES;

    const parsedIndex = parseInt(order.current_checkpoint_index || 0, 10);

    setTrackingResult({
      rawId: order.id,
      id: `ORD-${order.id}`,
      date: order.created_at ? order.created_at.split('T')[0] : 'Today',
      stages: stagesList,
      currentIndex: parsedIndex,
      status: order.status || (parsedIndex >= stagesList.length - 1 ? 'Delivered' : 'In Fabrication'),
      partner: order.assigned_delivery_partner || 'TN36 Express Dispatch Team',
      items: itemsSummary,
      total: order.total_amount,
      shippingAddress: order.shipping_address,
      customerName: order.customer_name,
      paymentMethod: order.payment_method
    });

    setTimeout(() => {
      document.getElementById('live-tracking-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    fetchOrderDetails(order.id, true);
  };

  const fetchOrderDetails = async (idToFetch, silent = false) => {
    const cleanId = idToFetch.toString().replace(/\D/g, '');
    if (!cleanId) {
      // Check if found in myOrders by full text
      const matched = myOrders.find(o => `ORD-${o.id}`.toLowerCase() === idToFetch.toString().toLowerCase().trim());
      if (matched) {
        handleSelectOrder(matched);
        return;
      }
      setErrorMessage('Please enter a valid numeric Order ID (e.g. 5, ORD-5, ORD-12).');
      return;
    }

    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    setErrorMessage('');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/catalog/orders/${cleanId}/`);
      if (response.ok) {
        const data = await response.json();
        const itemsSummary = data.items && data.items.length > 0 
          ? data.items.map(i => `${i.product_name} (x${i.quantity})`).join(', ')
          : 'Custom Acrylic Keepsake Gift';

        const stagesList = data.tracking_checkpoints 
          ? data.tracking_checkpoints.split(',').map(s => s.trim()).filter(Boolean) 
          : DEFAULT_STAGES;

        const parsedIndex = Math.min(
          Math.max(0, parseInt(data.current_checkpoint_index || 0, 10)),
          stagesList.length - 1
        );

        setTrackingResult({
          rawId: data.id,
          id: `ORD-${data.id}`,
          date: data.created_at ? data.created_at.split('T')[0] : 'Today',
          stages: stagesList,
          currentIndex: parsedIndex,
          status: data.status || (parsedIndex >= stagesList.length - 1 ? 'Delivered' : 'In Fabrication'),
          partner: data.assigned_delivery_partner || 'TN36 Express Dispatch Team',
          items: itemsSummary,
          total: data.total_amount,
          shippingAddress: data.shipping_address,
          customerName: data.customer_name,
          paymentMethod: data.payment_method
        });

        if (!silent) {
          setTimeout(() => {
            document.getElementById('live-tracking-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
      } else {
        // Check local myOrders
        const localMatch = myOrders.find(o => o.id.toString() === cleanId);
        if (localMatch) {
          handleSelectOrder(localMatch);
        } else {
          setErrorMessage(`Order #ORD-${cleanId} was not found in our database. Please double check your order number.`);
        }
      }
    } catch (error) {
      console.error('Tracking error:', error);
      const localMatch = myOrders.find(o => o.id.toString() === cleanId);
      if (localMatch) {
        handleSelectOrder(localMatch);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (orderParam) {
      setOrderId(`ORD-${orderParam.replace(/\D/g, '')}`);
      fetchOrderDetails(orderParam);
    }
  }, [orderParam]);

  // Auto-polling when viewing a specific tracking result (every 6 seconds)
  useEffect(() => {
    if (!trackingResult?.rawId) return;
    const interval = setInterval(() => {
      fetchOrderDetails(trackingResult.rawId, true);
    }, 6000);
    return () => clearInterval(interval);
  }, [trackingResult?.rawId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    fetchOrderDetails(orderId);
  };

  // PROTECTED GATE: Tracking is only visible to logged-in users
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="glass-card rounded-3xl p-8 border border-slate-200/90 shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-xs">
            <Lock size={26} />
          </div>
          <div className="space-y-1.5">
            <span className="badge-pill bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
              Customer Account Required
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign In to Track Orders
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Live fabrication progress, quality inspection, and courier dispatch tracking are visible exclusively to registered customers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="btn-accent w-full py-3.5 text-xs font-black shadow-md flex items-center justify-center gap-2"
          >
            <span>Sign In / Register to Track</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
          message="Log in or register to access real-time order tracking and route details."
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="badge-pill bg-blue-100 text-blue-800 text-xs font-bold inline-flex items-center gap-1.5">
          <Truck size={13} /> Live Logistics Route Tracker
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Track Your Custom Keepsake
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Enter your Order ID to monitor laser fabrication, quality inspection, and real-time delivery checkpoints across Tamil Nadu.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 max-w-xl mx-auto border border-slate-200/90 shadow-md">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              required 
              value={orderId} 
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g. 5, ORD-5, ORD-12)" 
              className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold uppercase outline-none focus:border-orange-500 bg-white"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="btn-accent py-3 px-6 text-xs sm:text-sm font-bold shadow-md shrink-0 flex items-center gap-1.5"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
            <span>{loading ? 'Searching...' : 'Track Route'}</span>
          </button>
        </form>

        {errorMessage && (
          <p className="mt-3 text-xs font-bold text-rose-600 text-center bg-rose-50 p-2.5 rounded-xl border border-rose-200 animate-in fade-in">
            {errorMessage}
          </p>
        )}
      </div>

      {/* DETAILED TRACKING TIMELINE RESULT */}
      {trackingResult && (
        <div id="live-tracking-timeline" className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Order Information Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/80 p-5 sm:p-6 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="badge-pill bg-blue-600 text-white text-[11px] font-black py-0.5 px-2.5">
                  {trackingResult.id}
                </span>
                <span className={`badge-pill text-[10px] font-black ${
                  trackingResult.currentIndex >= trackingResult.stages.length - 1 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {trackingResult.status}
                </span>
                {isRefreshing && (
                  <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 animate-pulse">
                    <RefreshCw size={10} className="animate-spin" /> Live Syncing...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Customer: <strong className="text-slate-900 font-black">{trackingResult.customerName || 'TN36 Customer'}</strong>
              </p>
              <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                <Truck size={13} className="text-blue-600 shrink-0" />
                <span>Delivery Partner: <strong className="text-blue-700 font-black">{trackingResult.partner}</strong></span>
              </p>
            </div>

            <div className="md:text-right space-y-1">
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Order Value</p>
              <p className="text-2xl font-black text-emerald-600">₹{trackingResult.total}</p>
              <p className="text-[11px] text-slate-500 max-w-xs truncate font-medium flex items-center md:justify-end gap-1">
                <MapPin size={11} className="text-blue-500 shrink-0" />
                <span>{trackingResult.shippingAddress}</span>
              </p>
            </div>
          </div>

          {/* Dynamic Checkpoints Timeline */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                <span>Real-Time Checkpoint Progression</span>
              </h3>
              <button 
                type="button"
                onClick={() => fetchOrderDetails(trackingResult.rawId)}
                className="btn-secondary py-1 px-3 text-[11px] font-bold flex items-center gap-1"
                title="Force refresh checkpoint status"
              >
                <RefreshCw size={11} className={loading || isRefreshing ? 'animate-spin' : ''} />
                <span>Refresh Status</span>
              </button>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {trackingResult.stages.map((stage, index) => {
                const isCompleted = index <= trackingResult.currentIndex;
                const isCurrent = index === trackingResult.currentIndex;

                return (
                  <div key={index} className="flex items-start gap-4 relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs z-10 -ml-6.5 shrink-0 transition-all ${
                      isCurrent 
                        ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100 scale-110' 
                        : isCompleted 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={15} /> : index + 1}
                    </div>

                    <div className="space-y-0.5 pt-0.5">
                      <p className={`text-xs sm:text-sm ${
                        isCurrent 
                          ? 'text-blue-700 font-black text-sm' 
                          : isCompleted 
                          ? 'text-slate-800 font-bold' 
                          : 'text-slate-400 font-medium'
                      }`}>
                        {stage}
                      </p>
                      {isCurrent && (
                        <span className="inline-block text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          Active Checkpoint
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary Row */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-600">
            <p>Package Content: <strong className="text-slate-900 font-bold">{trackingResult.items}</strong></p>
            <button 
              type="button"
              onClick={() => { setTrackingResult(null); setOrderId(''); }}
              className="btn-secondary py-1.5 px-4 text-xs font-bold"
            >
              Close Tracker
            </button>
          </div>

        </div>
      )}

      {/* RECENT ORDERS FOR LOGGED IN CUSTOMER (Displayed under search bar) */}
      {user && myOrders.length > 0 && (
        <div className="glass-card rounded-3xl p-5 sm:p-6 max-w-2xl mx-auto border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-orange-600" />
              <span>Your Active Orders ({myOrders.length})</span>
            </h3>
            <button 
              type="button"
              onClick={fetchMyOrders}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <RefreshCw size={11} /> Refresh
            </button>
          </div>

          <div className="space-y-3">
            {myOrders.map(order => {
              const stages = order.tracking_checkpoints ? order.tracking_checkpoints.split(',').map(s => s.trim()).filter(Boolean) : DEFAULT_STAGES;
              const curIdx = parseInt(order.current_checkpoint_index || 0, 10);
              const curStage = stages[curIdx] || 'Processing';
              const progressPct = Math.round(((curIdx + 1) / stages.length) * 100);
              const isDone = curIdx >= stages.length - 1;
              const isSelected = trackingResult?.rawId === order.id;

              return (
                <div 
                  key={order.id} 
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                    isSelected 
                      ? 'bg-blue-50/60 border-blue-400 ring-2 ring-blue-200 shadow-sm'
                      : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs bg-slate-900 text-white px-2 py-0.5 rounded-md">
                          ORD-{order.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800">₹{order.total_amount}</span>
                        <span className={`badge-pill text-[9px] font-black ${
                          isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status || (isDone ? 'Delivered' : 'In Progress')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 truncate max-w-sm font-medium">
                        {order.items && order.items.length > 0 
                          ? order.items.map(i => `${i.product_name} (${i.quantity})`).join(', ')
                          : 'Custom Gift Order'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectOrder(order)}
                      className={`btn py-1.5 px-3.5 text-xs font-bold shrink-0 self-end sm:self-center rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'btn-secondary hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
                      }`}
                    >
                      {isSelected ? '✓ Viewing Route' : '📍 View Live Route →'}
                    </button>
                  </div>

                  {/* Progress bar sync */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600">
                      <span>Live Checkpoint: <strong className="text-blue-700">{curStage}</strong></span>
                      <span>Step {curIdx + 1} of {stages.length} ({progressPct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          isDone ? 'bg-emerald-600' : 'bg-orange-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

export default OrderTracking;