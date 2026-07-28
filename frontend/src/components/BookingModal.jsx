import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const BookingModal = ({ service, onClose, onBook, user, existingAppointments = [] }) => {
  const [formData, setFormData] = useState({
    name: user?.name || 'Anandkumar04',
    email: user?.email || 'anandkumar04@example.com',
    phone: user?.phone || '+91 9876543210',
    date: '',
    time: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);
  const [apiError, setApiError] = useState('');

  // Generate available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'
  ];

  // Dynamic today ISO date string
  const todayObj = new Date();
  const today = todayObj.toISOString().split('T')[0];
  
  // Get max date (60 days from today)
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 60);
  const maxDateString = maxDateObj.toISOString().split('T')[0];

  // Fetch booked slots whenever selected date or provider changes
  useEffect(() => {
    if (formData.date && service?.provider) {
      const fetchSlots = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/appointments/booked-slots?provider=${encodeURIComponent(service.provider)}&date=${formData.date}`);
          if (res.ok) {
            const data = await res.json();
            setBookedSlots(data.bookedSlots || []);
          } else {
            // Fallback to filtering existing local appointments
            const localSlots = existingAppointments
              .filter(a => a.provider === service.provider && a.date === formData.date && a.status !== 'cancelled')
              .map(a => a.time);
            setBookedSlots(localSlots);
          }
        } catch {
          const localSlots = existingAppointments
            .filter(a => a.provider === service.provider && a.date === formData.date && a.status !== 'cancelled')
            .map(a => a.time);
          setBookedSlots(localSlots);
        }
      };
      fetchSlots();
    } else {
      setBookedSlots([]);
    }
  }, [formData.date, service?.provider, existingAppointments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setApiError('');
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.date && formData.date < today) {
      newErrors.date = 'Please select a future date';
    }

    if (formData.time && bookedSlots.includes(formData.time)) {
      newErrors.time = 'This time slot is already booked. Please choose another slot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const appointmentPayload = {
      service: service.name,
      provider: service.provider,
      price: service.price,
      ...formData,
      status: 'confirmed'
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(appointmentPayload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const savedAppointment = await res.json();
      onBook(savedAppointment);
    } catch (error) {
      console.warn('Backend booking error or offline, completing with client fallback:', error.message);
      if (error.message.includes('already booked')) {
        setApiError(error.message);
      } else {
        // Fallback local booking
        const fallbackApp = {
          _id: Date.now().toString(),
          ...appointmentPayload,
          createdAt: new Date().toISOString()
        };
        onBook(fallbackApp);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100"
      >
        {/* Fixed Header */}
        <div 
          className="bg-white border-b border-gray-100 p-6 rounded-t-2xl flex-shrink-0 sticky top-0 z-10"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Book Your Appointment
              </h2>
              <div 
                className="bg-[#D8F3DC]/40 rounded-xl p-4 border border-[#74C69D]/40"
              >
                <h3 className="font-bold text-[#1F5A3E] mb-2 text-lg">{service.name}</h3>
                <div className="flex flex-wrap items-center text-[#2D6A4F] text-sm gap-4 font-medium">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {service.provider}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {service.duration}
                  </span>
                  <span className="font-bold text-[#1F5A3E] text-lg">{service.price}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-gray-100 cursor-pointer rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div 
          className="flex-1 overflow-y-auto bg-white p-6 space-y-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-[#D8F3DC] rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-[#2D6A4F]" />
                </div>
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] text-gray-900 transition-all text-base bg-white ${
                        errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-gray-200 focus:border-[#2D6A4F]'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && <p className="text-rose-600 text-sm mt-1 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] text-gray-900 transition-all text-base bg-white ${
                        errors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-gray-200 focus:border-[#2D6A4F]'
                      }`}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  {errors.phone && <p className="text-rose-600 text-sm mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] text-gray-900 transition-all text-base bg-white ${
                      errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-gray-200 focus:border-[#2D6A4F]'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && <p className="text-rose-600 text-sm mt-1 font-medium">{errors.email}</p>}
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-[#D8F3DC] rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-[#2D6A4F]" />
                </div>
                Appointment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      max={maxDateString}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] text-gray-900 transition-all text-base bg-white ${
                        errors.date ? 'border-rose-500 focus:border-rose-500' : 'border-gray-200 focus:border-[#2D6A4F]'
                      }`}
                    />
                  </div>
                  {errors.date && <p className="text-rose-600 text-sm mt-1 font-medium">{errors.date}</p>}
                  <p className="text-gray-500 text-xs mt-1">Available from {today} to {maxDateString}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-10 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] text-gray-900 appearance-none transition-all text-base bg-white ${
                        errors.time ? 'border-rose-500 focus:border-rose-500' : 'border-gray-200 focus:border-[#2D6A4F]'
                      }`}
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map(time => {
                        const isBooked = bookedSlots.includes(time);
                        return (
                          <option 
                            key={time} 
                            value={time} 
                            disabled={isBooked}
                            style={{ 
                              backgroundColor: '#ffffff', 
                              color: isBooked ? '#9ca3af' : '#111827' 
                            }}
                          >
                            {time} {isBooked ? '(Booked)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.time && <p className="text-rose-600 text-sm mt-1 font-medium">{errors.time}</p>}
                </div>
              </div>
            </div>

            {apiError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
                {apiError}
              </div>
            )}

            {/* Additional Notes */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-[#D8F3DC] rounded-lg flex items-center justify-center mr-3">
                  <MessageSquare className="w-5 h-5 text-[#2D6A4F]" />
                </div>
                Additional Notes (Optional)
              </h4>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-gray-400 w-5 h-5 z-10" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] text-gray-900 bg-white transition-all text-base"
                  placeholder="Any special requirements, allergies, or notes for the service provider..."
                />
              </div>
            </div>

            {/* Summary Card */}
            <div 
              className="bg-[#F8FAF8] rounded-xl p-5 border border-emerald-100"
            >
              <h4 className="text-base font-bold text-gray-900 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold text-gray-900">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-semibold text-gray-900">{service.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-900">{service.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">{formData.date || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold text-gray-900">{formData.time || 'Not selected'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-[#2D6A4F]">{service.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div 
          className="bg-white border-t border-gray-100 p-6 rounded-b-2xl flex-shrink-0 sticky bottom-0 z-10"
        >
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer px-6 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex-1 cursor-pointer px-6 py-3.5 bg-[#2D6A4F] text-white rounded-xl hover:bg-[#1F5A3E] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-base shadow-sm"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing...
                </div>
              ) : (
                `Confirm Booking - ${service.price}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;