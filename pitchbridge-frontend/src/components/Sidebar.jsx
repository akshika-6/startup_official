// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Home,
  User,
  MessageSquare,
  Settings,
  HelpCircle,
  FilePlus,
  BookOpen,
  Upload,
  BarChart2,
  Mail,
  Users, // Added for Admin Users
  Activity, // Added for Admin Activity
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };


   
  // Define navigation links as an array of objects
  const navLinks = [
    { name: 'Home', path: '/', icon: Home, roles: ['founder', 'investor', 'admin'] },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart2, roles: ['founder', 'investor', 'admin'] },
    // Home link should be here if it's part of the *logged-in* experience
    // If '/' always redirects to dashboard when logged in, this link won't be as important here.
    // Assuming 'Home' in sidebar means 'go to my primary dashboard home'.
    { name: 'Profile', path: '/profile', icon: User, roles: ['founder', 'investor', 'admin'] },
    { name: 'Messages', path: '/messages', icon: MessageSquare, roles: ['founder', 'investor', 'admin'] },

    // Founder specific links
    { name: 'Upload Pitch', path: '/submit-pitch', icon: Upload, roles: ['founder'] },
    { name: 'Add Startup', path: '/create-startup', icon: FilePlus, roles: ['founder'] }, // Changed to create-startup based on App.jsx route
    { name: 'Explore Investors', path: '/investors', icon: BookOpen, roles: ['founder'] }, // Also accessible public, but useful in sidebar

    // Investor specific links
    { name: 'Upload Investor Deck', path: '/investor-deck', icon: Upload, roles: ['investor'] }, // Changed to investor-deck based on App.jsx route
    { name: 'Explore Startups', path: '/startups', icon: BookOpen, roles: ['investor'] }, // Also accessible public, but useful in sidebar
    { name: 'Rate Startups', path: '/rate-startups', icon: BarChart2, roles: ['investor'] },

    // Admin specific links
    { name: 'Admin Users', path: '/admin/users', icon: Users, roles: ['admin'] },
    { name: 'Admin Activity', path: '/admin/activity', icon: Activity, roles: ['admin'] },

    // General links for all logged-in roles
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['founder', 'investor', 'admin'] },
    { name: 'FAQ', path: '/faq', icon: HelpCircle, roles: ['founder', 'investor', 'admin'] }, // Public, but often useful in sidebar
    { name: 'Contact', path: '/contact', icon: Mail, roles: ['founder', 'investor', 'admin'] }, // Public, but often useful in sidebar
  ];

  const filteredLinks = navLinks.filter(link => {
    if (!user) {
      return false; // Only show links if user is logged in
    }
    return link.roles.includes(user.role);
  });

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
     ${location.pathname === path || (path === '/dashboard' && location.pathname === '/') // Special case for dashboard/home
        ? 'bg-white/30 text-white shadow-inner'
        : 'hover:bg-white/15 text-white/90 hover:text-white'
    }`;

  return (
    <div
      className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] text-white shadow-lg p-6 flex flex-col z-30" // Fixed position, calculated height, lower z-index than Navbar
      style={{
        background: 'linear-gradient(180deg, #7070f3 0%, #5a5acd 100%)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Brand/Logo Section - REMOVED from here, handled by Navbar.jsx */}
      {/* User Info Section - Always uses Lucide User icon as placeholder now */}
      {user && (
        <div className="mb-8 text-center bg-white/10 p-3 rounded-lg flex flex-col items-center">
          {/* Always show the Lucide User icon as a placeholder avatar */}
          <User size={40} className="mb-2 text-white/80 border-2 border-white/50 rounded-full p-1" />
          <p className="text-lg font-semibold">{user.name || user.email}</p>
          <p className="text-sm text-white/70 capitalize">{user.role}</p>
        </div>
      )}

      {/* Navigation Links Section */}
      <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto custom-scrollbar">
        {filteredLinks.map((link) => (
          <Link key={link.name} to={link.path} className={linkClass(link.path)}>
            <link.icon size={18} /> {link.name}
          </Link>
        ))}
      </nav>

      {/* Logout Button Section */}
      <div className="mt-8 pt-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-200 hover:text-white hover:bg-red-600 transition-colors duration-200 w-full justify-start text-sm font-medium"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;