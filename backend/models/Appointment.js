const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  notes: String,
  service: String,
  provider: String,
  price: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
