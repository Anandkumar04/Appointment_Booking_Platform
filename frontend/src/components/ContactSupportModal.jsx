import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';

const ContactSupportModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Auto close after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 dark:text-green-400 text-2xl">✓</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Message Sent Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We'll get back to you within 24 hours.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Support</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'contact'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Contact Info
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'message'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Send Message
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'contact' ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  We're here to help!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get in touch with our support team through any of these channels
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">support@bookeasy.com</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Response within 24 hours</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <Phone className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">+91 9876543210</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mon-Fri, 9 AM - 9 PM</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Live Chat</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Available 24/7</p>
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1">
                    Start Chat
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <MapPin className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Office</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Bangalore, India</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Visit by appointment</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick Help</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Check our FAQ section for common questions</li>
                  <li>• Use live chat for immediate assistance</li>
                  <li>• Email us for detailed technical support</li>
                  <li>• Call us for urgent booking issues</li>
                </ul>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="What can we help you with?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe your issue or question in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSupportModal;