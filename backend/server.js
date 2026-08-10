const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointments.js');
const paymentRoutes = require('./routes/paymentRoutes.js');

dotenv.config();

const app = express();

app.use(cors());

// Payment routes mounted before global json parser for raw body webhook compatibility
app.use('/api/payments', paymentRoutes);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// MongoDB Connect
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });
}).catch(err => {
  console.log('MongoDB connection error, running server on port', PORT, ':', err.message);
  app.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });
});

