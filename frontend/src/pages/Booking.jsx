import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

const Booking = ({ services, onSelect, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const categories = ['all', ...new Set(services.map(s => s.category))];
  
  const filteredServices = services
    .filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(service => selectedCategory === 'all' || service.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return parseInt(a.price.replace('₹', '')) - parseInt(b.price.replace('₹', ''));
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2D6A4F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <div className="bg-[#F8FAF8] border-b border-emerald-100/60 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Book Your Appointment
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of professional services and book with trusted providers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Find Your Perfect Service</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Services
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search services or providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] bg-white text-gray-900 placeholder-gray-400 transition-all text-base"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] bg-white text-gray-900 appearance-none cursor-pointer transition-all text-base"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] bg-white text-gray-900 appearance-none cursor-pointer transition-all text-base"
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="price">Price: Low to High</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-gray-700 text-base">
                <span className="font-bold text-gray-900">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''} available
                {selectedCategory !== 'all' && (
                  <span className="text-[#2D6A4F] font-semibold"> in {selectedCategory}</span>
                )}
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-[#2D6A4F] font-medium bg-[#D8F3DC]/50 px-4 py-2 rounded-lg hover:bg-[#D8F3DC] transition-colors cursor-pointer"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
              <div className="w-24 h-24 bg-[#D8F3DC]/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-gray-400 text-4xl">🔍</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-600 mb-8 text-base max-w-md mx-auto">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-[#2D6A4F] text-white px-8 py-3 rounded-xl hover:bg-[#1F5A3E] transition-colors font-semibold cursor-pointer shadow-sm"
              >
                Show All Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white">
              {filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;