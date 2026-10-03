const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Mount API
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Aatu Zhatu Full-Stack Store API',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve the original/legacy HTML files for backward compatibility
const legacyDir = path.join(__dirname, '..');
app.use('/legacy', express.static(legacyDir, {
  index: 'landing.html'
}));

// Serve React production build if available
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

// SPA catch-all fallback to client index.html
app.use((req, res) => {
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If client not built yet, redirect or show dev message
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Aatu Zhatu API Server</title>
          <style>
            body { background: #0d1117; color: #eef2f7; font-family: system-ui, sans-serif; padding: 40px; text-align: center; }
            h1 { color: #39d353; }
            .card { background: #151b23; border: 1px solid #303944; border-radius: 12px; max-width: 600px; margin: 30px auto; padding: 24px; text-align: left; }
            a { color: #39d353; text-decoration: none; font-weight: bold; }
            code { background: #202832; padding: 3px 6px; border-radius: 4px; color: #58a6ff; }
          </style>
        </head>
        <body>
          <h1>Aatu Zhatu Server Running</h1>
          <p>The backend REST API is online at port ${PORT}.</p>
          <div class="card">
            <h3>Quick Links:</h3>
            <ul>
              <li><a href="/api/products">/api/products</a> - Products catalog</li>
              <li><a href="/api/admin/stats">/api/admin/stats</a> - Store statistics</li>
              <li><a href="/api/orders">/api/orders</a> - Orders list</li>
              <li><a href="/legacy/landing.html">/legacy/landing.html</a> - Original Prototype</li>
            </ul>
          </div>
        </body>
        </html>
      `);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error occurred.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Aatu Zhatu Server running on http://localhost:${PORT}`);
    console.log(`📦 REST API: http://localhost:${PORT}/api/products`);
    console.log(`📜 Legacy Prototype: http://localhost:${PORT}/legacy/landing.html`);
    console.log(`===============================================`);
  });
}

module.exports = app;
