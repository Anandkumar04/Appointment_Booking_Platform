const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Resolve dependencies from backend/frontend when root node_modules is absent
[path.join(__dirname, 'backend', 'node_modules'), path.join(__dirname, 'frontend', 'node_modules')]
  .forEach((modulesPath) => {
    if (!module.paths.includes(modulesPath)) {
      module.paths.unshift(modulesPath);
    }
  });

// Always load .env from project root (works the same in Cursor, VS Code, and terminal)
dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set in root .env — Stripe payments will be disabled');
} else {
  console.log('Stripe configured successfully');
}

const authRoutes = require('./backend/routes/authRoutes');
const appointmentRoutes = require('./backend/routes/appointments');
const paymentRoutes = require('./backend/routes/paymentRoutes');

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());

  // Payment routes mounted before global express.json to allow raw body parsing in /api/payments/webhook
  app.use('/api/payments', paymentRoutes);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to MongoDB if MONGO_URI is set
  mongoose.set('bufferCommands', false);
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB connected successfully'))
      .catch(err => console.warn('MongoDB connection error:', err.message));
  } else {
    console.warn('MONGO_URI not set — database features will operate in in-memory fallback mode');
  }

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'connected', dbState: mongoose.connection.readyState });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/appointments', appointmentRoutes);

  // Vite Middleware in dev mode, Static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = require('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.join(__dirname, 'frontend'),
      envDir: __dirname
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'frontend', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
