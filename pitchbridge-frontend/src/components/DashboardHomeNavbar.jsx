// src/components/DashboardHomeNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Assuming you have a ThemeContext now
import { Sun, Moon, LogOut, Settings } from 'lucide-react'; // Import icons

const DashboardHomeNavbar = () => {
  const { user, logout } = useAuth(); // Destructure 'user' from useAuth
  const { theme, toggleTheme } = useTheme(); // Use your theme context

  // This function determines the path for the "Dashboard" navigation link.
  // It should lead to DashboardInstructions for authenticated users.
  const getDashboardNavLinkPath = () => {
    if (!user) {
      // If no user, clicking "Dashboard" should lead to login
      return '/login';
    }
    // For authenticated users, direct them to DashboardInstructions (the default internal dashboard page)
    return '/dashboard'; // Changed to just /dashboard as your App.jsx has this route
  };


  return (
    <nav className="fixed top-0 left-0 w-full bg-theme-bg-navbar backdrop-blur-md bg-opacity-90 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand: Links to /home-dashboard (your full-screen "marketing" dashboard) */}
          <div className="flex-shrink-0">
            <Link to="/home-dashboard" className="text-2xl font-bold text-theme-text flex items-center">
              <div className="relative group mr-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-5 h-0.5 bg-white rounded-full mb-0.5 transform -rotate-12"></div>
                    <div className="w-3 h-0.5 bg-white/80 rounded-full"></div>
                  </div>
                </div>
              </div>
              PitchBridge
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-grow flex justify-center">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Dashboard Nav Link: Points to the main internal dashboard route */}
              <Link
                to={getDashboardNavLinkPath()} // <-- Uses the function to dynamically get path
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-theme-text hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                Dashboard {/* Text remains "Dashboard" */}
              </Link>
              {/* Profile Link - Remains unchanged */}
              <Link
                to="/profile"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-theme-text hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                Profile
              </Link>
              {/* Contact Link - Remains unchanged */}
              <Link
                to="/contact"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-theme-text hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right-aligned Icons - Remains unchanged */}
          <div className="flex items-center space-x-4">
            {/* Settings Icon */}
            <Link to="/settings" className="p-2 text-theme-text hover:text-blue-500 transition-colors duration-200">
              <Settings className="w-5 h-5" />
            </Link>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-theme-text hover:text-blue-500 transition-colors duration-200 focus:outline-none"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Logout/Sign In Button logic */}
            {user ? (
              <button
                onClick={logout}
                className="p-2 text-theme-text hover:text-red-500 transition-colors duration-200 focus:outline-none"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHomeNavbar;