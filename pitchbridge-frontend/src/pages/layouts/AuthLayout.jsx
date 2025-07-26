// src/pages/layouts/AuthLayout.jsx - UPDATED FOR THEME

import React, { useState, useEffect } from 'react';

import AuthNavbar from '../../components/AuthNavbar';
import Sidebar from '../../components/Sidebar';

const AuthLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    return (
        // Apply theme-aware background here
        <div className="flex min-h-screen bg-theme-bg text-theme-text transition-colors duration-300">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    isSidebarOpen ? 'ml-64 md:ml-64' : 'ml-0 md:ml-20'
                }`}
            >
                <AuthNavbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-6 mt-16 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AuthLayout;