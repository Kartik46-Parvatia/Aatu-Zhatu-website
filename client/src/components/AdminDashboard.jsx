import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, AlertTriangle, Plus, Trash2, Edit2, Check, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ addToast, onProductMutated }) {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory'
  const [loading, setLoading] = useState(true);

  // New product form modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'tech',
    price: '',
    originalPrice: '',
    stock: 20,
    icon: '✨',
    badge: 'New',
    desc: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [resStats, resOrders, resProds] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/products').then(r => r.json())
      ]);

      if (resStats.success) setStats(resStats.stats);
      if (resOrders.success) setOrders(resOrders.orders);
      if (resProds.success) setProducts(resProds.products);
    } catch (err) {
      addToast('Failed to load store management telemetry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Order ${orderId} updated to "${nextStatus}"`, 'success');
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
      } else {
        addToast(data.error || 'Failed to update order status', 'error');
      }
    } catch (err) {
      addToast('Error communicating with order server', 'error');
    }
  };

  const handleStockUpdate = async (productId, currentStock, delta) => {
    const nextStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: nextStock })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === productId ? data.product : p));
        addToast(`Stock for "${data.product.name}" set to ${nextStock}`, 'success');
        if (onProductMutated) onProductMutated();
      }
    } catch (err) {
      addToast('Failed to adjust product stock', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from store inventory?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        addToast(`Product "${name}" deleted from store.`, 'info');
        if (onProductMutated) onProductMutated();
      }
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) {
      addToast('Product name and price are required.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProd,
          price: Number(newProd.price),
          originalPrice: Number(newProd.originalPrice || newProd.price * 1.4),
          stock: Number(newProd.stock)
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => [data.product, ...prev]);
        setIsAddModalOpen(false);
        setNewProd({ name: '', category: 'tech', price: '', originalPrice: '', stock: 20, icon: '✨', badge: 'New', desc: '' });
        addToast(`New product "${data.product.name}" added to catalog!`, 'success');
        if (onProductMutated) onProductMutated();
      } else {
        addToast(data.error || 'Failed to create product', 'error');
      }
    } catch (err) {
      addToast('Error creating product', 'error');
    }
  };

  return (
    <div className="section-wrapper" style={{ paddingTop: '30px' }}>
      <div className="section-head">
        <div>
          <div className="pill-tag" style={{ marginBottom: '8px' }}>
            STORE MANAGEMENT CONTROL CENTER
          </div>
          <h2>Aatu Zhatu Admin Portal</h2>
          <p>Real-time analytics, inventory replenishment, and fulfillment status tracker.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={loadData}>
            <RefreshCw size={15} /> Refresh Data
          </button>
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {stats && (
        <div className="admin-stats-grid">
          <div className="stat-kpi-card">
            <p>TOTAL STORE REVENUE</p>
            <h3 style={{ color: '#39d353' }}>₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
            <span style={{ fontSize: '12px', color: '#687788' }}>Lifetime customer gross</span>
          </div>

          <div className="stat-kpi-card">
            <p>TOTAL ORDERS</p>
            <h3>{stats.totalOrders}</h3>
            <span style={{ fontSize: '12px', color: '#687788' }}>Avg value: ₹{stats.avgOrderValue}</span>
          </div>

          <div className="stat-kpi-card">
            <p>ACTIVE CATALOG ITEMS</p>
            <h3>{stats.totalProducts}</h3>
            <span style={{ fontSize: '12px', color: '#687788' }}>Across 3 categories</span>
          </div>

          <div className="stat-kpi-card">
            <p>LOW STOCK ALERTS</p>
            <h3 style={{ color: stats.lowStockCount > 0 ? '#ffc107' : '#39d353' }}>
              {stats.lowStockCount} items
            </h3>
            <span style={{ fontSize: '12px', color: '#687788' }}>Inventory &lt; 15 units</span>
          </div>
        </div>
      )}

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #253140', paddingBottom: '14px', marginBottom: '20px' }}>
        <button
          className={`filter-pill ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          className={`filter-pill ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Product &amp; Stock Inventory ({products.length})
        </button>
      </div>

      {/* Tab 1: Orders Table */}
      {activeTab === 'orders' && (
        <div style={{ background: '#151b23', border: '1px solid #24303f', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Fulfillment Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <b style={{ color: '#39d353' }}>{o.id}</b>
                    </td>
                    <td style={{ color: '#8b949e', whiteSpace: 'nowrap' }}>
                      {new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{o.customer.name}</div>
                      <div style={{ fontSize: '11px', color: '#687788' }}>{o.customer.city}</div>
                    </td>
                    <td>
                      <span style={{ background: '#1c2533', padding: '3px 8px', borderRadius: '6px', fontSize: '12px' }}>
                        {o.items.length} items ({o.items.reduce((s, x) => s + x.qty, 0)} pcs)
                      </span>
                    </td>
                    <td>
                      <b>₹{o.pricing.total.toLocaleString('en-IN')}</b>
                    </td>
                    <td>
                      <span style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: o.payment.status === 'completed' ? '#39d353' : '#e3b341' }}>
                        {o.payment.method} ({o.payment.status})
                      </span>
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="sort-select"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing / Packing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory & Stock */}
      {activeTab === 'inventory' && (
        <div style={{ background: '#151b23', border: '1px solid #24303f', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Stock Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px', background: '#101620', width: '34px', height: '34px', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                          {p.icon || '📦'}
                        </span>
                        <div>
                          <b style={{ color: '#eef2f7' }}>{p.name}</b>
                          {p.badge && <span style={{ marginLeft: '8px', fontSize: '10px', color: '#39d353', background: '#17271e', padding: '2px 6px', borderRadius: '4px' }}>{p.badge}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize', color: '#9aa5b5' }}>{p.category}</span>
                    </td>
                    <td>
                      <b>₹{p.price.toLocaleString('en-IN')}</b>
                      {p.originalPrice && (
                        <div style={{ fontSize: '11px', color: '#687788', textDecoration: 'line-through' }}>
                          ₹{p.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ color: '#ffc107', fontWeight: 700 }}>★ {p.rating}</span> ({p.reviewCount})
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <b style={{ color: p.stock < 15 ? '#ffc107' : '#39d353', minWidth: '24px' }}>
                          {p.stock}
                        </b>
                        <button
                          onClick={() => handleStockUpdate(p.id, p.stock, -1)}
                          style={{ background: '#1e2836', color: '#eef2f7', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}
                          title="Reduce stock by 1"
                        >
                          −1
                        </button>
                        <button
                          onClick={() => handleStockUpdate(p.id, p.stock, 5)}
                          style={{ background: '#1e2836', color: '#39d353', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}
                          title="Replenish stock by 5"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        style={{ background: 'transparent', color: '#f85149', padding: '6px' }}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '540px', padding: '28px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '18px' }}>Add Product to Catalog</h3>
            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Noise Canceling Earbuds"
                  value={newProd.name}
                  onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newProd.category}
                    onChange={e => setNewProd({ ...newProd, category: e.target.value })}
                    className="sort-select"
                  >
                    <option value="tech">Technology</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home &amp; Living</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Initial Stock Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newProd.stock}
                    onChange={e => setNewProd({ ...newProd, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="499"
                    value={newProd.price}
                    onChange={e => setNewProd({ ...newProd, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="999"
                    value={newProd.originalPrice}
                    onChange={e => setNewProd({ ...newProd, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Icon Emoji</label>
                  <input
                    type="text"
                    placeholder="🎧"
                    value={newProd.icon}
                    onChange={e => setNewProd({ ...newProd, icon: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Badge Tag</label>
                  <input
                    type="text"
                    placeholder="New / Trending"
                    value={newProd.badge}
                    onChange={e => setNewProd({ ...newProd, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  placeholder="Short description highlighting the product's benefits..."
                  value={newProd.desc}
                  onChange={e => setNewProd({ ...newProd, desc: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Product →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
