// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// You can add other icons like Bell for notifications or User for a simple avatar if you want
// import { Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-800 dark:text-white shadow-sm transition duration-300 h-16 flex items-center px-6">
      <div className="flex-1">
        {/* Minimal branding for logged-in view */}
        <Link to="/dashboard" className="text-2xl font-bold">
          PitchBridge
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* You could add simple icons here, e.g., a notification bell or a user avatar/menu trigger */}
        {/* <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <Bell size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <User size={20} />
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;