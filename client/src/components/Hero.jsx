import React from 'react';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, CheckCircle } from 'lucide-react';

export default function Hero({ onExploreClick, featuredProduct, onAddToCart }) {
  return (
    <section className="hero-container">
      <div className="hero-glow-blob"></div>

      <div className="hero-text-content">
        <div className="pill-tag">
          <Sparkles size={14} /> Smart Shopping • Simple Life
        </div>

        <h1 className="hero-title">
          Everything you need,
          <span>all in one place.</span>
        </h1>

        <p className="hero-sub">
          Aatu Zhatu brings you daily essentials, premium lifestyle gadgets, trendy fashion, and home aesthetics — with ultra-fast express delivery and honest Indian pricing.
        </p>

        <div className="hero-cta-group">
          <button className="btn-primary" onClick={onExploreClick} style={{ padding: '14px 28px', fontSize: '15px' }}>
            Explore Catalog <ArrowRight size={18} />
          </button>
          <a href="#features" className="btn-secondary" style={{ padding: '14px 24px', fontSize: '15px' }}>
            Why Aatu Zhatu?
          </a>
        </div>

        <div className="hero-feature-pill">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={15} color="#39d353" /> Verified Genuine
          </span>
          <span style={{ color: '#303c4c' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={15} color="#39d353" /> Instant UPI &amp; COD
          </span>
          <span style={{ color: '#303c4c' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={15} color="#39d353" /> 7-Day Hassle-Free Returns
          </span>
        </div>
      </div>

      <div className="hero-card-column">
        <div className="hero-interactive-card">
          <div className="card-top-row">
            <span className="deal-pulse">LIVE DEAL OF THE DAY</span>
            <span style={{ fontSize: '12px', color: '#ffc107', fontWeight: 700 }}>★ 4.9 Rating</span>
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <div style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #39d353, #1f8c35)',
              color: '#071009',
              display: 'grid',
              placeItems: 'center',
              fontSize: '44px',
              fontWeight: 900,
              margin: '0 auto 16px',
              boxShadow: '0 10px 30px rgba(57, 211, 83, 0.4)'
            }}>
              AZ
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Fresh Curations</h3>
            <p style={{ color: '#9aa5b5', fontSize: '14px', maxWidth: '280px', margin: '0 auto 20px' }}>
              Handpicked everyday quality products at prices you'll love.
            </p>

            {featuredProduct && (
              <div style={{
                background: '#0d131a',
                border: '1px solid #232d3a',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '28px', background: '#17202b', width: '46px', height: '46px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
                  {featuredProduct.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{featuredProduct.name}</div>
                  <div style={{ color: '#39d353', fontWeight: 800, fontSize: '15px' }}>
                    ₹{featuredProduct.price.toLocaleString('en-IN')}{' '}
                    <span style={{ color: '#687788', fontSize: '12px', textDecoration: 'line-through', fontWeight: 500 }}>
                      ₹{featuredProduct.originalPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '7px 12px', fontSize: '12px' }}
                  onClick={() => onAddToCart(featuredProduct)}
                >
                  + Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
