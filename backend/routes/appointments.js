const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Appointment = require('../models/Appointment');

const inMemoryAppointments = [
  {
    _id: '1',
    service: 'Haircut & Styling',
    provider: 'Mr. Barber',
    date: '2025-07-05',
    time: '10:00 AM',
    status: 'confirmed',
    name: 'Anandkumar04',
    email: 'anandkumar04@example.com',
    phone: '+91 9876543210'
  }
];

// GET booked time slots for a provider and date
router.get('/booked-slots', async (req, res) => {
  const { provider, date } = req.query;
  if (!provider || !date) {
    return res.status(400).json({ error: 'provider and date query parameters are required' });
  }

  try {
    let slots = [];
    if (mongoose.connection.readyState === 1) {
      const apps = await Appointment.find({ provider, date, status: { $ne: 'cancelled' } });
      slots = apps.map(a => a.time);
    } else {
      slots = inMemoryAppointments
        .filter(a => a.provider === provider && a.date === date && a.status !== 'cancelled')
        .map(a => a.time);
    }
    res.json({ provider, date, bookedSlots: slots });
  } catch (err) {
    console.error('Error fetching booked slots:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/appointments
router.post('/', async (req, res) => {
  const { name, email, phone, date, time, service, provider } = req.body;

  // Input validation
  if (!name || !email || !phone || !date || !time || !service) {
    return res.status(400).json({ error: 'Missing required appointment fields (name, email, phone, date, time, service)' });
  }

  try {
    // Check for double booking slot conflict
    if (mongoose.connection.readyState === 1) {
      const conflict = await Appointment.findOne({
        provider,
        date,
        time,
        status: { $ne: 'cancelled' }
      });
      if (conflict) {
        return res.status(409).json({ error: 'This time slot is already booked for this provider. Please select another time.' });
      }

      const newAppointment = new Appointment(req.body);
      const saved = await newAppointment.save();
      return res.status(201).json(saved);
    } else {
      const conflict = inMemoryAppointments.find(a => 
        a.provider === provider && a.date === date && a.time === time && a.status !== 'cancelled'
      );
      if (conflict) {
        return res.status(409).json({ error: 'This time slot is already booked for this provider. Please select another time.' });
      }

      const newApp = {
        _id: Date.now().toString(),
        ...req.body,
        status: req.body.status || 'confirmed',
        createdAt: new Date().toISOString()
      };
      inMemoryAppointments.push(newApp);
      return res.status(201).json(newApp);
    }
  } catch (err) {
    console.error('Error saving appointment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/appointments/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Appointment not found' });
      return res.json(updated);
    } else {
      const app = inMemoryAppointments.find(a => a._id === req.params.id);
      if (!app) return res.status(404).json({ error: 'Appointment not found' });
      app.status = status;
      return res.json(app);
    }
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all appointments
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const all = await Appointment.find();
      return res.json(all);
    } else {
      return res.json(inMemoryAppointments);
    }
  } catch (err) {
    console.error('Error getting appointments:', err);
    res.json(inMemoryAppointments);
  }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Appointment.findByIdAndDelete(req.params.id);
    } else {
      const index = inMemoryAppointments.findIndex(a => a._id === req.params.id);
      if (index !== -1) {
        inMemoryAppointments.splice(index, 1);
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

module.exports = router;
