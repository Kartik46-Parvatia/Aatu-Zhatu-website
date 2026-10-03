const fs = require('fs');
const path = require('path');
const initialProducts = require('./data/products');

const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

const INITIAL_COUPONS = [
  { code: 'AATU20', type: 'percentage', value: 20, maxDiscount: 500, minOrder: 499, description: '20% off on orders above ₹499' },
  { code: 'ZHATU50', type: 'flat', value: 50, minOrder: 299, description: 'Flat ₹50 off on orders above ₹299' },
  { code: 'WELCOME100', type: 'flat', value: 100, minOrder: 699, description: 'Flat ₹100 off on your first big order' },
  { code: 'FREESHIP', type: 'shipping', value: 0, minOrder: 0, description: 'Free Express Shipping' }
];

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialDb = {
      products: initialProducts,
      orders: [
        {
          id: 'AZ-10492',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          customer: {
            name: 'Kartik Parvatia',
            email: 'kartik@example.com',
            phone: '9876543210',
            address: '42 MG Road, Navrangpura',
            city: 'Ahmedabad',
            pincode: '380009'
          },
          items: [
            {
              id: 1,
              name: 'Aatu Smart Watch Pro',
              price: 499,
              qty: 1,
              icon: '⌚',
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
            },
            {
              id: 6,
              name: 'Artisan Ceramic Coffee Mug Set',
              price: 249,
              qty: 2,
              icon: '☕',
              image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
            }
          ],
          pricing: {
            subtotal: 997,
            discount: 50,
            coupon: 'ZHATU50',
            shipping: 0,
            tax: 47,
            total: 994
          },
          payment: {
            method: 'upi',
            status: 'completed',
            transactionId: 'UPI-TXN-9842104'
          },
          status: 'out_for_delivery',
          timeline: [
            { status: 'placed', title: 'Order Placed', time: new Date(Date.now() - 86400000 * 2).toISOString(), completed: true },
            { status: 'processing', title: 'Packed & Quality Checked', time: new Date(Date.now() - 86400000 * 1.5).toISOString(), completed: true },
            { status: 'shipped', title: 'Shipped via Express Logistics', time: new Date(Date.now() - 86400000 * 0.8).toISOString(), completed: true },
            { status: 'out_for_delivery', title: 'Out for Delivery (Courier Agent: Ramesh K.)', time: new Date(Date.now() - 3600000 * 2).toISOString(), completed: true },
            { status: 'delivered', title: 'Delivered', time: null, completed: false }
          ]
        }
      ],
      coupons: INITIAL_COUPONS
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf8');
  }
}

function readDb() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database, resetting:', err);
    ensureDb();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

const Database = {
  getProducts({ search, category, sort, minPrice, maxPrice }) {
    const db = readDb();
    let list = [...db.products];

    if (category && category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    if (minPrice !== undefined && minPrice !== '') {
      list = list.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      list = list.filter(p => p.price <= Number(maxPrice));
    }

    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'reviews') {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  },

  getProductById(id) {
    const db = readDb();
    const pid = Number(id);
    return db.products.find(p => p.id === pid) || null;
  },

  createProduct(data) {
    const db = readDb();
    const newId = db.products.length ? Math.max(...db.products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: data.name,
      slug: (data.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: Number(data.price),
      originalPrice: Number(data.originalPrice || data.price * 1.5),
      category: data.category || 'tech',
      icon: data.icon || '📦',
      image: data.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
      desc: data.desc || '',
      badge: data.badge || 'New',
      rating: 5.0,
      reviewCount: 0,
      stock: Number(data.stock !== undefined ? data.stock : 20),
      features: Array.isArray(data.features) ? data.features : [],
      reviews: []
    };
    db.products.unshift(newProduct);
    writeDb(db);
    return newProduct;
  },

  updateProduct(id, updates) {
    const db = readDb();
    const pid = Number(id);
    const index = db.products.findIndex(p => p.id === pid);
    if (index === -1) return null;

    db.products[index] = {
      ...db.products[index],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : db.products[index].price,
      stock: updates.stock !== undefined ? Number(updates.stock) : db.products[index].stock
    };
    writeDb(db);
    return db.products[index];
  },

  deleteProduct(id) {
    const db = readDb();
    const pid = Number(id);
    const initialLen = db.products.length;
    db.products = db.products.filter(p => p.id !== pid);
    if (db.products.length !== initialLen) {
      writeDb(db);
      return true;
    }
    return false;
  },

  addReview(productId, review) {
    const db = readDb();
    const pid = Number(productId);
    const product = db.products.find(p => p.id === pid);
    if (!product) return null;

    const newReview = {
      id: (product.reviews?.length || 0) + 1,
      user: review.user || 'Verified Buyer',
      rating: Number(review.rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment: review.comment || ''
    };

    if (!product.reviews) product.reviews = [];
    product.reviews.unshift(newReview);
    product.reviewCount = product.reviews.length;
    product.rating = Number((product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1));

    writeDb(db);
    return product;
  },

  validateCoupon(code, subtotal) {
    const db = readDb();
    const cleanCode = (code || '').trim().toUpperCase();
    const coupon = db.coupons.find(c => c.code === cleanCode);

    if (!coupon) {
      return { valid: false, message: 'Invalid promo coupon code.' };
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return { valid: false, message: `Minimum order value of ₹${coupon.minOrder} required for ${coupon.code}.` };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'flat') {
      discount = coupon.value;
    } else if (coupon.type === 'shipping') {
      discount = 0; // handled in shipping logic
    }

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        discount,
        type: coupon.type,
        description: coupon.description
      }
    };
  },

  createOrder(orderInput) {
    const db = readDb();
    const timestamp = Date.now();
    const orderId = `AZ-${Math.floor(10000 + Math.random() * 90000)}`;

    // Decrement stock for purchased items
    for (const item of orderInput.items) {
      const prod = db.products.find(p => p.id === item.id);
      if (prod && prod.stock >= item.qty) {
        prod.stock -= item.qty;
      }
    }

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: orderInput.customer,
      items: orderInput.items,
      pricing: orderInput.pricing,
      payment: {
        method: orderInput.payment.method,
        status: orderInput.payment.method === 'cod' ? 'pending_cod' : 'completed',
        transactionId: orderInput.payment.transactionId || `TXN-${timestamp}`
      },
      status: 'placed',
      timeline: [
        { status: 'placed', title: 'Order Placed & Verified', time: new Date().toISOString(), completed: true },
        { status: 'processing', title: 'Packing at Aatu Zhatu Fulfillment Hub', time: null, completed: false },
        { status: 'shipped', title: 'Dispatched with Courier Partner', time: null, completed: false },
        { status: 'out_for_delivery', title: 'Out for Delivery', time: null, completed: false },
        { status: 'delivered', title: 'Delivered', time: null, completed: false }
      ]
    };

    db.orders.unshift(newOrder);
    writeDb(db);
    return newOrder;
  },

  getOrderById(id) {
    const db = readDb();
    return db.orders.find(o => o.id.toUpperCase() === id.toUpperCase()) || null;
  },

  getOrders() {
    const db = readDb();
    return db.orders;
  },

  updateOrderStatus(orderId, nextStatus) {
    const db = readDb();
    const order = db.orders.find(o => o.id.toUpperCase() === orderId.toUpperCase());
    if (!order) return null;

    order.status = nextStatus;
    const statusOrder = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const targetIdx = statusOrder.indexOf(nextStatus);

    order.timeline = order.timeline.map((step, idx) => {
      if (idx <= targetIdx) {
        return {
          ...step,
          completed: true,
          time: step.time || new Date().toISOString()
        };
      }
      return {
        ...step,
        completed: false,
        time: null
      };
    });

    if (nextStatus === 'delivered' && order.payment.method === 'cod') {
      order.payment.status = 'completed';
    }

    writeDb(db);
    return order;
  },

  getStats() {
    const db = readDb();
    const totalOrders = db.orders.length;
    const totalRevenue = db.orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const totalProducts = db.products.length;
    const lowStockProducts = db.products.filter(p => p.stock < 15);

    const categoryDistribution = db.products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5),
      categoryDistribution,
      recentOrders: db.orders.slice(0, 6)
    };
  }
};

module.exports = Database;
