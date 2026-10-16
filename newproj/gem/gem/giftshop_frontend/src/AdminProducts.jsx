import { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  CheckCircle2, 
  Layers, 
  Search,
  DollarSign,
  AlertTriangle,
  ShoppingBag
} from 'lucide-react';

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_orders: 0,
    total_revenue: 0,
    completed_orders: 0,
    pending_orders: 0,
    total_products: 0,
    low_stock_products: []
  });
  const [searchFilter, setSearchFilter] = useState('');
  
  // Inline Order Editing State
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    assigned_delivery_partner: ''
  });
  const [checkpointsList, setCheckpointsList] = useState(['Order Confirmed', 'Laser UV Printing', 'Quality Polish', 'Dispatched with Courier', 'Delivered']);

  const [newProduct, setNewProduct] = useState({
    name: '',
    product_type: 'keychain',
    base_price: '',
    offer_price: '',
    description: '',
    stock: 100,
    image: '/keychain-hardware.png'
  });

  const PRODUCTS_API = 'http://127.0.0.1:8000/api/catalog/products/';
  const ORDERS_API = 'http://127.0.0.1:8000/api/catalog/orders/';
  const PARTNERS_API = 'http://127.0.0.1:8000/api/catalog/delivery-partners/';
  const ANALYTICS_API = 'http://127.0.0.1:8000/api/catalog/admin-analytics/';

  const fetchProducts = async () => {
    try {
      const response = await fetch(PRODUCTS_API);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {}
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(ORDERS_API);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {}
  };

  const fetchDeliveryPartners = async () => {
    try {
      const response = await fetch(PARTNERS_API);
      if (response.ok) {
        const data = await response.json();
        setDeliveryPartners(data);
      }
    } catch (error) {}
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(ANALYTICS_API);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchDeliveryPartners();
    fetchAnalytics();
  }, []);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.offer_price) return;

    const productPayload = {
      name: newProduct.name,
      product_type: newProduct.product_type,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      base_price: newProduct.base_price || newProduct.offer_price,
      offer_price: newProduct.offer_price,
      description: newProduct.description,
      stock: parseInt(newProduct.stock) || 100,
      image: newProduct.image || '/keychain-hardware.png'
    };

    try {
      const response = await fetch(PRODUCTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      });

      if (response.ok) {
        setNewProduct({ name: '', product_type: 'keychain', base_price: '', offer_price: '', description: '', stock: 100, image: '/keychain-hardware.png' });
        fetchProducts();
        fetchAnalytics();
        alert('Product added successfully!');
      } else {
        alert('Failed to add product.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`${PRODUCTS_API}${id}/`, { method: 'DELETE' });
      if (response.ok) {
        fetchProducts();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const startEditingOrder = (order) => {
    setEditingOrderId(order.id);
    setEditForm({
      status: order.status,
      assigned_delivery_partner: order.assigned_delivery_partner || ''
    });
    
    if (order.tracking_checkpoints) {
      setCheckpointsList(order.tracking_checkpoints.split(',').map(s => s.trim()));
    } else {
      setCheckpointsList(['Order Confirmed', 'Laser UV Printing', 'Quality Polish', 'Dispatched with Courier', 'Delivered']);
    }
  };

  const handleCheckpointItemChange = (index, value) => {
    const updated = [...checkpointsList];
    updated[index] = value;
    setCheckpointsList(updated);
  };

  const addCheckpointField = () => {
    setCheckpointsList([...checkpointsList, '']);
  };

  const removeCheckpointField = (index) => {
    setCheckpointsList(checkpointsList.filter((_, i) => i !== index));
  };

  const handleSaveOrder = async (orderId) => {
    const combinedCheckpoints = checkpointsList.filter(c => c.trim() !== '').join(',');

    try {
      const response = await fetch(`${ORDERS_API}${orderId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editForm.status,
          tracking_checkpoints: combinedCheckpoints,
          assigned_delivery_partner: editForm.assigned_delivery_partner
        })
      });

      if (response.ok) {
        setEditingOrderId(null);
        fetchOrders();
        fetchAnalytics();
      } else {
        alert('Failed to update order logistics.');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.customer_name && o.customer_name.toLowerCase().includes(searchFilter.toLowerCase())) ||
    (o.id && o.id.toString().includes(searchFilter)) ||
    (o.status && o.status.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      
      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="badge-pill bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 mb-1">
            Administrative Control Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Admin & Workshop Management</h1>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-bold uppercase text-slate-400">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600">₹{analytics.total_revenue?.toLocaleString('en-IN')}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-bold uppercase text-slate-400">Total Orders</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{analytics.total_orders}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-bold uppercase text-slate-400">Pending Fabrication</p>
          <p className="text-xl sm:text-2xl font-black text-orange-600">{analytics.pending_orders}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-bold uppercase text-slate-400">Catalog Products</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{analytics.total_products || products.length}</p>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('products')} 
          className={`px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'products' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package size={15} className="text-orange-600" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('orders')} 
          className={`px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck size={15} className="text-emerald-600" />
          <span>Orders & Dispatch Routes ({orders.length})</span>
        </button>
      </div>

      {activeTab === 'products' ? (
        /* PRODUCT CATALOG TAB */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Add Product Form */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus size={16} className="text-orange-600" /> Add New Gift Item
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Product Title *</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={newProduct.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Heart Acrylic Keychain" 
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-white outline-none focus:border-orange-500 font-bold" 
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Product Type *</label>
                <select
                  name="product_type"
                  value={newProduct.product_type}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-white font-bold outline-none focus:border-orange-500"
                >
                  <option value="keychain">Acrylic Photo Keychain (Shape Cutout)</option>
                  <option value="frame">Custom Photo Frame (Multi-Size & Border)</option>
                  <option value="coaster">Resin Photo Coaster (Set of 4)</option>
                  <option value="nameplate">Wooden Door Nameplate Plaque</option>
                  <option value="mug">Ceramic Photo Mug</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">Base Price (₹)</label>
                  <input 
                    type="number" 
                    name="base_price" 
                    value={newProduct.base_price} 
                    onChange={handleInputChange} 
                    placeholder="249" 
                    className="w-full border border-slate-200 rounded-xl p-2.5 bg-white outline-none focus:border-orange-500" 
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">Offer Price (₹) *</label>
                  <input 
                    type="number" 
                    name="offer_price" 
                    required 
                    value={newProduct.offer_price} 
                    onChange={handleInputChange} 
                    placeholder="149" 
                    className="w-full border border-slate-200 rounded-xl p-2.5 bg-white outline-none focus:border-orange-500 font-bold" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Stock Quantity</label>
                <input 
                  type="number" 
                  name="stock" 
                  value={newProduct.stock} 
                  onChange={handleInputChange} 
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-white outline-none focus:border-orange-500 font-bold" 
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea 
                  name="description" 
                  rows="2"
                  value={newProduct.description} 
                  onChange={handleInputChange} 
                  placeholder="Material specs, customization options..." 
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-white outline-none focus:border-orange-500" 
                />
              </div>

              <button 
                type="submit" 
                className="btn-accent w-full py-3 text-xs font-black shadow-sm"
              >
                + Add Product to Live Store
              </button>
            </form>
          </div>

          {/* Existing Products List */}
          <div className="lg:col-span-8 glass-card rounded-3xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              Existing Database Products ({products.length})
            </h3>

            <div className="space-y-3">
              {products.length === 0 ? (
                <p className="text-slate-500 text-xs py-8 text-center">No products in catalog yet.</p>
              ) : (
                products.map(product => (
                  <div key={product.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl border flex items-center justify-center p-1 shrink-0 overflow-hidden">
                        <img src={product.image || '/keychain-hardware.png'} alt={product.name} className="max-h-full max-w-full object-cover" loading="lazy" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{product.name}</h4>
                          <span className="badge-pill bg-slate-100 text-slate-600 text-[9px] font-bold">
                            {product.product_type?.toUpperCase() || 'KEYCHAIN'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Base: <span className="line-through">₹{product.base_price}</span> • Offer: <strong className="text-emerald-600 font-black">₹{product.offer_price}</strong> • Stock: {product.stock || 100}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteProduct(product.id)} 
                      className="btn-secondary py-1 px-2.5 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 self-end sm:self-auto"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* ORDERS & ROUTE LOGISTICS TAB */
        <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-5">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Customer Orders & Logistics Routes</h3>
              <p className="text-xs text-slate-500">Assign delivery partners and update shipment checkpoints in real time.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <p className="text-slate-500 text-xs py-8 text-center">No orders match your filter criteria.</p>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                  
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">ORD-{order.id}</span>
                        <span className="text-xs font-bold text-slate-700">{order.customer_name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        📞 {order.customer_phone} • 📍 {order.shipping_address}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="badge-pill bg-blue-50 text-blue-700 text-[10px]">
                        Status: {order.status}
                      </span>
                      <span className="badge-pill bg-emerald-100 text-emerald-800 text-[10px]">
                        ₹{order.total_amount}
                      </span>
                    </div>
                  </div>

                  {editingOrderId === order.id ? (
                    /* Inline Editing Form */
                    <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 space-y-3 text-xs">
                      <h5 className="font-black text-xs text-orange-950 uppercase">
                        Configure Delivery Partner & Checkpoints
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">Status</label>
                          <select 
                            value={editForm.status} 
                            onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                            className="w-full border border-slate-200 rounded-xl p-2 bg-white font-bold"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Fabrication">In Fabrication</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">Assign Partner</label>
                          <select 
                            value={editForm.assigned_delivery_partner} 
                            onChange={(e) => setEditForm({...editForm, assigned_delivery_partner: e.target.value})}
                            className="w-full border border-slate-200 rounded-xl p-2 bg-white font-bold"
                          >
                            <option value="">Unassigned</option>
                            {deliveryPartners.map((partner, index) => (
                              <option key={index} value={partner.username}>{partner.username}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-bold text-slate-600 uppercase">Checkpoints Sequence</label>
                        {checkpointsList.map((cp, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              type="text" 
                              value={cp} 
                              onChange={(e) => handleCheckpointItemChange(idx, e.target.value)}
                              className="flex-1 border border-slate-200 rounded-xl p-1.5 bg-white text-xs"
                            />
                            {checkpointsList.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => removeCheckpointField(idx)} 
                                className="btn-secondary py-1 px-2 text-xs text-rose-600"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={addCheckpointField} 
                          className="btn-secondary py-1 px-2.5 text-[10px] font-bold"
                        >
                          + Add Checkpoint
                        </button>
                      </div>

                      <div className="flex gap-2 justify-end pt-2 border-t border-orange-200">
                        <button 
                          onClick={() => setEditingOrderId(null)} 
                          className="btn-secondary py-1.5 px-3 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleSaveOrder(order.id)} 
                          className="btn-accent py-1.5 px-4 text-xs font-bold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-600 pt-1">
                      <p>Partner: <strong className="text-slate-900">{order.assigned_delivery_partner || 'Unassigned'}</strong></p>
                      <button 
                        onClick={() => startEditingOrder(order)}
                        className="btn-primary py-1 px-3 text-xs font-bold"
                      >
                        <Edit size={13} /> Manage Route
                      </button>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}