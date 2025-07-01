import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Trash2, MessageSquare } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

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
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = `Message feature will be available soon for ${appointment.service}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Appointments
          </h1>
          <p className="text-xl text-gray-600">
            Manage your upcoming and past appointments
          </p>
        </div>

        {!appointments || appointments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No Appointments Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't booked any appointments yet. Explore our services and book your first appointment today!
            </p>
            <button
              onClick={onBookNow}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Appointment Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {appointment.service}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <User className="w-4 h-4 mr-2" />
                            <span>{appointment.provider}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span>{appointment.name}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{appointment.phone}</span>
                        </div>
                      </div>

                      {appointment.email && (
                        <div className="flex items-center text-gray-600 mb-4">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{appointment.email}</span>
                        </div>
                      )}

                      {appointment.notes && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                          <p className="text-gray-600 text-sm">{appointment.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-6 mt-4 lg:mt-0">
                      <button
                        onClick={() => handleSendMessage(appointment)}
                        className="flex items-center cursor-pointer justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Send Message"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </button>
                      <button
                        onClick={() => handleCancelClick(appointment)}
                        className="flex items-center cursor-pointer justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Cancel Appointment"
                      >
                        <Trash2 className="w-4 h-4 mr-2 " />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Book Another Appointment Button */}
            <div className="text-center pt-8">
              <button
                onClick={onBookNow}
                className="bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
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