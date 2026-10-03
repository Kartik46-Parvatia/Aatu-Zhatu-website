import React, { useState, useEffect } from 'react';
import { Package, Search, CheckCircle2, Clock, Truck, Home, AlertCircle, ArrowRight } from 'lucide-react';

export default function OrderTrackerView({ initialOrderId, addToast }) {
  const [searchId, setSearchId] = useState(initialOrderId || 'AZ-10492');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchOrder = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/orders/${idToFetch.trim()}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setErrorMsg(`No order found matching ID "${idToFetch}". Try example "AZ-10492".`);
      }
    } catch (err) {
      setErrorMsg('Failed to connect to tracking server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      fetchOrder(initialOrderId);
    } else {
      fetchOrder('AZ-10492');
    }
  }, [initialOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(searchId);
  };

  const getStepIcon = (statusKey) => {
    switch (statusKey) {
      case 'placed': return <CheckCircle2 size={16} />;
      case 'processing': return <Clock size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'out_for_delivery': return <Package size={16} />;
      case 'delivered': return <Home size={16} />;
      default: return <CheckCircle2 size={16} />;
    }
  };

  return (
    <div className="section-wrapper" style={{ paddingTop: '30px' }}>
      <div className="section-head" style={{ marginBottom: '24px' }}>
        <div>
          <div className="pill-tag" style={{ marginBottom: '8px' }}>
            <Package size={13} /> LIVE COURIER TRACKING
          </div>
          <h2>Track Your Shipment</h2>
          <p>Real-time delivery milestones and logistics updates for your Aatu Zhatu parcels.</p>
        </div>
      </div>

      {/* Tracker Search Input */}
      <form onSubmit={handleSearch} style={{ maxWidth: '600px', marginBottom: '36px', display: 'flex', gap: '10px' }}>
        <div className="search-input-wrap" style={{ flex: 1 }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Enter Order ID (e.g. AZ-10492)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ width: '100%', textTransform: 'uppercase' }}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0 24px' }}>
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {errorMsg && (
        <div style={{
          background: 'rgba(248, 81, 73, 0.15)',
          border: '1px solid #f85149',
          color: '#f85149',
          padding: '16px 20px',
          borderRadius: '12px',
          maxWidth: '600px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px'
        }}>
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
          <button
            onClick={() => { setSearchId('AZ-10492'); fetchOrder('AZ-10492'); }}
            style={{ marginLeft: 'auto', background: 'transparent', color: '#39d353', fontWeight: 700, textDecoration: 'underline' }}
          >
            Load Demo AZ-10492
          </button>
        </div>
      )}

      {order && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {/* Tracking Timeline */}
          <div className="checkout-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #24303f', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6a7888', fontWeight: 700 }}>ORDER STATUS</span>
                <h3 style={{ fontSize: '20px', color: '#39d353', margin: 0, textTransform: 'capitalize' }}>
                  {order.status.replace(/_/g, ' ')}
                </h3>
              </div>
              <span className="deal-pulse" style={{ fontSize: '11px' }}>
                LIVE DISPATCH
              </span>
            </div>

            <div className="timeline-list">
              {order.timeline.map((step, idx) => (
                <div key={idx} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                  <div className="timeline-node">
                    {getStepIcon(step.status)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: step.completed ? '#eef2f7' : '#6b7280' }}>
                      {step.title}
                    </div>
                    {step.time && (
                      <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '3px' }}>
                        {new Date(step.time).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment & Customer Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Customer Box */}
            <div className="checkout-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '16px' }}>
                <Package size={18} color="#39d353" /> Shipment Information
              </h3>
              <div style={{ fontSize: '13px', color: '#9aa5b5', lineHeight: 1.6 }}>
                <div><b style={{ color: '#eef2f7' }}>Recipient:</b> {order.customer.name}</div>
                <div><b style={{ color: '#eef2f7' }}>Phone:</b> {order.customer.phone}</div>
                <div><b style={{ color: '#eef2f7' }}>Delivery Address:</b> {order.customer.address}, {order.customer.city} - {order.customer.pincode}</div>
                <div><b style={{ color: '#eef2f7' }}>Payment:</b> {order.payment.method.toUpperCase()} ({order.payment.status})</div>
                <div><b style={{ color: '#eef2f7' }}>Order Placed:</b> {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>

            {/* Items Box */}
            <div className="checkout-card" style={{ marginBottom: 0 }}>
              <h3 style={{ fontSize: '16px' }}>Items in this Parcel ({order.items.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0e141c', padding: '10px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '20px', background: '#17202b', width: '36px', height: '36px', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                      {item.icon || '📦'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#eef2f7' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#8b949e' }}>Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#39d353' }}>
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #233040', marginTop: '14px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#9aa5b5' }}>Total Invoice Amount:</span>
                <b style={{ color: '#eef2f7' }}>₹{order.pricing.total.toLocaleString('en-IN')}</b>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
