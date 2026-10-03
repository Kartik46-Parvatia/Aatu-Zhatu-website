const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/products
router.get('/products', (req, res) => {
  try {
    const { search, category, sort, minPrice, maxPrice } = req.query;
    const products = db.getProducts({ search, category, sort, minPrice, maxPrice });
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id
router.get('/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    // Also fetch 3 related products in same category
    const related = db.getProducts({ category: product.category })
      .filter(p => p.id !== product.id)
      .slice(0, 3);

    res.json({
      success: true,
      product,
      related
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products/:id/reviews
router.post('/products/:id/reviews', (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, error: 'Rating and comment are required.' });
    }
    const updated = db.addReview(req.params.id, { user, rating, comment });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/coupons/apply
router.post('/coupons/apply', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code.' });
    }
    const result = db.validateCoupon(code, Number(subtotal) || 0);
    if (!result.valid) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders
router.post('/orders', (req, res) => {
  try {
    const { customer, items, pricing, payment } = req.body;

    if (!customer || !customer.name || !customer.email || !customer.address || !customer.pincode) {
      return res.status(400).json({ success: false, error: 'Incomplete delivery customer details.' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: 'Order must contain at least one item.' });
    }

    if (!payment || !payment.method) {
      return res.status(400).json({ success: false, error: 'Payment method is required.' });
    }

    const order = db.createOrder({ customer, items, pricing, payment });
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders
router.get('/orders', (req, res) => {
  try {
    const orders = db.getOrders();
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id
router.get('/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found with provided ID' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/status
router.patch('/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    const order = db.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/stats
router.get('/admin/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/products
router.post('/admin/products', (req, res) => {
  try {
    const { name, price, category, desc, stock, icon, image, badge, features } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, error: 'Product name and price are required.' });
    }
    const newProduct = db.createProduct({ name, price, category, desc, stock, icon, image, badge, features });
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/products/:id
router.put('/admin/products/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/admin/products/:id', (req, res) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
