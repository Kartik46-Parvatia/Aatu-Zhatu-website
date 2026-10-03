import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Smartphone, Truck, ArrowLeft, CheckCircle2, Lock, QrCode } from 'lucide-react';

export default function CheckoutView({
  cart,
  pricing,
  onBack,
  onOrderComplete,
  addToast
}) {
  // Customer details with modern autocomplete fields
  const [formData, setFormData] = useState({
    name: 'Kartik Parvatia',
    email: 'kartik@example.com',
    phone: '9876543210',
    address: '42 MG Road, Navrangpura',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380009'
  });

  // Payment method selection: 'upi' | 'card' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Card details
  const [cardData, setCardData] = useState({
    number: '',
    name: 'Kartik Parvatia',
    exp: '',
    cvv: ''
  });
  const [cardBrand, setCardBrand] = useState('generic');

  // UPI details
  const [upiId, setUpiId] = useState('');
  const [upiSecondsLeft, setUpiSecondsLeft] = useState(300); // 5 min countdown

  // Submission state
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto PIN code city/state lookup helper for India
  const handlePincodeChange = (pin) => {
    setFormData(prev => ({ ...prev, pincode: pin }));
    if (pin.length === 6) {
      const pinMap = {
        '380001': { city: 'Ahmedabad', state: 'Gujarat' },
        '380009': { city: 'Ahmedabad', state: 'Gujarat' },
        '380015': { city: 'Ahmedabad', state: 'Gujarat' },
        '110001': { city: 'New Delhi', state: 'Delhi' },
        '400001': { city: 'Mumbai', state: 'Maharashtra' },
        '560001': { city: 'Bengaluru', state: 'Karnataka' },
        '600001': { city: 'Chennai', state: 'Tamil Nadu' },
        '700001': { city: 'Kolkata', state: 'West Bengal' },
        '500001': { city: 'Hyderabad', state: 'Telangana' }
      };
      if (pinMap[pin]) {
        setFormData(prev => ({
          ...prev,
          city: pinMap[pin].city,
          state: pinMap[pin].state
        }));
      }
    }
  };

  // Card number input formatting and brand detection
  const handleCardNumberChange = (raw) => {
    const cleaned = raw.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData(prev => ({ ...prev, number: formatted }));

    if (cleaned.startsWith('4')) setCardBrand('Visa');
    else if (/^(5[1-5]|2[2-7])/.test(cleaned)) setCardBrand('Mastercard');
    else if (/^(60|65|81|82)/.test(cleaned)) setCardBrand('RuPay');
    else if (/^(34|37)/.test(cleaned)) setCardBrand('Amex');
    else setCardBrand('generic');
  };

  // Card expiry formatting MM/YY
  const handleExpiryChange = (raw) => {
    let clean = raw.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 2) {
      clean = clean.slice(0, 2) + '/' + clean.slice(2);
    }
    setCardData(prev => ({ ...prev, exp: clean }));
  };

  // Countdown timer for dynamic UPI QR code
  useEffect(() => {
    if (paymentMethod !== 'upi') return;
    const timer = setInterval(() => {
      setUpiSecondsLeft(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentMethod]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.address || !formData.pincode) {
      addToast('Please complete all delivery fields.', 'error');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardData.number || !cardData.exp || !cardData.cvv) {
        addToast('Please fill all card details.', 'error');
        return;
      }
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          icon: item.icon,
          image: item.image
        })),
        pricing: {
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          coupon: pricing.coupon,
          shipping: pricing.shipping,
          tax: pricing.tax,
          total: pricing.total
        },
        payment: {
          method: paymentMethod,
          details: paymentMethod === 'card'
            ? { brand: cardBrand, last4: cardData.number.slice(-4) }
            : paymentMethod === 'upi'
            ? { upiId: upiId || 'az-qr-pay@upi' }
            : { terms: 'Cash on Doorstep' }
        }
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (data.success && data.order) {
        onOrderComplete(data.order);
      } else {
        addToast(data.error || 'Failed to place order', 'error');
      }
    } catch (err) {
      addToast('Checkout error occurred. Please check network connection.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="section-wrapper" style={{ paddingTop: '30px' }}>
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#9aa5b5',
          background: 'transparent',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: 600
        }}
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div className="section-head" style={{ marginBottom: '24px' }}>
        <div>
          <div className="pill-tag" style={{ marginBottom: '8px' }}>
            <Lock size={12} /> 256-BIT SSL SECURE CHECKOUT
          </div>
          <h2>Complete your order</h2>
          <p>Confirm shipping details and select your preferred payment gateway.</p>
        </div>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="checkout-layout">
        {/* Left Column: Delivery & Payment Details */}
        <div>
          {/* Step 1: Delivery Address */}
          <div className="checkout-card">
            <h3>
              <Truck size={20} color="#39d353" />
              1. Delivery Address
            </h3>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="e.g. Kartik Parvatia"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="kartik@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Street Address / House / Flat</label>
              <textarea
                id="address"
                name="address"
                autoComplete="street-address"
                rows="2"
                required
                placeholder="Flat 402, Lotus Residency, Near City Center"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  placeholder="Ahmedabad"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pincode">PIN Code (6 digits)</label>
                <input
                  id="pincode"
                  name="postal-code"
                  type="text"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  required
                  placeholder="380009"
                  value={formData.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="checkout-card">
            <h3>
              <ShieldCheck size={20} color="#39d353" />
              2. Payment Method
            </h3>

            <div className="payment-methods-grid">
              <div
                className={`payment-method-box ${paymentMethod === 'upi' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <Smartphone size={24} color={paymentMethod === 'upi' ? '#39d353' : '#9aa5b5'} />
                <b>Instant UPI / QR</b>
                <span style={{ fontSize: '11px', color: '#39d353' }}>Zero Fee</span>
              </div>

              <div
                className={`payment-method-box ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={24} color={paymentMethod === 'card' ? '#39d353' : '#9aa5b5'} />
                <b>Debit / Credit Card</b>
                <span style={{ fontSize: '11px', color: '#9aa5b5' }}>Visa, MC, RuPay</span>
              </div>

              <div
                className={`payment-method-box ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <Truck size={24} color={paymentMethod === 'cod' ? '#39d353' : '#9aa5b5'} />
                <b>Cash on Delivery</b>
                <span style={{ fontSize: '11px', color: '#9aa5b5' }}>Pay at Doorstep</span>
              </div>
            </div>

            {/* UPI Dynamic Screen */}
            {paymentMethod === 'upi' && (
              <div className="upi-box-wrapper">
                <div style={{ fontSize: '13px', color: '#9aa5b5', marginBottom: '14px' }}>
                  Scan dynamic QR with any UPI app (GPay, PhonePe, Paytm, BHIM)
                </div>

                <div className="upi-qr-frame">
                  {/* Dynamic SVG UPI QR Code representation */}
                  <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ display: 'block' }}>
                    <rect width="120" height="120" fill="white" />
                    {/* Top-left marker */}
                    <rect x="8" y="8" width="30" height="30" fill="black" />
                    <rect x="14" y="14" width="18" height="18" fill="white" />
                    <rect x="18" y="18" width="10" height="10" fill="#0d1117" />
                    {/* Top-right marker */}
                    <rect x="82" y="8" width="30" height="30" fill="black" />
                    <rect x="88" y="14" width="18" height="18" fill="white" />
                    <rect x="92" y="18" width="10" height="10" fill="#0d1117" />
                    {/* Bottom-left marker */}
                    <rect x="8" y="82" width="30" height="30" fill="black" />
                    <rect x="14" y="88" width="18" height="18" fill="white" />
                    <rect x="18" y="92" width="10" height="10" fill="#0d1117" />
                    {/* Data matrix dots */}
                    <rect x="46" y="12" width="8" height="8" fill="black" />
                    <rect x="58" y="16" width="8" height="8" fill="black" />
                    <rect x="68" y="24" width="8" height="8" fill="black" />
                    <rect x="46" y="44" width="28" height="28" fill="#39d353" rx="4" />
                    <text x="60" y="63" fontSize="12" fontWeight="900" fill="#071009" textAnchor="middle">AZ</text>
                    <rect x="14" y="48" width="8" height="8" fill="black" />
                    <rect x="28" y="60" width="8" height="8" fill="black" />
                    <rect x="82" y="48" width="8" height="8" fill="black" />
                    <rect x="96" y="64" width="8" height="8" fill="black" />
                    <rect x="48" y="82" width="10" height="10" fill="black" />
                    <rect x="68" y="94" width="12" height="12" fill="black" />
                    <rect x="88" y="86" width="10" height="10" fill="black" />
                  </svg>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1c2533', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', color: '#ffc107', fontWeight: 700, marginBottom: '14px' }}>
                  ⏳ QR expires in: {formatTimer(upiSecondsLeft)}
                </div>

                <div style={{ maxWidth: '360px', margin: '0 auto', textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', color: '#9aa5b5', display: 'block', marginBottom: '4px' }}>
                    Or Enter UPI VPA (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="kartik@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{ width: '100%', background: '#161e29', border: '1px solid #2a3748', borderRadius: '8px', padding: '10px', fontSize: '13px' }}
                  />
                </div>
              </div>
            )}

            {/* Credit / Debit Card Fields (Modern Web Guidance Compliant) */}
            {paymentMethod === 'card' && (
              <div style={{ background: '#111721', border: '1px solid #24303f', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#eef2f7' }}>Enter Card Details</span>
                  {cardBrand !== 'generic' && (
                    <span style={{ background: '#1d2735', color: '#39d353', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                      {cardBrand}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="cc-number">Card Number</label>
                  <input
                    id="cc-number"
                    name="cc-number"
                    type="text"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    maxLength="19"
                    required={paymentMethod === 'card'}
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cc-name">Name on Card</label>
                  <input
                    id="cc-name"
                    name="cc-name"
                    type="text"
                    autoComplete="cc-name"
                    maxLength="50"
                    required={paymentMethod === 'card'}
                    placeholder="KARTIK PARVATIA"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <span id="exp-hint" className="input-format-hint">Format: MM/YY</span>
                    <label htmlFor="cc-exp">Expiry Date</label>
                    <input
                      id="cc-exp"
                      name="cc-exp"
                      type="text"
                      autoComplete="cc-exp"
                      aria-describedby="exp-hint"
                      maxLength="5"
                      required={paymentMethod === 'card'}
                      placeholder="08/29"
                      value={cardData.exp}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <span className="input-format-hint">3-4 digits on back</span>
                    <label htmlFor="cc-csc">CVV / Security Code</label>
                    <input
                      id="cc-csc"
                      name="cc-csc"
                      type="password"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      maxLength="4"
                      required={paymentMethod === 'card'}
                      placeholder="•••"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COD Explanation */}
            {paymentMethod === 'cod' && (
              <div style={{ background: '#111721', border: '1px solid #24303f', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <CheckCircle2 size={24} color="#39d353" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '13px', color: '#9aa5b5', lineHeight: 1.5 }}>
                  <b style={{ color: '#eef2f7' }}>Pay via Cash on Delivery</b><br />
                  Keep ₹{pricing.total.toLocaleString('en-IN')} ready in cash at the time of delivery. You can inspect the package before paying the delivery executive.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Action */}
        <div>
          <div className="checkout-card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ borderBottom: '1px solid #253140', paddingBottom: '14px' }}>
              Order Review ({cart.length} items)
            </h3>

            <div style={{ maxHeight: '240px', overflowY: 'auto', margin: '14px 0', paddingRight: '6px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #1a232f' }}>
                  <div style={{ fontSize: '22px', background: '#141c26', width: '38px', height: '38px', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
                    {item.icon || '📦'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9aa5b5' }}>
                      Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#eef2f7' }}>
                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', borderTop: '1px solid #253140', paddingTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa5b5' }}>
                <span>Subtotal</span>
                <span>₹{pricing.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {pricing.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#39d353' }}>
                  <span>Discount ({pricing.coupon || 'PROMO'})</span>
                  <span>−₹{pricing.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa5b5' }}>
                <span>Shipping</span>
                <span>{pricing.shipping === 0 ? <b style={{ color: '#39d353' }}>FREE</b> : `₹${pricing.shipping}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa5b5' }}>
                <span>Estimated Tax (5%)</span>
                <span>₹{pricing.tax.toLocaleString('en-IN')}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 900,
                color: '#eef2f7',
                paddingTop: '12px',
                marginTop: '6px',
                borderTop: '1px solid #2b394a'
              }}>
                <span>Total Payable</span>
                <span style={{ color: '#39d353' }}>₹{pricing.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 800,
                justifyContent: 'center',
                marginTop: '22px'
              }}
            >
              {isProcessing
                ? 'Processing Secure Payment...'
                : paymentMethod === 'cod'
                ? `Confirm COD Order (₹${pricing.total.toLocaleString('en-IN')}) →`
                : `Pay ₹${pricing.total.toLocaleString('en-IN')} Now →`}
            </button>

            <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', color: '#6a7888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Lock size={12} color="#39d353" /> Encrypted &amp; Protected by Aatu Zhatu Payments
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
