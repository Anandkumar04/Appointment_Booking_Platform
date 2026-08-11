import React, { useState } from 'react';
import { X } from 'lucide-react';

const AuthModal = ({ onClose, onSuccess }) => {
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!authForm.email || !authForm.password) {
      setError('Email and password are required');
      return false;
    }
    if (mode === 'register' && !authForm.name) {
      setError('Name is required for registration');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authForm.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (authForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const isBackendAvailable = async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        timeout: 3000
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const backendAvailable = await isBackendAvailable();
      
      if (backendAvailable) {
        // Try real backend
        const endpoint = mode === 'register' ? 'register' : 'login';
        const response = await fetch(`/api/auth/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authForm)
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data.user || { name: authForm.name || 'User', email: authForm.email };
          if (mode === 'login' && data.token) {
            localStorage.setItem('token', data.token);
          }
          localStorage.setItem('user', JSON.stringify(userData));
          onSuccess(userData);
          return;
        }
      }
      
      // Mock authentication for demo
      console.log('Using mock authentication');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mode === 'register') {
        // Save user data to localStorage
        const userData = { name: authForm.name, email: authForm.email };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', 'mock-token-' + Date.now());
        onSuccess(userData);
      } else {
        // Mock login - check if user exists in localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          localStorage.setItem('token', 'mock-token-' + Date.now());
          onSuccess(userData);
        } else {
          // Create a default user for demo
          const userData = { name: 'Demo User', email: authForm.email };
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', 'mock-token-' + Date.now());
          onSuccess(userData);
        }
      }
      
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100">
        {/* Back Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#2D6A4F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="text-white text-2xl font-bold">
              {mode === 'login' ? '👋' : '🎉'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Join us to book amazing appointments'
            }
          </p>
        </div>
        
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                name="name" 
                placeholder="Enter your full name" 
                value={authForm.name} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              name="email" 
              type="email"
              placeholder="Enter your email" 
              value={authForm.email} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              value={authForm.password} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] focus:outline-none transition-colors"
              disabled={loading}
            />
            {mode === 'register' && (
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="w-full mt-6 bg-[#2D6A4F] text-white py-3.5 rounded-xl font-semibold hover:bg-[#1F5A3E] transition-all disabled:opacity-50 shadow-sm cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            mode === 'login' ? 'Sign In' : 'Create Account'
          )}
        </button>
        
        <p className="mt-6 text-sm text-center text-gray-600">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button 
            className="text-[#2D6A4F] font-semibold hover:underline cursor-pointer" 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            disabled={loading}
          >
            {mode === 'login' ? 'Create one here' : 'Sign in instead'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
