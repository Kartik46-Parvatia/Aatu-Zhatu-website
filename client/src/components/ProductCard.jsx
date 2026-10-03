import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, AlertTriangle } from 'lucide-react';

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  isWishlisted,
  onToggleWishlist
}) {
  const [imgError, setImgError] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="product-card">
      <div className="product-card-thumb">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="thumb-fallback-icon">{product.icon || '📦'}</span>
        )}

        {product.badge && <span className="badge-tag">{product.badge}</span>}

        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? '#ff4757' : 'none'} color={isWishlisted ? '#ff4757' : '#9aa5b5'} />
        </button>
      </div>

      <div className="product-card-content">
        <div className="product-category-row">
          <span className="product-category-text">{product.category}</span>
          <div className="product-rating" title={`${product.rating} stars out of ${product.reviewCount} reviews`}>
            <Star size={13} fill="#ffc107" />
            <span>{product.rating}</span>
            <span style={{ color: '#687788', fontSize: '11px' }}>({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="product-title" title={product.name}>{product.name}</h3>
        <p className="product-desc">{product.desc}</p>

        {product.stock < 15 && product.stock > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#e3b341', fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>
            <AlertTriangle size={12} /> Only {product.stock} items left in stock!
          </div>
        )}

        <div className="product-footer">
          <div className="price-wrap">
            <div className="current-price">₹{product.price.toLocaleString('en-IN')}</div>
            {product.originalPrice && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span style={{ color: '#39d353', fontSize: '11px', fontWeight: 700 }}>{discountPercent}% OFF</span>
              </div>
            )}
          </div>

          <div className="card-actions-row">
            <button
              className="btn-quick-view"
              onClick={() => onQuickView(product)}
              title="Quick view specifications & reviews"
            >
              <Eye size={16} />
            </button>
            <button
              className="btn-add-cart"
              onClick={() => onAddToCart(product)}
              title="Add product to shopping cart"
            >
              <ShoppingBag size={15} /> Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
