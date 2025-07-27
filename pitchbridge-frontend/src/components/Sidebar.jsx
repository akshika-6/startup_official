// src/components/Sidebar.jsx - CORRECTED IMPORT PATH FOR THEME CONTEXT

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // <-- THIS LINE IS CORRECTED
import {
    LogOut,
    Home as HomeIcon,
    LayoutDashboard,
    User,
    Settings,
    Info,
    Mail,
    Award, // Startup icon
    DollarSign, // Investors icon
    Rocket, // Explore Startups icon (for Investors)
    Briefcase,// My Investments icon (for Investors), or Investments (for Admin)
    Send,
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, sidebarWidthMd = '64', sidebarWidthMdClosed = '20' }) => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Assuming AuthNavbar has a height of h-16 (64px)
    const NAVBAR_HEIGHT_PX = 64; // In pixels for consistency
    const NAVBAR_HEIGHT_PT = 'pt-16'; // Corresponding Tailwind class for padding-top

    const handleLogoutClick = () => {
        logout();
        navigate('/login');
        if (window.innerWidth < 768) toggleSidebar();
    };

    const founderNavItems = [
        { name: 'Home', icon: HomeIcon, path: '/home-dashboard' },
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'My Startup', icon: Award, path: '/submit-pitch' },
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

    const handleUserInfoClick = () => {
        navigate('/profile');
        if (window.innerWidth < 768) toggleSidebar();
    };

    return (
        <>
            {/* Overlay for mobile when sidebar is open */}
            {isOpen && window.innerWidth < 768 && (
                <div
                    className="fixed inset-0 bg-black/30 z-[998] md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0
                    z-[999]
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    h-screen
                    shadow-lg
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${isOpen ? `w-${sidebarWidthMd}` : 'w-0'}

                    md:translate-x-0
                    md:w-${sidebarWidthMd}

                    ${theme === 'light'
                        ? 'bg-gradient-to-b from-[var(--gradient-sidebar-start-light)] to-[var(--gradient-sidebar-end-light)]'
                        : 'bg-gradient-to-b from-[var(--gradient-sidebar-start-dark)] to-[var(--gradient-sidebar-end-dark)]'
                    }
                `}
            >
                <div className={`${NAVBAR_HEIGHT_PT} flex flex-col flex-1`}>
                    {/* Top Branding Section */}
                    <div className="flex items-center justify-center pt-2 mb-6">
                        <Link
                            to="/home-dashboard"
                            className="text-white text-3xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-200"
                            onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
                        >
                            PitchBridge
                        </Link>
                    </div>

                    {/* User Info Section */}
                    {user && (
                        <div
                            className={`mb-6 mx-4 p-4 rounded-2xl backdrop-blur-sm shadow-lg cursor-pointer transition-colors duration-200
                                ${theme === 'light' ? 'bg-user-card-bg-light border-user-card-border-light hover:bg-white/20' : 'bg-user-card-bg-dark border-user-card-border-dark hover:bg-white/10'}
                                border
                            `}
                            onClick={handleUserInfoClick}
                            role="button"
                            tabIndex="0"
                            aria-label={`View profile for ${user.name || user.email}`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-3">
                                    {user.profilePic ? (
                                        <img
                                            src={user.profilePic}
                                            alt="User Profile"
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shadow-md"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shadow-md">
                                            <User size={24} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                <p className={`text-lg font-semibold mb-1 truncate max-w-full
                                    ${theme === 'light' ? 'text-user-card-text-light' : 'text-user-card-text-dark'}
                                `}>
                                    {user.name || user.email}
                                </p>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                    ${theme === 'light' ? 'bg-user-card-role-bg-light text-user-card-role-text-light border-white/30' : 'bg-user-card-role-bg-dark border-user-card-role-text-dark border-white/15'}
                                    border
                                `}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links Section */}
                    <nav
                        className="flex-1 px-4 overflow-y-auto"
                    >
                        <div className="space-y-1">
                            {currentNavItems.map((item) => {
                                const isActive = location.pathname === item.path;

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
                                        className={`
                                            flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium group
                                            ${isActive
                                                ? `${theme === 'light' ? 'bg-nav-item-active-bg-light text-nav-item-text-light' : 'bg-nav-item-active-bg-dark text-nav-item-text-dark'} shadow-lg border border-white/30`
                                                : `${theme === 'light' ? 'text-nav-item-text-light hover:text-white hover:bg-nav-item-hover-bg-light' : 'text-nav-item-text-dark hover:text-white-dark-mode-if-different hover:bg-nav-item-hover-bg-dark'} hover:shadow-md`
                                            }
                                        `}
                                    >
                                        <div className={`
                                            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                                            ${isActive
                                                ? `${theme === 'light' ? 'bg-white/20' : 'bg-white/10'}`
                                                : `${theme === 'light' ? 'group-hover:bg-white/10' : 'group-hover:bg-white/5'}`
                                            }
                                        `}>
                                            <item.icon size={18} className={`flex-shrink-0 ${theme === 'light' ? 'text-white' : 'text-nav-item-text-dark'}`} />
                                        </div>
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Logout Button Section */}
                    <div className="p-4">
                        <button
                            onClick={handleLogoutClick}
                            className={`
                                w-full flex items-center gap-4 px-4 py-3 rounded-xl
                                transition-all duration-200 text-base font-medium
                                shadow-md hover:shadow-lg
                                ${theme === 'light'
                                    ? 'text-logout-btn-text-light bg-logout-btn-bg-light hover:bg-logout-btn-hover-bg-light border-logout-btn-border-light hover:border-white/40'
                                    : 'text-logout-btn-text-dark bg-logout-btn-bg-dark hover:bg-logout-btn-hover-bg-dark border-logout-btn-border-dark hover:border-white/20'
                                }
                                border
                            `}
                        >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg
                                ${theme === 'light' ? 'bg-logout-btn-icon-bg-light' : 'bg-logout-btn-icon-bg-dark'}
                            `}>
                                <LogOut size={18} className={`flex-shrink-0 ${theme === 'light' ? 'text-white' : 'text-logout-btn-text-dark'}`} />
                            </div>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;