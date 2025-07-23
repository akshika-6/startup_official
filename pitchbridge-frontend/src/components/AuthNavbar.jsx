// src/components/AuthNavbar.jsx - 'Explore' now a non-redirecting span
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';

const AuthNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // Update document class and local storage when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Adjusted linkClass to work for both Link and span elements
  const linkClass = (mobile) =>
    mobile
      ? 'block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-base font-medium transition-colors duration-200'
      : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition duration-200';

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-800 dark:text-white shadow-md transition duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
          PitchBridge
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className={linkClass(false)}>Home</Link>
          {/* 'Explore' is now a span, non-clickable */}
          <span className={`${linkClass(false)} cursor-not-allowed`}>Explore</span>
          <Link to="/login" className={linkClass(false)}>Login</Link>
          <Link to="/register" className={linkClass(false)}>Register</Link>

          <button
            onClick={toggleDarkMode}
            className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Toggle and Dark Mode Button */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button
            onClick={toggleMenu}
            className="text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pt-2 pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <Link to="/" onClick={toggleMenu} className={linkClass(true)}>Home</Link>
          {/* 'Explore' is now a span, non-clickable for mobile too */}
          <span className={`${linkClass(true)} cursor-not-allowed`} onClick={() => setMenuOpen(false)}>Explore</span>
          <Link to="/login" onClick={toggleMenu} className={linkClass(true)}>Login</Link>
          <Link to="/register" onClick={toggleMenu} className={linkClass(true)}>Register</Link>
        </div>
      )}
    </nav>
  );
};

export default AuthNavbar;