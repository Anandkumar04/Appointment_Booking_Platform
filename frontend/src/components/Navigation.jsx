import React, { useState } from 'react';
import { Calendar, LogOut, User, Menu, X, Home, CalendarPlus, CheckSquare } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView, setShowAuthModal, user, onSignOut }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'booking', label: 'Book Now', icon: CalendarPlus },
    { id: 'profile', label: 'My Appointments', icon: CheckSquare },
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-9 h-9 bg-[#2D6A4F] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-[#2D6A4F] tracking-tight">
              BookEasy
            </span>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-semibold transition-all ${
                    isActive 
                      ? 'text-[#2D6A4F] bg-[#D8F3DC]/70 shadow-xs' 
                      : 'text-gray-600 hover:text-[#2D6A4F] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2D6A4F]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                  <div className="w-7 h-7 bg-[#2D6A4F] rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="flex items-center space-x-1.5 bg-rose-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-rose-700 transition-all cursor-pointer shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-[#2D6A4F] cursor-pointer text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#1F5A3E] transition-all shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center space-x-2">
            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-[#2D6A4F] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1F5A3E] transition-all"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-[#2D6A4F] hover:bg-emerald-50 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100/60 bg-white shadow-lg animate-fadeIn">
          <div className="px-4 pt-3 pb-4 space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'text-[#2D6A4F] bg-[#D8F3DC]/70' 
                      : 'text-gray-700 hover:text-[#2D6A4F] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#2D6A4F]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile User Profile/Sign Out */}
            {user && (
              <div className="pt-3 mt-2 border-t border-gray-100 space-y-2">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-8 h-8 bg-[#2D6A4F] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email || 'Logged in'}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors cursor-pointer mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;