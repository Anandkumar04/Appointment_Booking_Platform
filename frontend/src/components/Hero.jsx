import React from 'react';

const Hero = ({ onBookNow, onExploreServices }) => (
  <div className="relative bg-[#F8FAF8] border-b border-emerald-100/60 overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="inline-block px-4 py-1.5 bg-[#D8F3DC] text-[#1F5A3E] text-sm font-semibold rounded-full mb-6">
        Streamlined Service Scheduling
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
        Book Your Perfect{' '}
        <span className="text-[#2D6A4F] block mt-1">
          Appointment
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Connect with top professionals across beauty, healthcare, wellness, and more. Simple booking, guaranteed quality.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onBookNow}
          className="bg-[#2D6A4F] cursor-pointer text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-[#1F5A3E] transition-all shadow-sm"
        >
          Book Appointment
        </button>
        <button 
          onClick={onExploreServices}
          className="border-2 cursor-pointer border-gray-300 text-gray-700 bg-white px-8 py-3.5 rounded-xl font-semibold text-base hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-all"
        >
          Explore Services
        </button>
      </div>
    </div>
  </div>
);

export default Hero;