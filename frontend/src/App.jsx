import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import BookingModal from './components/BookingModal';
import AuthModal from './components/AuthModal';

// Navigation wrapper to access location
const NavigationWrapper = ({ showAuthModal, setShowAuthModal, user, onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getCurrentView = () => {
    switch (location.pathname) {
      case '/': return 'home';
      case '/book': return 'booking';
      case '/profile': return 'profile';
      default: return 'home';
    }
  };

  const setCurrentView = (view) => {
    const routes = {
      home: '/',
      booking: '/book',
      profile: '/profile'
    };
    navigate(routes[view] || '/');
  };

  return (
    <Navigation
      currentView={getCurrentView()}
      setCurrentView={setCurrentView}
      setShowAuthModal={setShowAuthModal}
      user={user}
      onSignOut={onSignOut}
    />
  );
};

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Updated services with working images
  const services = [
    {
      id: 1,
      name: 'Haircut & Styling',
      provider: 'Mr. Barber',
      price: '₹300',
      duration: '30 min',
      category: 'Beauty',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400'
    },
    {
      id: 2,
      name: 'Massage Therapy',
      provider: 'Relax Spa',
      price: '₹999',
      duration: '1 hr',
      category: 'Wellness',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'
    },
    {
      id: 3,
      name: 'Dental Checkup',
      provider: 'Dr. Smile',
      price: '₹500',
      duration: '45 min',
      category: 'Healthcare',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1667133295315-820bb6481730?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 4,
      name: 'Personal Training',
      provider: 'FitPro Gym',
      price: '₹800',
      duration: '1 hr',
      category: 'Fitness',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Facial Treatment',
      provider: 'Glow Spa',
      price: '₹1200',
      duration: '1.5 hr',
      category: 'Beauty',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'Eye Examination',
      provider: 'Vision Care',
      price: '₹350',
      duration: '30 min',
      category: 'Healthcare',
      rating: 4.4,
      image: 'https://plus.unsplash.com/premium_photo-1663013256145-e4b58bb427f0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 7,
      name: 'Yoga Classes',
      provider: 'Zen Studio',
      price: '₹600',
      duration: '1.5 hr',
      category: 'Fitness',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 8,
      name: 'Car Service',
      provider: 'AutoCare Pro',
      price: '₹2500',
      duration: '3 hr',
      category: 'Professional',
      rating: 4.5,
      image: 'https://plus.unsplash.com/premium_photo-1663090140645-32b7d760853e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 9,
      name: 'Photography Session',
      provider: 'Capture Moments',
      price: '₹3000',
      duration: '2 hr',
      category: 'Professional',
      rating: 4.9,
      image: 'https://plus.unsplash.com/premium_photo-1663054300534-3be5c4c61ae3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ];


  // Check if backend is available
  const isBackendAvailable = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError('');
    
    // Check if backend is available
    const backendAvailable = await isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('Backend not available, using mock data');
      // Use mock data when backend is not available
      setTimeout(() => {
        setAppointments([
          {
            _id: '1',
            service: 'Haircut & Styling',
            provider: 'Mr. Barber',
            date: '2025-07-05',
            time: '10:00 AM',
            status: 'confirmed',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210'
          }
        ]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      // Use mock data as fallback
      setAppointments([
        {
          _id: '1',
          service: 'Haircut & Styling',
          provider: 'Mr. Barber',
          date: '2025-07-05',
          time: '10:00 AM',
          status: 'confirmed',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    
    // Check for existing auth token and user data
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleBookNow = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleAppointmentBooked = (newAppointment) => {
    setAppointments(prev => [...prev, newAppointment]);
    setShowBookingModal(false);
    setSelectedService(null);
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    // Try backend first, fallback to local state
    try {
      const backendAvailable = await isBackendAvailable();
      
      if (backendAvailable) {
        const res = await fetch(`${API_BASE_URL}/api/appointments/${id}`, { 
          method: 'DELETE' 
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      }
      
      setAppointments(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      // Still remove from local state
      setAppointments(prev => prev.filter(app => app._id !== id));
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      // Optionally redirect to home
      window.location.href = '/';
    }
  };

  // Profile wrapper to handle navigation
  const ProfileWrapper = ({ appointments, onCancel, isLoading }) => {
    const navigate = useNavigate();
    
    return (
      <Profile
        appointments={appointments}
        onCancel={onCancel}
        onBookNow={() => navigate('/book')}
        isLoading={isLoading}
      />
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavigationWrapper 
          showAuthModal={showAuthModal}
          setShowAuthModal={setShowAuthModal}
          user={user}
          onSignOut={handleSignOut}
        />
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-center">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-4 text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}
        
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                services={services} 
                setSelectedService={setSelectedService}
                isLoading={isLoading}
              />
            } 
          />
          <Route 
            path="/book" 
            element={
              <Booking 
                services={services} 
                onSelect={handleBookNow}
                isLoading={isLoading}
              />
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProfileWrapper
                appointments={appointments}
                onCancel={handleCancelAppointment}
                isLoading={isLoading}
              />
            } 
          />
        </Routes>

        {/* Booking Modal */}
        {showBookingModal && selectedService && (
          <BookingModal
            service={selectedService}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedService(null);
            }}
            onBook={handleAppointmentBooked}
          />
        )}

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </Router>
  );
};

export default App;
