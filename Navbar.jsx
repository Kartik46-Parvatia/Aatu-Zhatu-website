import React from 'react';
import { ShoppingBag, Heart, Search, ShieldCheck, Truck, Package, LayoutDashboard } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  cartCount,
  wishlistCount,
  openCartDrawer,
  openWishlist
}) {
  return (
    <header className="header-wrapper">
      <div className="top-ticker">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '1400px', margin: '0 auto', width: '100%', justifyContent: 'space-between' }}>
          <span>⚡ <b>FLASH SALE:</b> Use code <code style={{ color: '#39d353', background: '#1c2532', padding: '1px 6px', borderRadius: '4px' }}>AATU20</code> for 20% OFF!</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span><Truck size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> Free Delivery &gt; ₹499</span>
            <span><ShieldCheck size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> 100% Genuine</span>
          </span>
        </div>
      </div>

      <div className="header-main">
        <div
          className="brand-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => setCurrentView('home')}
        >
          <div className="brand-badge">AZ</div>
          <div>Aatu<span>Zhatu</span></div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            Home
          </button>
          <button
            className={`nav-item ${currentView === 'products' ? 'active' : ''}`}
            onClick={() => setCurrentView('products')}
          >
            Products
          </button>
          <button
            className={`nav-item ${currentView === 'tracker' ? 'active' : ''}`}
            onClick={() => setCurrentView('tracker')}
          >
            <Package size={16} /> Track Order
          </button>
          <button
            className={`nav-item ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView('admin')}
          >
            <LayoutDashboard size={16} /> Admin Hub
          </button>
        </nav>

        <div className="nav-actions">
          <button
            className="btn-icon"
            onClick={openWishlist}
            title="Your Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && <span className="badge-counter">{wishlistCount}</span>}
          </button>

          <button
            className="btn-icon"
            onClick={openCartDrawer}
            title="Your Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="badge-counter">{cartCount}</span>}
          </button>

          <button
            className="btn-primary"
            onClick={() => setCurrentView('products')}
            style={{ display: 'none' }}
          >
            Shop Now
          </button>
        </div>
      </div>
    </header>
  );
}
