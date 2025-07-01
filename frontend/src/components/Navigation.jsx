import React from 'react';
import { Calendar, LogOut, User } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView, setShowAuthModal, user, onSignOut }) => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BookEasy
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {['home', 'booking', 'profile'].map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-3 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors ${
                  currentView === view ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {view === 'home' ? 'Home' : view === 'booking' ? 'Book Now' : 'My Appointments'}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Hello, {user.name}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-all transform hover:scale-105"
                >
                  <LogOut className="w-4 h-4 cursor-pointer" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer  text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;