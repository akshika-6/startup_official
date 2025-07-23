// src/App.jsx - CORRECTED & VERIFIED
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import your Navbar components
import AuthNavbar from './components/AuthNavbar'; // For public/auth pages
import Navbar from './components/Navbar'; // Standard authenticated navbar with sidebar
import DashboardHomeNavbar from './components/DashboardHomeNavbar'; // Specific navbar for /home-dashboard
import Sidebar from './components/Sidebar';
import FullPageSpinner from './components/FullPageSpinner';

// Import all your page components (ensure these paths are correct)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Startups from './pages/Startups';
import StartupDetail from './pages/StartupDetail';
import SubmitPitch from './pages/SubmitPitch';
import Notifications from './pages/Notifications';
import RateStartup from './pages/RateStartup';
import CreateStartup from './pages/CreateStartup';

import AdminUsers from './pages/admin/Users';
import AdminActivity from './pages/admin/Activity';

import InvestorDeck from './pages/InvestorDeck';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Logout from './pages/Logout';

import DashboardInstructions from './pages/dashboard/DashboardInstructions'; // This is your default dashboard WITH sidebar
import DashboardHome from './pages/dashboard/DashboardHome'; // This is your full-screen dashboard WITHOUT sidebar

import FounderDashboard from './pages/dashboard/FounderDashboard';
import InvestorDashboard from './pages/dashboard/InvestorDashboard';

import ExploreInvestors from './pages/ExploreInvestors';
import AddStartup from './pages/AddStartup';

import Settings from './pages/Settings';
import ChangePassword from './pages/settings/ChangePassword';
import ChangeEmail from './pages/settings/ChangeEmail';
import ChangeUsername from './pages/settings/ChangeUsername';
import UpdateProfilePicture from './pages/settings/UpdateProfilePicture';
import NotificationSettings from './pages/settings/NotificationSettings';
import PrivacySettings from './pages/settings/PrivacySettings';
import DeleteAccount from './pages/settings/DeleteAccount';


// This component defines the layout for all authenticated routes *that use the sidebar*
const AuthenticatedLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullPageSpinner />;
  }

  // If user is not authenticated, redirect to login page.
  // This catches direct access to protected routes without a session.
  if (!user) {
    console.log(`AuthenticatedLayout: User not found, redirecting to /login from ${location.pathname}`); // Debugging
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen">
      <Sidebar /> {/* Sidebar is rendered here for all AuthenticatedLayout routes */}
      <main className="flex-1 p-6 overflow-y-auto pt-20 md:ml-64"> {/* Adjust pt-xx for your Navbar height */}
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
};

// Main AppContent component that decides which Navbar and layout to show
const AppContent = () => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext
  const location = useLocation();

  // Paths that typically use AuthNavbar (public or auth-related)
  const publicAuthPaths = [
    '/', '/login', '/register', '/forgot-password',
    '/startups', '/startups/:id', '/faq', '/contact', '/investors',
    '/logout'
  ];

  // Helper to check if the current path is one of the public/auth paths
  const isPublicAuthPath = publicAuthPaths.some(path => {
    if (path.includes(':')) {
      const regex = new RegExp(`^${path.replace(/:\w+/g, '[^/]+')}(/.*)?$`);
      return regex.test(location.pathname);
    }
    return location.pathname === path;
  });

  // Determine which Navbar to render based on the current path and auth status
  let CurrentNavbarComponent = null;
  if (loading) {
      // Don't render any specific Navbar while auth status is loading to avoid flashes
      CurrentNavbarComponent = null;
  } else if (location.pathname === '/home-dashboard' && user) {
    // 5. For the specific full-screen dashboard home (DashboardHome.jsx)
    CurrentNavbarComponent = <DashboardHomeNavbar />;
  } else if (isPublicAuthPath) {
    // For public and authentication-related pages
    CurrentNavbarComponent = <AuthNavbar />;
  } else if (user) {
    // For all other authenticated pages that use the sidebar (e.g., /dashboard, /profile)
    CurrentNavbarComponent = <Navbar />;
  } else {
    // Fallback for unauthenticated users on non-public paths (should mostly be caught by AuthenticatedLayout)
    CurrentNavbarComponent = <AuthNavbar />;
  }


  return (
    <>
      {CurrentNavbarComponent} {/* Conditionally render the appropriate Navbar */}

      <Routes>
        {/*
          1. Initial Load (`/`) -> Home.jsx (public)
          If user is logged in and lands on '/', navigate to /dashboard (your default authenticated view).
          Otherwise, show Home component.
        */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Home />}
        />

        {/* Public & Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/startups" element={<Startups />} />
        <Route path="/startups/:id" element={<StartupDetail />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/investors" element={<ExploreInvestors />} />
        <Route path="/logout" element={<Logout />} />

        {/*
          Route for DashboardHome.jsx (full-screen, no sidebar).
          This is outside AuthenticatedLayout because it doesn't use the sidebar.
        */}
        <Route
          path="/home-dashboard"
          element={
            user ? ( // Simple check if user is logged in
              <DashboardHome />
            ) : (
              // If user tries to access /home-dashboard directly when logged out
              <Navigate to="/login" replace state={{ from: location.pathname }} />
            )
          }
        />

        {/*
          PROTECTED ROUTES GROUP (for pages WITH Sidebar and standard Navbar)
          All routes nested here will automatically get the Sidebar and the 'Navbar' component.
        */}
        <Route element={<AuthenticatedLayout />}>

          {/* 3. Default dashboard landing page (INSTRUCTIONS ONLY) - uses sidebar */}
          {/* 4. Sidebar "Dashboard" button points here */}
          <Route path="/dashboard" element={<DashboardInstructions />} />

          {/* Specific role-based dashboards if they are *different* from DashboardInstructions and DashboardHome */}
          <Route path="/dashboard/founder" element={user?.role === 'founder' ? <FounderDashboard /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard/investor" element={user?.role === 'investor' ? <InvestorDashboard /> : <Navigate to="/dashboard" replace />} />

          {/* General Protected Routes that use the sidebar */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Founder Specific Routes */}
          <Route path="/submit-pitch" element={user?.role === 'founder' ? <SubmitPitch /> : <Navigate to="/dashboard" replace />} />
          <Route path="/create-startup" element={user?.role === 'founder' ? <CreateStartup /> : <Navigate to="/dashboard" replace />} />
          <Route path="/add-startup" element={user?.role === 'founder' ? <AddStartup /> : <Navigate to="/dashboard" replace />} />

          {/* Investor Specific Routes */}
          <Route path="/investor-deck" element={user?.role === 'investor' ? <InvestorDeck /> : <Navigate to="/dashboard" replace />} />
          <Route path="/rate-startups" element={user?.role === 'investor' ? <RateStartup /> : <Navigate to="/dashboard" replace />} />

          {/* Settings and its Sub-Routes */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/username" element={<ChangeUsername />} />
          <Route path="/settings/email" element={<ChangeEmail />} />
          <Route path="/settings/password" element={<ChangePassword />} />
          <Route path="/settings/profile-picture" element={<UpdateProfilePicture />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/settings/privacy" element={<PrivacySettings />} />
          <Route path="/settings/delete" element={<DeleteAccount />} />

          {/* Admin Routes */}
          <Route path="/admin/users" element={user?.role === 'admin' ? <AdminUsers /> : <Navigate to="/dashboard" replace />} />
          <Route path="/admin/activity" element={user?.role === 'admin' ? <AdminActivity /> : <Navigate to="/dashboard" replace />} />

          {/* Fallback for protected routes - if a path is matched, but user is not authorized or path doesn't exist */}
          <Route path="*" element={<div>Protected Route: 404 Not Found or Unauthorized Access</div>} />
        </Route>

        {/* Catch-all for any other unmatched public routes */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  </Router>
);

export default App;