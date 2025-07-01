import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';

const BookingModal = ({ service, onClose, onBook }) => {
  const [formData, setFormData] = useState({
    name: 'Anandkumar04',
    email: 'anandkumar04@example.com',
    phone: '+91 9876543210',
    date: '',
    time: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Generate available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'
  ];

  // Current date is 2025-07-01
  const today = '2025-07-01';
  
  // Get max date (60 days from today for better availability)
  const maxDate = new Date('2025-07-01');
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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

    // Check if selected date is not in the past
    if (formData.date && formData.date < today) {
      newErrors.date = 'Please select a future date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const appointment = {
        _id: Date.now().toString(),
        service: service.name,
        provider: service.provider,
        ...formData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      onBook(appointment);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white/95 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-white/20"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {/* Fixed Header - Glass effect */}
        <div 
          className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-6 rounded-t-2xl flex-shrink-0"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Book Your Appointment
              </h2>
              <div 
                className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50"
                style={{ 
                  backgroundColor: 'rgba(240, 249, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <h3 className="font-bold text-blue-900 mb-2 text-lg">{service.name}</h3>
                <div className="flex flex-wrap items-center text-blue-800 text-sm gap-4">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {service.provider}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {service.duration}
                  </span>
                  <span className="font-bold text-blue-900 text-lg">{service.price}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100/50 backdrop-blur-sm cursor-pointer rounded-full transition-all duration-200 flex-shrink-0"
              style={{ backgroundColor: 'rgba(243, 244, 246, 0.3)' }}
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Content - Glass effect */}
        <div 
          className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-md"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all text-base relative z-0 backdrop-blur-sm ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300/50 focus:border-blue-500'
                      }`}
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)'
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all text-base relative z-0 backdrop-blur-sm ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300/50 focus:border-blue-500'
                      }`}
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)'
                      }}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-2 font-medium">{errors.phone}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all text-base relative z-0 backdrop-blur-sm ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300/50 focus:border-blue-500'
                    }`}
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>}
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                Appointment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all text-base relative z-0 backdrop-blur-sm ${
                        errors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-300/50 focus:border-blue-500'
                      }`}
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)'
                      }}
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-sm mt-2 font-medium">{errors.date}</p>}
                  <p className="text-gray-500 text-sm mt-2">Available from {today} to {maxDateString}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Preferred Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-10 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 appearance-none transition-all text-base relative z-0 backdrop-blur-sm ${
                        errors.time ? 'border-red-500 focus:border-red-500' : 'border-gray-300/50 focus:border-blue-500'
                      }`}
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)'
                      }}
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time} style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.time && <p className="text-red-500 text-sm mt-2 font-medium">{errors.time}</p>}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <div className="w-8 h-8 bg-purple-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                Additional Notes (Optional)
              </h4>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-gray-400 w-5 h-5 z-10" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none transition-all text-base relative z-0 backdrop-blur-sm"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}
                  placeholder="Any special requirements, allergies, or notes for the service provider..."
                />
              </div>
            </div>

            {/* Summary Card - Glass effect */}
            <div 
              className="bg-gradient-to-r from-blue-50/60 to-purple-50/60 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50"
              style={{ 
                backgroundColor: 'rgba(240, 249, 255, 0.6)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)'
              }}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h4>
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
                <div className="border-t border-blue-200/50 pt-2 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-blue-900">{service.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer - Glass effect */}
        <div 
          className="bg-white/90 backdrop-blur-md border-t border-gray-200/50 p-6 rounded-b-2xl flex-shrink-0"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            position: 'sticky',
            bottom: 0,
            zIndex: 100
          }}
        >
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer px-6 py-4 border-2 border-gray-300/50 text-gray-700 rounded-xl hover:bg-gray-50/50 backdrop-blur-sm transition-all duration-200 font-semibold text-base"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex-1 cursor-pointer px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-base backdrop-blur-sm"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
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