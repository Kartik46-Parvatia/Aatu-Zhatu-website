import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export default function FeaturesStrip() {
  const features = [
    {
      icon: <Truck size={22} />,
      title: 'Fast & Reliable Shipping',
      desc: 'Swift dispatch with doorstep delivery across 19,000+ Indian PIN codes.'
    },
    {
      icon: <ShieldCheck size={22} />,
      title: '100% Secure Checkout',
      desc: 'Bank-grade encryption supporting UPI, Cards, Net Banking & COD.'
    },
    {
      icon: <RotateCcw size={22} />,
      title: 'Easy 7-Day Returns',
      desc: 'Hassle-free replacement or quick refund if anything is amiss.'
    },
    {
      icon: <Headphones size={22} />,
      title: 'Dedicated Support',
      desc: 'Friendly customer assistance for tracking, orders, and inquiries.'
    }
  ];

  return (
    <section className="features-strip" id="features">
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-box">
            <div className="feature-icon-box">{f.icon}</div>
            <div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
