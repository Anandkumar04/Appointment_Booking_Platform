import React from 'react';

const Hero = ({ onBookNow, onExploreServices }) => (
  <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
        Book Your Perfect
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
          Appointment
        </span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Connect with top professionals across beauty, healthcare, wellness, and more. Simple booking, guaranteed quality.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onBookNow}
          className="bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Book Appointment
        </button>
        <button 
          onClick={onExploreServices}
          className="border-2 cursor-pointer border-gray-300 text-gray-700 bg-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all transform hover:scale-105"
        >
          Explore Services
        </button>
      </div>
    </div>
  </div>
);

export default Hero;