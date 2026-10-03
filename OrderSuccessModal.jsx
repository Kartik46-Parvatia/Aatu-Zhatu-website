import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Printer, ArrowRight, Copy } from 'lucide-react';

export default function OrderSuccessModal({
  order,
  onClose,
  onTrackOrder,
  addToast
}) {
  if (!order) return null;

  useEffect(() => {
    // Fire celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    if (addToast) addToast(`Order ID ${order.id} copied to clipboard!`, 'success');
  };

  const deliveryEst = new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content" style={{ maxWidth: '620px', padding: '36px', textAlign: 'center' }}>
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          background: 'rgba(57, 211, 83, 0.15)',
          color: '#39d353',
          display: 'grid',
          placeItems: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 30px rgba(57, 211, 83, 0.3)'
        }}>
          <CheckCircle2 size={44} />
        </div>

        <span className="pill-tag" style={{ marginBottom: '10px' }}>
          ORDER CONFIRMED &amp; PROCESSING
        </span>

        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
          Thank you for shopping with Aatu Zhatu!
        </h2>

        <p style={{ color: '#9aa5b5', fontSize: '14px', maxWidth: '440px', margin: '0 auto 24px' }}>
          We've received your order and our logistics team is already preparing your package for dispatch.
        </p>

        {/* Order ID Box */}
        <div style={{
          background: '#0d131a',
          border: '1px solid #232f3e',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#687788', fontWeight: 700, textTransform: 'uppercase' }}>
              Your Tracking Order ID
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#39d353' }}>
              {order.id}
            </div>
          </div>
          <button
            onClick={handleCopyOrderId}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', gap: '4px' }}
            title="Copy ID to clipboard"
          >
            <Copy size={13} /> Copy ID
          </button>
        </div>

        {/* Details Card */}
        <div style={{
          background: '#151d28',
          border: '1px solid #253344',
          borderRadius: '14px',
          padding: '18px',
          textAlign: 'left',
          marginBottom: '26px',
          fontSize: '13px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <span style={{ color: '#6b798a', display: 'block', fontSize: '11px', fontWeight: 700 }}>DELIVERING TO</span>
              <b style={{ color: '#eef2f7' }}>{order.customer.name}</b>
              <div style={{ color: '#9aa5b5', fontSize: '12px', marginTop: '2px' }}>
                {order.customer.address}, {order.customer.city} - {order.customer.pincode}
              </div>
            </div>

            <div>
              <span style={{ color: '#6b798a', display: 'block', fontSize: '11px', fontWeight: 700 }}>ESTIMATED ARRIVAL</span>
              <b style={{ color: '#39d353' }}>By {deliveryEst}</b>
              <div style={{ color: '#9aa5b5', fontSize: '12px', marginTop: '2px' }}>
                Method: {order.payment.method.toUpperCase()} ({order.payment.status})
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #233040', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9aa5b5' }}>Total Amount Paid / Payable:</span>
            <b style={{ fontSize: '16px', color: '#eef2f7' }}>₹{order.pricing.total.toLocaleString('en-IN')}</b>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '14px' }}
            onClick={() => onTrackOrder(order.id)}
          >
            <Package size={17} /> Live Track Order
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '12px 20px', fontSize: '14px' }}
            onClick={() => window.print()}
          >
            <Printer size={17} /> Print Receipt
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '12px 20px', fontSize: '14px' }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
