import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturesStrip from './components/FeaturesStrip';
import ProductCard from './components/ProductCard';
import ProductQuickView from './components/ProductQuickView';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import OrderSuccessModal from './components/OrderSuccessModal';
import OrderTrackerView from './components/OrderTrackerView';
import AdminDashboard from './components/AdminDashboard';
import WishlistModal from './components/WishlistModal';
import Toast from './components/Toast';
import { Search, SlidersHorizontal, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation View: 'home' | 'products' | 'checkout' | 'tracker' | 'admin'
  const [currentView, setCurrentView] = useState('home');

  // Products Data & Fetching
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('az_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted in localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('az_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [trackedOrderId, setTrackedOrderId] = useState('AZ-10492');

  // Coupon & Pricing
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [checkoutPricing, setCheckoutPricing] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('az_cart', JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);

  // Sync Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('az_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      // ignore
    }
  }, [wishlist]);

  // Fetch Products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (sortOption !== 'featured') params.append('sort', sortOption);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      addToast('Could not fetch catalog. Using offline fallback.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortOption]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: quantity,
          icon: product.icon,
          image: product.image
        }];
      }
    });
    addToast(`"${product.name}" added to cart!`, 'success');
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const nextQty = item.qty + delta;
          return nextQty > 0 ? { ...item, qty: nextQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast('Item removed from cart', 'info');
  };

  // Wishlist toggle
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        addToast(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        addToast(`Added "${product.name}" to wishlist ❤️`, 'success');
        return [...prev, product];
      }
    });
  };

  // Direct checkout handler
  const handleProceedToCheckout = (pricing) => {
    setCheckoutPricing(pricing);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Buy Now handler
  const handleBuyNow = () => {
    setIsCartOpen(true);
  };

  // Order placed handler
  const handleOrderCompleted = (order) => {
    setCart([]);
    setAppliedCoupon(null);
    setCompletedOrder(order);
  };

  // Live track switcher
  const handleSwitchToTracker = (orderId) => {
    setTrackedOrderId(orderId);
    setCompletedOrder(null);
    setCurrentView('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="app-root">
      {/* Toast System */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={cartTotalCount}
        wishlistCount={wishlist.length}
        openCartDrawer={() => setIsCartOpen(true)}
        openWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Main View Router */}
      <main>
        {currentView === 'home' && (
          <>
            <Hero
              onExploreClick={() => {
                setCurrentView('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              featuredProduct={products[0]}
              onAddToCart={addToCart}
            />

            <FeaturesStrip />

            {/* Featured Products Section */}
            <section className="section-wrapper">
              <div className="section-head">
                <div>
                  <div className="pill-tag">
                    <Sparkles size={13} /> CURATED DEALS
                  </div>
                  <h2>Popular Right Now</h2>
                  <p>Handpicked bestsellers trending this week with maximum customer satisfaction.</p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentView('products')}
                  style={{ gap: '6px' }}
                >
                  View All ({products.length}) <ArrowRight size={16} />
                </button>
              </div>

              <div className="products-grid">
                {products.slice(0, 4).map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onQuickView={setQuickViewProduct}
                    isWishlisted={wishlist.some(w => w.id === product.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {currentView === 'products' && (
          <section className="section-wrapper" style={{ paddingTop: '30px' }}>
            <div className="section-head">
              <div>
                <div className="pill-tag">
                  EVERYDAY ESSENTIALS CATALOG
                </div>
                <h2>Explore Collection</h2>
                <p>Discover tech gadgets, fashion apparel, and home decor designed for smart lifestyles.</p>
              </div>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="filter-toolbar">
              <div className="category-pills">
                {[
                  { id: 'all', label: 'All Products' },
                  { id: 'tech', label: 'Technology ⌚' },
                  { id: 'fashion', label: 'Fashion 👟' },
                  { id: 'home', label: 'Home & Living 💡' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="search-sort-box">
                <div className="search-input-wrap">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search smart watch, lamp..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="sort-select"
                  aria-label="Sort products by"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9aa5b5' }}>
                <div style={{ fontSize: '32px', marginBottom: '14px' }}>⏳</div>
                <h3>Loading Aatu Zhatu catalog...</h3>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9aa5b5' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3>No products found matching your filters</h3>
                <p style={{ marginTop: '6px', fontSize: '14px' }}>Try searching for a different keyword or reset the category filter.</p>
                <button
                  className="btn-secondary"
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  style={{ marginTop: '18px' }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onQuickView={setQuickViewProduct}
                    isWishlisted={wishlist.some(w => w.id === product.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cart={cart}
            pricing={checkoutPricing || {
              subtotal: cart.reduce((s, i) => s + i.price * i.qty, 0),
              discount: 0,
              coupon: null,
              shipping: 0,
              tax: Math.round(cart.reduce((s, i) => s + i.price * i.qty, 0) * 0.05),
              total: Math.round(cart.reduce((s, i) => s + i.price * i.qty, 0) * 1.05)
            }}
            onBack={() => setCurrentView('products')}
            onOrderComplete={handleOrderCompleted}
            addToast={addToast}
          />
        )}

        {currentView === 'tracker' && (
          <OrderTrackerView
            initialOrderId={trackedOrderId}
            addToast={addToast}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            addToast={addToast}
            onProductMutated={fetchProducts}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #202936',
        background: '#0a0e14',
        padding: '50px 5% 30px',
        marginTop: '80px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <div className="brand-logo" style={{ marginBottom: '12px' }}>
              <div className="brand-badge">AZ</div>
              <div>Aatu<span>Zhatu</span></div>
            </div>
            <p style={{ color: '#8b949e', fontSize: '13px', lineHeight: 1.6, maxWidth: '280px' }}>
              Your one-stop destination for honest quality everyday essentials, gadgetry, apparel, and lifestyle decor.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#eef2f7', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#8b949e' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('home')}>Home</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('products')}>All Products</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('tracker')}>Track Consignment</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('admin')}>Admin Portal</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#eef2f7', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Accepted Payments</h4>
            <div style={{ fontSize: '13px', color: '#8b949e', lineHeight: 1.6 }}>
              <div>📱 UPI (Google Pay, PhonePe, Paytm, BHIM)</div>
              <div>💳 Visa, Mastercard, RuPay &amp; Net Banking</div>
              <div>📦 Cash on Delivery Available Nationwide</div>
              <div style={{ marginTop: '8px', color: '#39d353', fontWeight: 600 }}>🔒 256-Bit SSL End-to-End Encrypted</div>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          borderTop: '1px solid #1a232e',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#6e7a8a',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>© 2026 Aatu Zhatu • Smart Shopping • Simple Life. All rights reserved.</div>
          <div>Engineered with Node.js, Express &amp; React. Designed for performance.</div>
        </div>
      </footer>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeFromCart}
        onCheckout={handleProceedToCheckout}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        addToast={addToast}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(id) => toggleWishlist({ id, name: 'Item' })}
        onAddToCart={addToCart}
      />

      {/* Product Quick View & Reviews Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
          onReviewAdded={(updated) => {
            setQuickViewProduct(updated);
            fetchProducts();
          }}
        />
      )}

      {/* Order Success Confetti Modal */}
      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
          onTrackOrder={handleSwitchToTracker}
          addToast={addToast}
        />
      )}
    </div>
  );
}
