import React from 'react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import { useNavigate } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Home = ({ services, setSelectedService, isLoading, onContactSupport }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/book');
  };

  const handleExploreServices = () => {
    // Only scroll to services section, no auto-navigation
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    navigate('/book');
  };

  const handleContactSupport = () => {
    if (onContactSupport) {
      onContactSupport();
    } else {
      // Default contact support behavior
      const supportOptions = [
        'Email: support@bookeasy.com',
        'Phone: +91 9398589990',
        'Live Chat: Available 9 AM - 9 PM',
        'Help Center: bookeasy.com/help'
      ];
      
      alert(`Contact Support:\n\n${supportOptions.join('\n')}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2D6A4F]"></div>
      </div>
    );
  }

  return (
    <>
      <Hero onBookNow={handleBookNow} onExploreServices={handleExploreServices} />
      
      {/* Services Section */}
      <div id="services-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Services</h2>
          <p className="text-lg text-gray-600">Discover our most popular professional services</p>
        </div>
        
        {!services || services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No services available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.slice(0, 4).map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={handleServiceSelect}
                />
              ))}
            </div>
            
            {/* View All Services Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/book')}
                className="bg-[#2D6A4F] cursor-pointer text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#1F5A3E] transition-all shadow-sm"
              >
                View All Services →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Additional Services Categories Section */}
      <div className="bg-[#F8FAF8] border-y border-emerald-100/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Service Categories</h2>
            <p className="text-lg text-gray-600">Choose from our wide range of professional services</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { 
                name: 'Beauty & Wellness', 
                icon: '💄', 
                count: '25+ Services',
                description: 'Hair, Nails, Spa & More'
              },
              { 
                name: 'Healthcare', 
                icon: '🏥', 
                count: '30+ Services',
                description: 'Dental, Medical & Wellness'
              },
              { 
                name: 'Fitness', 
                icon: '💪', 
                count: '15+ Services',
                description: 'Training, Yoga & Sports'
              },
              { 
                name: 'Professional', 
                icon: '💼', 
                count: '20+ Services',
                description: 'Consulting & Business'
              }
            ].map((category, index) => (
              <div 
                key={index}
                onClick={() => navigate('/book')}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-[#D8F3DC] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-1">{category.name}</h3>
                <p className="text-[#2D6A4F] text-center text-sm font-semibold mb-1">{category.count}</p>
                <p className="text-gray-500 text-center text-xs">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose BookEasy?</h2>
            <p className="text-lg text-gray-600">Experience the difference with our premium booking platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Instant Booking',
                description: 'Book appointments in seconds with our streamlined process'
              },
              {
                icon: '🔒',
                title: 'Secure & Safe',
                description: 'Your data is protected with enterprise-grade security'
              },
              {
                icon: '🌟',
                title: 'Top Professionals',
                description: 'Access to verified and highly-rated service providers'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-[#D8F3DC] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-[#1F5A3E] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Appointment?</h2>
          <p className="text-lg text-emerald-100 mb-8">Join thousands of satisfied customers who trust us with their needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/book')}
              className="bg-white cursor-pointer text-[#1F5A3E] px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-sm"
            >
              Browse All Services
            </button>
            <button 
              onClick={handleContactSupport}
              className="border-2 cursor-pointer border-white text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:text-[#1F5A3E] transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-9 h-9 bg-[#2D6A4F] rounded-xl flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  BookEasy
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md text-sm leading-relaxed">
                Your trusted platform for booking appointments with top professionals. 
                Simple, secure, and reliable booking experience for all your needs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#74C69D] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#74C69D] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#74C69D] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#74C69D] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Home</button></li>
                <li><button onClick={() => navigate('/book')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Book Appointment</button></li>
                <li><button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">My Appointments</button></li>
                <li><a href="#services-section" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-base font-semibold mb-4 text-white">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400 text-sm">
                  <Mail className="w-4 h-4 mr-2 text-[#74C69D]" />
                  <span>support@bookeasy.com</span>
                </li>
                <li className="flex items-center text-gray-400 text-sm">
                  <Phone className="w-4 h-4 mr-2 text-[#74C69D]" />
                  <span>+91 9876543210</span>
                </li>
                <li className="flex items-center text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-[#74C69D]" />
                  <span>Bhimavaram, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 BookEasy. All rights reserved.
              </div>
              
              {/* Developer Credit */}
              <div className="flex items-center text-gray-400 text-sm">
                <span>Crafted with</span>
                <Heart className="w-4 h-4 mx-1 text-rose-500 fill-current" />
                <span>by</span>
                <span className="ml-1 font-semibold text-[#74C69D]">
                  Anand Kumar Ketha
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;