import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" style={{ maxWidth: '580px', padding: '28px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #233040', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={22} fill="#ff4757" color="#ff4757" />
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Your Wishlist ({wishlist.length})</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: '#9aa5b5', display: 'grid' }}>
            <X size={20} />
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8b949e' }}>
            <div style={{ fontSize: '44px', marginBottom: '14px' }}>❤️</div>
            <h4 style={{ color: '#eef2f7', fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>Your wishlist is empty</h4>
            <p style={{ fontSize: '13px' }}>Click the heart icon on any product card to save it for later.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
            {wishlist.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#0e141c', padding: '12px 16px', borderRadius: '12px', border: '1px solid #232d3b' }}>
                <div style={{ fontSize: '26px', background: '#161e29', width: '46px', height: '46px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
                  {p.icon || '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#eef2f7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#39d353' }}>
                    ₹{p.price.toLocaleString('en-IN')}{' '}
                    {p.originalPrice && <span style={{ fontSize: '11px', color: '#687788', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString('en-IN')}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="btn-primary"
                    style={{ padding: '7px 12px', fontSize: '12px' }}
                    onClick={() => {
                      onAddToCart(p);
                      onRemoveFromWishlist(p.id);
                    }}
                  >
                    <ShoppingBag size={14} /> Move to Cart
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(p.id)}
                    style={{ background: 'transparent', color: '#f85149', padding: '6px' }}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
