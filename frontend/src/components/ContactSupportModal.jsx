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
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[#1F5A3E] text-2xl">✓</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Message Sent Successfully!
          </h3>
          <p className="text-gray-600 mb-6">
            We'll get back to you within 24 hours.
          </p>
          <button
            onClick={onClose}
            className="bg-[#2D6A4F] text-white px-6 py-2.5 rounded-xl hover:bg-[#1F5A3E] transition-colors font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Contact Support</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3.5 px-4 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'contact'
                ? 'text-[#2D6A4F] border-b-2 border-[#2D6A4F] bg-[#D8F3DC]/20'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Contact Info
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-3.5 px-4 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'message'
                ? 'text-[#2D6A4F] border-b-2 border-[#2D6A4F] bg-[#D8F3DC]/20'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Send Message
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'contact' ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  We're here to help!
                </h3>
                <p className="text-gray-600 text-sm">
                  Get in touch with our support team through any of these channels
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F8FAF8] rounded-xl p-4 text-center border border-emerald-100/60">
                  <Mail className="w-7 h-7 text-[#2D6A4F] mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-sm text-gray-600">support@bookeasy.com</p>
                  <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                </div>

                <div className="bg-[#F8FAF8] rounded-xl p-4 text-center border border-emerald-100/60">
                  <Phone className="w-7 h-7 text-[#2D6A4F] mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <p className="text-sm text-gray-600">+91 9876543210</p>
                  <p className="text-xs text-gray-500 mt-1">Mon-Fri, 9 AM - 9 PM</p>
                </div>

                <div className="bg-[#F8FAF8] rounded-xl p-4 text-center border border-emerald-100/60">
                  <MessageCircle className="w-7 h-7 text-[#2D6A4F] mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Live Chat</h4>
                  <p className="text-sm text-gray-600">Available 24/7</p>
                  <button className="text-xs text-[#2D6A4F] font-semibold hover:underline mt-1 cursor-pointer">
                    Start Chat
                  </button>
                </div>

                <div className="bg-[#F8FAF8] rounded-xl p-4 text-center border border-emerald-100/60">
                  <MapPin className="w-7 h-7 text-[#2D6A4F] mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Office</h4>
                  <p className="text-sm text-gray-600">Bangalore, India</p>
                  <p className="text-xs text-gray-500 mt-1">Visit by appointment</p>
                </div>
              </div>

              <div className="bg-[#D8F3DC]/40 rounded-xl p-4 border border-[#74C69D]/40">
                <h4 className="font-semibold text-[#1F5A3E] mb-2">Quick Help</h4>
                <ul className="text-sm text-[#2D6A4F] space-y-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] bg-white text-gray-900"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] bg-white text-gray-900"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] bg-white text-gray-900"
                  placeholder="What can we help you with?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] bg-white text-gray-900"
                  placeholder="Describe your issue or question in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2D6A4F] text-white py-3 rounded-xl font-semibold hover:bg-[#1F5A3E] disabled:opacity-50 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
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