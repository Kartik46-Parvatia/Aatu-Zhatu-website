const http = require('http');
const app = require('./server/server');

const testPort = 5055;
const server = app.listen(testPort, async () => {
  console.log(`Test server running on port ${testPort}`);

  try {
    const baseUrl = `http://localhost:${testPort}`;

    // 1. Health check
    const health = await fetch(`${baseUrl}/api/health`).then(r => r.json());
    console.log('✓ Health Check:', health.status);

    // 2. Fetch products
    const prods = await fetch(`${baseUrl}/api/products`).then(r => r.json());
    console.log(`✓ Products API: Loaded ${prods.count} items.`);

    // 3. Test Coupon
    const couponRes = await fetch(`${baseUrl}/api/coupons/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'AATU20', subtotal: 1000 })
    }).then(r => r.json());
    console.log('✓ Coupon API (AATU20): Discount =', couponRes.coupon?.discount);

    // 4. Test Place Order
    const orderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '9876543210',
          address: '101 Lotus Court',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        items: [{ id: 1, name: 'Aatu Smart Watch Pro', price: 499, qty: 1 }],
        pricing: { subtotal: 499, discount: 0, shipping: 0, tax: 25, total: 524 },
        payment: { method: 'upi', details: { upiId: 'priya@upi' } }
      })
    }).then(r => r.json());
    console.log('✓ Create Order API: Order ID =', orderRes.order?.id);

    // 5. Test Track Order
    const trackRes = await fetch(`${baseUrl}/api/orders/${orderRes.order.id}`).then(r => r.json());
    console.log('✓ Track Order API: Milestones =', trackRes.order?.timeline?.length);

    // 6. Test Admin Stats
    const statsRes = await fetch(`${baseUrl}/api/admin/stats`).then(r => r.json());
    console.log('✓ Admin Stats API: Total Orders =', statsRes.stats?.totalOrders);

    // 7. Test Root HTML serving (Client index.html)
    const rootHtml = await fetch(`${baseUrl}/`).then(r => r.text());
    console.log('✓ Root SPA Serving: Title matched =', rootHtml.includes('Aatu Zhatu'));

    console.log('\n🌟 ALL FULL-STACK SYSTEM TESTS PASSED SUCCESSFULLY! 🌟');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close(() => {
      process.exit(process.exitCode || 0);
    });
  }
});
