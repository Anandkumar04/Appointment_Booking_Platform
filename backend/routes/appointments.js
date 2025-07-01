const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// POST /api/appointments
router.post('/', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const saved = await newAppointment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving appointment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all appointments
router.get('/', async (req, res) => {
  try {
    const all = await Appointment.find();
    res.json(all);
  } catch (err) {
    console.error('Error getting appointments:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

module.exports = router;
