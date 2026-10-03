import React, { useState } from 'react';
import { X, Star, Check, ShoppingBag, ShieldCheck, Truck, MessageSquare } from 'lucide-react';

export default function ProductQuickView({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onReviewAdded
}) {
  const [qty, setQty] = useState(1);
  const [userName, setUserName] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState(null);

  if (!product) return null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setIsSubmittingReview(true);
    setReviewMsg(null);

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userName.trim() || 'Verified Buyer',
          rating: userRating,
          comment: userComment.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setReviewMsg({ type: 'success', text: 'Thank you! Your review has been published.' });
        setUserComment('');
        setUserName('');
        if (onReviewAdded) onReviewAdded(data.product);
      } else {
        setReviewMsg({ type: 'error', text: data.error || 'Failed to submit review' });
      }
    } catch (err) {
      setReviewMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: '#1f2937',
            border: '1px solid #374151',
            color: '#9ca3af',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            zIndex: 10
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', padding: '30px' }}>
          {/* Left Column: Image & Highlights */}
          <div>
            <div style={{
              background: '#0d131a',
              border: '1px solid #243040',
              borderRadius: '16px',
              height: '340px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '90px' }}>{product.icon}</span>
              )}
              {product.badge && (
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(15, 21, 29, 0.85)',
                  color: '#39d353',
                  border: '1px solid #39d353',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 800
                }}>
                  {product.badge}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '18px', color: '#9aa5b5', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={15} color="#39d353" /> Dispatched in 24h
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} color="#39d353" /> 1 Year Warranty
              </span>
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ color: '#39d353', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {product.category}
              </span>
              <span style={{ color: '#4b5563' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffc107', fontSize: '13px', fontWeight: 700 }}>
                <Star size={14} fill="#ffc107" />
                <span>{product.rating}</span>
                <span style={{ color: '#687788', fontWeight: 500 }}>({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px' }}>
              {product.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '30px', fontWeight: 900, color: '#eef2f7' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <>
                  <span style={{ color: '#6b7280', fontSize: '16px', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ background: 'rgba(57, 211, 83, 0.15)', color: '#39d353', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            <p style={{ color: '#9aa5b5', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              {product.desc}
            </p>

            {product.features && product.features.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Key Highlights:</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {product.features.map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
                      <Check size={15} color="#39d353" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#9aa5b5' }}>Quantity:</div>
              <div className="cart-qty-ctrl">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}>+</button>
              </div>
              <span style={{ color: product.stock > 0 ? '#39d353' : '#f85149', fontSize: '12px', fontWeight: 700 }}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of stock'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => {
                  onAddToCart(product, qty);
                  onClose();
                }}
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '12px 20px', background: '#222d3b', fontWeight: 700 }}
                onClick={() => {
                  onAddToCart(product, qty);
                  onBuyNow();
                  onClose();
                }}
              >
                Buy Now →
              </button>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div style={{ borderTop: '1px solid #232d3b', padding: '30px', background: '#0e141c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <MessageSquare size={20} color="#39d353" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Customer Reviews &amp; Ratings</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '260px', overflowY: 'auto', paddingRight: '8px' }}>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} style={{ background: '#141b24', border: '1px solid #24303f', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>{rev.user}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ffc107', fontSize: '12px' }}>
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} size={12} fill="#ffc107" />
                        ))}
                      </div>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.4 }}>{rev.comment}</p>
                    {rev.date && <div style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>{rev.date}</div>}
                  </div>
                ))
              ) : (
                <div style={{ color: '#6b7280', fontSize: '13px', fontStyle: 'italic' }}>
                  No customer reviews yet. Be the first to review!
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} style={{ background: '#141b24', border: '1px solid #24303f', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Write a Review</h4>

              {reviewMsg && (
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  marginBottom: '12px',
                  background: reviewMsg.type === 'success' ? 'rgba(57, 211, 83, 0.15)' : 'rgba(248, 81, 73, 0.15)',
                  color: reviewMsg.type === 'success' ? '#39d353' : '#f85149'
                }}>
                  {reviewMsg.text}
                </div>
              )}

              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Rahul S.)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{ width: '100%', background: '#0e141c', border: '1px solid #2a3747', borderRadius: '8px', padding: '8px 10px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#9aa5b5' }}>Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    style={{ background: 'transparent', padding: '2px' }}
                  >
                    <Star
                      size={18}
                      fill={star <= userRating ? '#ffc107' : 'none'}
                      color={star <= userRating ? '#ffc107' : '#4b5563'}
                    />
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <textarea
                  rows="2"
                  placeholder="What did you think of the product?"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  required
                  style={{ width: '100%', background: '#0e141c', border: '1px solid #2a3747', borderRadius: '8px', padding: '8px 10px', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="btn-primary"
                style={{ width: '100%', padding: '8px', fontSize: '13px', justifyContent: 'center' }}
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
