import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Trash2, MessageSquare } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return dateStr;
};

const Profile = ({ appointments, onCancel, onBookNow, isLoading }) => {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    appointmentId: null,
    appointmentName: ''
  });

  const handleCancelClick = (appointment) => {
    setConfirmModal({
      isOpen: true,
      appointmentId: appointment._id,
      appointmentName: appointment.service
    });
  };

  const handleConfirmCancel = () => {
    if (confirmModal.appointmentId) {
      onCancel(confirmModal.appointmentId);
    }
    setConfirmModal({ isOpen: false, appointmentId: null, appointmentName: '' });
  };

  const handleSendMessage = (appointment) => {
    // Simple notification instead of alert
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-[#2D6A4F] text-white px-6 py-3 rounded-xl shadow-lg z-50 font-medium';
    notification.textContent = `Message feature will be available soon for ${appointment.service}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2D6A4F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            My Appointments
          </h1>
          <p className="text-lg text-gray-600">
            Manage your upcoming and past bookings
          </p>
        </div>

        {!appointments || appointments.length === 0 ? (
          <div className="text-center py-16 bg-[#F8FAF8] border border-emerald-100/60 rounded-2xl max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-[#2D6A4F]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Appointments Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-base">
              You haven't booked any appointments yet. Explore our services and book your first appointment today!
            </p>
            <button
              onClick={onBookNow}
              className="bg-[#2D6A4F] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#1F5A3E] transition-all cursor-pointer shadow-sm"
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Appointment Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {appointment.service}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm">
                            <User className="w-4 h-4 mr-2 text-[#2D6A4F]" />
                            <span className="font-medium">{appointment.provider}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          appointment.status === 'confirmed' 
                            ? 'bg-[#D8F3DC] text-[#1F5A3E]'
                            : appointment.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-[#2D6A4F]" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-[#2D6A4F]" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-[#2D6A4F]" />
                          <span>{appointment.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-[#2D6A4F]" />
                          <span>{appointment.phone}</span>
                        </div>
                      </div>

                      {appointment.email && (
                        <div className="flex items-center text-sm text-gray-700 mb-4">
                          <Mail className="w-4 h-4 mr-2 text-[#2D6A4F]" />
                          <span>{appointment.email}</span>
                        </div>
                      )}

                      {appointment.notes && (
                        <div className="bg-[#F8FAF8] rounded-xl p-3 border border-gray-100">
                          <h4 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wider">Notes</h4>
                          <p className="text-gray-600 text-sm">{appointment.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-8 mt-4 lg:mt-0">
                      <button
                        onClick={() => handleSendMessage(appointment)}
                        className="flex items-center cursor-pointer justify-center px-4 py-2.5 bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl hover:bg-[#1F5A3E] transition-colors"
                        title="Send Message"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </button>
                      <button
                        onClick={() => handleCancelClick(appointment)}
                        className="flex items-center cursor-pointer justify-center px-4 py-2.5 bg-rose-50 text-rose-700 text-sm font-semibold rounded-xl hover:bg-rose-100 transition-colors border border-rose-200"
                        title="Cancel Appointment"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Book Another Appointment Button */}
            <div className="text-center pt-6">
              <button
                onClick={onBookNow}
                className="bg-[#2D6A4F] cursor-pointer text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#1F5A3E] transition-all shadow-sm"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, appointmentId: null, appointmentName: '' })}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel your appointment for "${confirmModal.appointmentName}"? This action cannot be undone.`}
        confirmText="Yes, Cancel"
        cancelText="Keep Appointment"
        type="danger"
      />
    </div>
  );
};

export default Profile;