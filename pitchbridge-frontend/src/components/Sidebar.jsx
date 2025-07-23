// src/components/Sidebar.jsx - ENHANCED WITH ORIGINAL COLORS
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Home as HomeIcon,
  LayoutDashboard,
  User,
  Settings,
  Info,
  Mail,
  Award,
  DollarSign,
  Rocket,
  Briefcase,
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    navigate('/logout');
    logout();
  };

  // Define nav items for each role
  const founderNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/home-dashboard' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Startup', icon: Award, path: '/startup-actions' },
    { name: 'Explore Investors', icon: DollarSign, path: '/investors' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Help', icon: Info, path: '/faq' },
    { name: 'Contact Us', icon: Mail, path: '/contact' },
  ];

  const investorNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/home-dashboard' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Investments', icon: Briefcase, path: '/my-investments' },
    { name: 'Explore Startups', icon: Rocket, path: '/startups' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Help', icon: Info, path: '/faq' },
    { name: 'Contact Us', icon: Mail, path: '/contact' },
  ];

  const adminNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/home-dashboard' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Startups', icon: Award, path: '/admin/startups' },
    { name: 'Investments', icon: Briefcase, path: '/admin/investments' },
    { name: 'Explore Startups', icon: Rocket, path: '/startups' },
    { name: 'Explore Investors', icon: DollarSign, path: '/investors' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Help', icon: Info, path: '/faq' },
    { name: 'Contact Us', icon: Mail, path: '/contact' },
  ];

  // Determine which nav items to display based on user role
  let currentNavItems = [];
  if (user) {
    switch (user.role) {
      case 'founder':
        currentNavItems = founderNavItems;
        break;
      case 'investor':
        currentNavItems = investorNavItems;
        break;
      case 'admin':
        currentNavItems = adminNavItems;
        break;
      default:
        currentNavItems = [];
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 text-white flex flex-col transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                    pt-16`}
        style={{
          background: 'linear-gradient(180deg, #4F46E5 0%, #6366F1 100%)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Top Branding Section */}
        <div className="flex items-center justify-center h-16 mt-2 mb-6">
          <Link 
            to="/home-dashboard" 
            className="text-3xl font-extrabold text-white tracking-wide hover:scale-105 transition-transform duration-200"
          >
            PitchBridge
          </Link>
        </div>

        {/* User Info Section */}
        {user && (
          <div className="mb-6 mx-4 p-4 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shadow-md">
                  <User size={24} className="text-white" />
                </div>
              </div>
              <p className="text-lg font-semibold text-white/95 mb-1 truncate max-w-full">
                {user.name || user.email}
              </p>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white/90 border border-white/30 capitalize">
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-4 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}>
          <div className="space-y-1">
            {currentNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={toggleSidebar}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium group
                    ${isActive
                      ? 'bg-white/25 text-white shadow-lg border border-white/30' 
                      : 'text-white/90 hover:text-white hover:bg-white/15 hover:shadow-md'
                    }
                  `}
                >
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                    ${isActive ? 'bg-white/20' : 'group-hover:bg-white/10'}
                  `}>
                    <item.icon size={18} className="flex-shrink-0" />
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button - No border line, seamlessly integrated */}
        <div className="p-4">
          <button
            onClick={handleLogoutClick}
            className="
              w-full flex items-center gap-4 px-4 py-3 rounded-xl
              text-red-100 hover:text-white
              bg-red-600/20 hover:bg-red-600/30
              border border-red-400/30 hover:border-red-400/50
              transition-all duration-200 text-base font-medium
              shadow-md hover:shadow-lg
            "
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20">
              <LogOut size={18} className="flex-shrink-0" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;