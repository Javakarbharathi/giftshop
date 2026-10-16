import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Truck, MapPin, Phone, CheckCircle2, ArrowRight, Package, User } from 'lucide-react';

function DeliveryPartner() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const ORDERS_API = 'http://127.0.0.1:8000/api/catalog/orders/';

  const fetchOrders = async () => {
    try {
      const res = await fetch(ORDERS_API);
      if (res.ok) {
        const data = await res.json();
        const partnerName = (user?.username || user?.name || '').toLowerCase();
        const assignedOrders = data.filter(order => 
          (order.assigned_delivery_partner || '').toLowerCase() === partnerName ||
          (order.assigned_delivery_partner && partnerName.includes(order.assigned_delivery_partner.toLowerCase())) ||
          (!order.assigned_delivery_partner && partnerName.includes('delivery'))
        );
        setOrders(assignedOrders);
      }
    } catch (err) {
      console.error('Error fetching partner orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const advanceCheckpoint = async (order) => {
    const defaultStages = [
      "Order Confirmed",
      "Laser UV Printing & Fabrication",
      "Handcrafted Quality Polish",
      "Dispatched with Courier",
      "Delivered to Doorstep"
    ];
    const stages = order.tracking_checkpoints ? order.tracking_checkpoints.split(',').map(s => s.trim()) : defaultStages;
    const nextIndex = (order.current_checkpoint_index || 0) + 1;
    
    if (nextIndex >= stages.length) {
      alert('Order has already reached the final Delivered state!');
      return;
    }
    
    const newStatus = nextIndex === stages.length - 1 ? 'Delivered' : 'In Transit';
    setUpdatingId(order.id);

    try {
      const res = await fetch(`${ORDERS_API}${order.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_checkpoint_index: nextIndex, status: newStatus })
      });
      if (res.ok) {
        await fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <span className="badge-pill bg-emerald-100 text-emerald-800 text-xs mb-1.5 font-bold">
            Field Logistics Driver Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Delivery Dispatches
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in Driver: <strong className="text-emerald-700 font-black">{user.username || user.name}</strong>
          </p>
        </div>

        <button 
          onClick={fetchOrders} 
          className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-xs"
        >
          <span>🔄 Refresh Route</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Package size={16} className="text-emerald-600" />
            Assigned Shipments ({orders.length})
          </h3>
          <span className="text-[11px] font-bold text-slate-500">
            {orders.filter(o => (o.current_checkpoint_index || 0) < 4).length} Pending Deliveries
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-bold text-xs">Loading assigned route packages...</div>
        ) : orders.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center border border-slate-200">
            <p className="text-slate-500 text-sm font-semibold mb-2">No shipments currently assigned to your driver account.</p>
            <p className="text-xs text-slate-400">New dispatches assigned by the workshop will appear here in real time.</p>
          </div>
        ) : (
          orders.map(order => {
            const defaultStages = [
              "Order Confirmed",
              "Laser UV Printing & Fabrication",
              "Handcrafted Quality Polish",
              "Dispatched with Courier",
              "Delivered to Doorstep"
            ];
            const stages = order.tracking_checkpoints ? order.tracking_checkpoints.split(',').map(s => s.trim()) : defaultStages;
            const currentIndex = order.current_checkpoint_index || 0;
            const currentStageName = stages[currentIndex] || 'Processing';
            const hasNextStage = currentIndex + 1 < stages.length;
            const nextStageName = hasNextStage ? stages[currentIndex + 1] : null;
            const isDelivered = currentIndex >= stages.length - 1;

            return (
              <div key={order.id} className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md space-y-4">
                
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-base text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                        ORD-{order.id}
                      </span>
                      <span className="text-sm font-bold text-slate-800">{order.customer_name}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                      <MapPin size={13} className="text-blue-500 shrink-0" />
                      <span>{order.shipping_address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.customer_phone && (
                      <a 
                        href={`tel:${order.customer_phone}`}
                        className="btn-secondary py-1.5 px-3 text-xs font-bold text-blue-700 bg-blue-50 border-blue-200 flex items-center gap-1 hover:bg-blue-100"
                      >
                        <Phone size={13} /> {order.customer_phone}
                      </a>
                    )}
                    <span className={`badge-pill text-[10px] font-black ${
                      isDelivered ? 'bg-emerald-600 text-white' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status || 'In Route'}
                    </span>
                  </div>
                </div>

                {/* VISUAL CHECKPOINTS STEPPER */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Route Progression:</span>
                    <span className="text-blue-600 font-black">
                      Step {currentIndex + 1} of {stages.length}
                    </span>
                  </div>

                  {/* Horizontal Stage Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
                    {stages.map((stg, sIdx) => {
                      const isDone = sIdx < currentIndex;
                      const isCurr = sIdx === currentIndex;
                      const isNext = sIdx === currentIndex + 1;

                      return (
                        <div 
                          key={sIdx}
                          className={`p-2 rounded-xl border flex flex-col justify-between transition-all ${
                            isCurr 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                              : isDone
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium'
                              : isNext
                              ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold ring-2 ring-amber-200 animate-pulse'
                              : 'bg-white text-slate-400 border-slate-200 font-normal'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] uppercase tracking-wider opacity-80">
                              Step {sIdx + 1}
                            </span>
                            {isDone && <CheckCircle2 size={12} className="text-emerald-600" />}
                            {isCurr && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                            {isNext && <span className="badge-pill bg-amber-200 text-amber-900 text-[8px] py-0 px-1 font-black">NEXT</span>}
                          </div>
                          <p className="leading-tight text-[11px] truncate" title={stg}>
                            {stg}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CURRENT & NEXT STAGE ACTION CARD */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Current Active Checkpoint:</span>
                      <strong className="text-blue-700 text-xs font-black">{currentStageName}</strong>
                    </div>

                    {hasNextStage && (
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">👉 Upcoming Next Checkpoint:</span>
                        <strong className="text-amber-900 text-xs font-black bg-amber-100 px-2 py-0.5 rounded-md">
                          Step {currentIndex + 2}: {nextStageName}
                        </strong>
                      </div>
                    )}
                  </div>

                  {!isDelivered ? (
                    <button 
                      onClick={() => advanceCheckpoint(order)}
                      disabled={updatingId === order.id}
                      className="btn-accent py-2.5 px-5 text-xs font-black shadow-md w-full md:w-auto flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {updatingId === order.id ? (
                        <span>Updating Checkpoint...</span>
                      ) : (
                        <>
                          <span>
                            {currentIndex + 1 === stages.length - 1 
                              ? `🏁 Mark Final Delivery: "${nextStageName}"` 
                              : `👉 Advance to: "${nextStageName}"`}
                          </span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="badge-pill bg-emerald-600 text-white text-xs py-2 px-4 shadow-sm flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> 100% Delivered to Customer
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default DeliveryPartner;