import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  appliedCoupon,
  setAppliedCoupon,
  addToast
}) {
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const FREE_SHIPPING_THRESHOLD = 499;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.type === 'shipping';
  const shippingFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 49);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discount) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = appliedCoupon.discount;
    }
  }

  const taxAmount = Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal })
      });
      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon(data.coupon);
        addToast(`Coupon "${data.coupon.code}" applied successfully!`, 'success');
        setCouponCode('');
      } else {
        addToast(data.message || 'Invalid coupon code', 'error');
      }
    } catch (err) {
      addToast('Error validating coupon. Try again.', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#39d353" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
              Shopping Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#8b949e', display: 'grid' }}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cart.length > 0 && (
          <div style={{ background: '#161e28', padding: '14px 24px', borderBottom: '1px solid #232f3e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              <span>
                {isFreeShipping
                  ? '🎉 Hooray! You unlocked FREE Express Delivery!'
                  : `Add ₹${amountNeededForFreeShipping} more to unlock FREE Delivery`}
              </span>
              <span style={{ color: '#39d353' }}>{shippingProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#253242', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${shippingProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #2bb744, #39d353)',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        )}

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8b949e' }}>
              <div style={{ fontSize: '50px', marginBottom: '16px' }}>🛍️</div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#eef2f7', marginBottom: '8px' }}>
                Your cart is empty
              </h4>
              <p style={{ fontSize: '13px', maxWidth: '260px', margin: '0 auto 20px' }}>
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                className="btn-primary"
                onClick={onClose}
                style={{ padding: '10px 20px', fontSize: '13px' }}
              >
                Browse Products →
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  ) : (
                    <div className="cart-item-img">{item.icon || '📦'}</div>
                  )}

                  <div className="cart-item-details">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={{ background: 'transparent', color: '#f85149', padding: '2px' }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="cart-item-price">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}{' '}
                      {item.qty > 1 && (
                        <span style={{ fontSize: '11px', color: '#687788', fontWeight: 500 }}>
                          (₹{item.price} each)
                        </span>
                      )}
                    </div>

                    <div className="cart-qty-ctrl">
                      <button onClick={() => onUpdateQty(item.id, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Code Form */}
            {appliedCoupon ? (
              <div style={{
                background: 'rgba(57, 211, 83, 0.1)',
                border: '1px solid rgba(57, 211, 83, 0.3)',
                borderRadius: '8px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <Tag size={14} color="#39d353" />
                  <span style={{ fontWeight: 800, color: '#39d353' }}>{appliedCoupon.code}</span>
                  <span style={{ color: '#9aa5b5' }}>applied!</span>
                </div>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  style={{ background: 'transparent', color: '#f85149', fontSize: '11px', fontWeight: 700 }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="coupon-box">
                <input
                  type="text"
                  placeholder="Coupon (e.g. AATU20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '13px' }}
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa5b5' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#39d353' }}>
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>−₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa5b5' }}>
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <b style={{ color: '#39d353' }}>FREE</b> : `₹${shippingFee}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa5b5' }}>
                <span>GST (5%)</span>
                <span>₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '17px',
                fontWeight: 800,
                color: '#eef2f7',
                paddingTop: '10px',
                borderTop: '1px solid #253140'
              }}>
                <span>Total Amount</span>
                <span style={{ color: '#39d353' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center' }}
              onClick={() => {
                onClose();
                onCheckout({
                  subtotal,
                  discount: discountAmount,
                  coupon: appliedCoupon?.code || null,
                  shipping: shippingFee,
                  tax: taxAmount,
                  total: grandTotal
                });
              }}
            >
              Proceed to Checkout ({cart.length} items) <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
