// src/components/AuthNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react'; // Assuming lucide-react is still installed

const AuthNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const linkClass = (mobile) => mobile ? 'block text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:text-blue-500';

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-800 dark:text-white shadow-md transition duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold">
          PitchBridge
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {/* These links are always shown on auth pages */}
          <Link to="/" className={linkClass(false)}>Home</Link>
          <Link to="/startups" className={linkClass(false)}>Startups</Link>
          <Link to="/login" className={linkClass(false)}>Login</Link>
          <Link to="/register" className={linkClass(false)}>Register</Link>

          <button
            onClick={toggleDarkMode}
            className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <button onClick={toggleDarkMode}>
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button onClick={toggleMenu}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 space-y-2">
          <Link to="/" className={linkClass(true)}>Home</Link>
          <Link to="/startups" className={linkClass(true)}>Startups</Link>
          <Link to="/login" className={linkClass(true)}>Login</Link>
          <Link to="/register" className={linkClass(true)}>Register</Link>
        </div>
      )}
    </nav>
  );
};

export default AuthNavbar;