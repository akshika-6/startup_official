// src/components/AuthNavbar.jsx - UPDATED TO USE CUSTOM THEME CLASSES

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Bell, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const AuthNavbar = ({ toggleSidebar, navbarHeight }) => {
    // menuOpen state is not currently used for a mobile menu dropdown in this specific AuthNavbar
    // but can be kept if you plan to add one.
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth(); // Assuming logout is handled elsewhere or not directly in this snippet

    return (
        <nav
            // Replaced hardcoded bg/text colors with theme-aware custom utilities
            className={`
                bg-theme-nav-bg text-theme-text shadow-md
                transition duration-300
                h-${navbarHeight} flex items-center justify-between px-4 sm:px-6 lg:px-8
                w-full
            `}
        >
            {/* Mobile-only: Sidebar Toggle Button */}
            <div className="flex items-center md:hidden">
                <button
                    onClick={toggleSidebar}
                    // Apply theme-aware text color
                    className="text-theme-text focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={28} />
                </button>
            </div>

            {/* Desktop: Branding or main links - Dashboard text removed */}
            <div className="hidden md:flex flex-1 justify-start items-center">
                <span className="text-2xl font-bold text-theme-heading-primary">
                    {/* You can add a logo or different branding here if needed. */}
                </span>
            </div>

            {/* Right-side: User-related actions, notifications, theme toggle */}
            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Link
                    to="/notifications" // Assumes /notifications is an absolute path from root
                    // Apply theme-aware text color and hover states
                    className="text-theme-text-secondary hover:text-blue-500 dark:hover:text-blue-300 p-2 rounded-full hover:bg-theme-card-hover-bg-light transition-colors"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                </Link>

                {/* Messages Link */}
                <Link
                    to="/messages" // Assumes /messages is an absolute path from root
                    // Apply theme-aware text color and hover states
                    className="flex items-center text-lg font-medium text-theme-text-secondary hover:text-blue-500 dark:hover:text-blue-300 p-2 rounded-full hover:bg-theme-card-hover-bg-light transition-colors"
                    aria-label="Messages"
                >
                    <MessageSquare size={20} className="mr-2" />
                    {/* Message text intentionally omitted */}
                </Link>

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    // Apply theme-aware text color and hover states
                    className="p-2 rounded-full hover:bg-theme-card-hover-bg-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-theme-text" // Added text-theme-text for icon color
                    aria-label="Toggle dark mode"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </nav>
    );
};

export default AuthNavbar;