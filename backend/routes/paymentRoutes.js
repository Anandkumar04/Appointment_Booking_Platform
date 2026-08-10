const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
let inMemoryAppointments = [];

try {
  const store = require('../store/inMemoryStore');
  if (store && store.inMemoryAppointments) {
    inMemoryAppointments = store.inMemoryAppointments;
  }
} catch (e) {
  // Safe fallback if inMemoryStore.js is missing
}

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey);
}

// Backend Source of Truth Service Catalog & Pricing (in INR)
const SERVICES_CATALOG = {
  'Haircut & Styling': 300,
  'Massage Therapy': 999,
  'Dental Checkup': 500,
  'Personal Training': 800,
  'Facial Treatment': 1200,
  'Eye Examination': 350,
  'Yoga Classes': 600,
  'Car Service': 2500,
  'Photography Session': 3000
};

/**
 * Validate and get price in INR from catalog or price string
 */
function getValidatedPriceInINR(serviceName, frontendPrice) {
  if (SERVICES_CATALOG[serviceName]) {
    return SERVICES_CATALOG[serviceName];
  }
  // Fallback parsing if service is custom or dynamically added
  if (typeof frontendPrice === 'number' && frontendPrice > 0) {
    return Math.round(frontendPrice);
  }
  if (typeof frontendPrice === 'string') {
    const parsed = parseInt(frontendPrice.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 300; // Default safe fallback
}

// ==========================================
// 1. Stripe Webhook Endpoint (Raw Body)
// MUST come before express.json() router middleware
// ==========================================
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripe();

  if (!stripe) {
    console.error('Webhook Error: Stripe is not initialized (missing STRIPE_SECRET_KEY)');
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  let event;

  if (webhookSecret) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook Signature Verification Failed: ${err.message}`);
      return res.status(400).send(`Webhook Signature Error: ${err.message}`);
    }
  } else {
    console.warn('STRIPE_WEBHOOK_SECRET is not set in environment. Parsing event directly (Development/Local Testing mode)');
    try {
      event = JSON.parse(req.body.toString());
    } catch (err) {
      return res.status(400).send(`Webhook Body Parsing Error: ${err.message}`);
    }
  }

  // Handle Stripe Event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const appointmentId = session.metadata ? session.metadata.appointmentId : null;

    try {
      await handlePaymentSuccess(appointmentId, session);
    } catch (err) {
      console.error('Error handling checkout.session.completed:', err);
      return res.status(500).json({ error: 'Failed to process payment completion' });
    }
  }

  res.json({ received: true });
});

/**
 * Helper function to handle payment success idempotently
 */
async function handlePaymentSuccess(appointmentId, session) {
  const transactionId = session.payment_intent || session.id;
  const amountPaidInUnits = session.amount_total ? session.amount_total / 100 : null;
  const paidAmountStr = amountPaidInUnits ? `₹${amountPaidInUnits}` : '₹300';

  if (mongoose.connection.readyState === 1) {
    let appointment = null;
    if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
      appointment = await Appointment.findById(appointmentId);
    }
    if (!appointment) {
      appointment = await Appointment.findOne({ transactionId: session.id });
    }

    if (appointment) {
      // Idempotency check: avoid double processing if already paid
      if (appointment.paymentStatus === 'paid') {
        console.log(`Appointment ${appointment._id} is already marked as paid.`);
        return;
      }

      appointment.paymentStatus = 'paid';
      appointment.status = 'confirmed';
      appointment.paymentMethod = 'stripe';
      appointment.transactionId = transactionId;
      appointment.paidAmount = paidAmountStr;
      await appointment.save();
      console.log(`Appointment ${appointment._id} successfully marked as PAID & CONFIRMED in MongoDB.`);
    } else {
      console.warn(`Webhook: Appointment not found for ID: ${appointmentId} or Session ID: ${session.id}`);
    }
  } else {
    // In-memory store fallback
    const app = inMemoryAppointments.find(a => a._id === appointmentId || a.transactionId === session.id);
    if (app) {
      if (app.paymentStatus === 'paid') return;
      app.paymentStatus = 'paid';
      app.status = 'confirmed';
      app.paymentMethod = 'stripe';
      app.transactionId = transactionId;
      app.paidAmount = paidAmountStr;
      console.log(`Webhook: In-memory appointment ${app._id} marked as PAID & CONFIRMED.`);
    }
  }
}

// ==========================================
// 2. Parse JSON for all standard payment API endpoints
// ==========================================
router.use(express.json());

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { 
      service, 
      provider, 
      price, 
      date, 
      time, 
      name, 
      email, 
      phone, 
      notes, 
      returnUrl 
    } = req.body;

    // Validate required fields
    if (!service || !provider || !date || !time || !name || !email || !phone) {
      return res.status(400).json({ 
        error: 'Missing required appointment fields (service, provider, date, time, name, email, phone)' 
      });
    }

    // Validate Backend Price (Source of Truth)
    const validatedNumericPrice = getValidatedPriceInINR(service, price);
    const amountInSubunits = Math.round(validatedNumericPrice * 100);

    // Check for existing slot conflicts
    if (mongoose.connection.readyState === 1) {
      const conflict = await Appointment.findOne({
        provider,
        date,
        time,
        status: { $ne: 'cancelled' },
        paymentStatus: 'paid'
      });
      if (conflict) {
        return res.status(409).json({ 
          error: 'This time slot is already booked for this provider. Please select another time slot.' 
        });
      }
    }

    // Step 1: Create Appointment in DB with "unpaid" and "pending"
    let appointment;
    const appointmentData = {
      service,
      provider,
      price: `₹${validatedNumericPrice}`,
      date,
      time,
      name,
      email,
      phone,
      notes: notes || '',
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'stripe',
      transactionId: '',
      paidAmount: `₹${validatedNumericPrice}`
    };

    if (mongoose.connection.readyState === 1) {
      appointment = new Appointment(appointmentData);
      await appointment.save();
    } else {
      appointment = {
        _id: Date.now().toString(),
        ...appointmentData,
        createdAt: new Date().toISOString()
      };
      inMemoryAppointments.push(appointment);
    }

    // Step 2: Initialize Stripe Client
    const stripe = getStripe();
    if (!stripe) {
      return res.status(400).json({ 
        error: 'Stripe secret key is missing. Please configure STRIPE_SECRET_KEY in backend .env file.' 
      });
    }

    const origin = returnUrl || req.headers.origin || `${req.protocol}://${req.get('host')}`;
    const frontendUrl = process.env.FRONTEND_URL || origin;

    // Step 3: Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${service} (${provider})`,
              description: `Appointment on ${date} at ${time}`
            },
            unit_amount: amountInSubunits
          },
          quantity: 1
        }
      ],
      metadata: {
        appointmentId: appointment._id.toString()
      },
      success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment-cancel`
    });

    // Step 4: Save Stripe Checkout Session ID into appointment transactionId
    if (mongoose.connection.readyState === 1) {
      appointment.transactionId = session.id;
      await appointment.save();
    } else {
      appointment.transactionId = session.id;
    }

    // Step 5: Return Checkout URL for frontend redirect
    return res.json({ 
      url: session.url, 
      sessionId: session.id, 
      appointmentId: appointment._id 
    });

  } catch (error) {
    console.error('Error creating Stripe Checkout Session:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create Stripe checkout session' 
    });
  }
});

module.exports = router;
