// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react'; // Only useEffect is needed here now
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth along with AuthProvider

// Import your Navbar components
import AuthNavbar from './components/AuthNavbar'; // For public/auth pages
import Navbar from './components/Navbar';       // For logged-in pages (minimal top nav)
import Sidebar from './components/Sidebar';     // Your Sidebar component
import FullPageSpinner from './components/FullPageSpinner'; // Import the spinner

// Import all your page components
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


// This component defines the layout for all authenticated routes
const AuthenticatedLayout = () => {
  const { user, loading } = useAuth(); // Get user and loading from AuthContext
  const location = useLocation();

  if (loading) {
    return <FullPageSpinner />; // Show spinner while loading auth status
  }

  // If not loading and no user, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user is present, render the authenticated layout
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <Sidebar /> {/* Sidebar visible when logged in */}
      <main className="flex-1 p-6 overflow-y-auto mt-16 ml-64"> {/* mt-16 for Navbar, ml-64 for Sidebar */}
        <Outlet /> {/* Renders the specific nested route component */}
      </main>
    </div>
  );
};

// Main AppContent component that decides which Navbar and layout to show
const AppContent = () => {
  const { user, loading } = useAuth(); // <--- CONSUME user and loading from AuthContext
  const location = useLocation();

  // Define which paths are considered "public/auth"
  // These paths typically do not show the Sidebar.
  const publicAuthPaths = [
    '/', '/login', '/register', '/forgot-password',
    '/startups', '/startups/:id', '/faq', '/contact', '/investors',
    '/logout' // Logout page might be public, but it handles auth internally
  ];

  const isPublicAuthPath = publicAuthPaths.some(path => {
    if (path.includes(':')) {
      const regex = new RegExp(`^${path.split(':')[0]}(/.*)?$`);
      return regex.test(location.pathname);
    }
    return location.pathname === path;
  });

  // Conditional Navbar rendering based on path
  // If we are loading or on a public/auth path, show AuthNavbar.
  // Otherwise, show the minimal Navbar for logged-in users.
  const CurrentNavbar = (loading || isPublicAuthPath) ? <AuthNavbar /> : <Navbar />;

  return (
    <>
      {CurrentNavbar}

      <Routes>
        {/* Public & Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* Login page will handle setUser itself */}
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/startups" element={<Startups />} />
        <Route path="/startups/:id" element={<StartupDetail />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/investors" element={<ExploreInvestors />} />
        <Route path="/logout" element={<Logout />} />

        {/* PROTECTED ROUTES GROUP */}
        {/* All routes nested inside this <Route> will use AuthenticatedLayout */}
        <Route element={<AuthenticatedLayout />}>
          {/* Default redirect for logged-in users landing on root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboards based on role */}
          <Route
            path="/dashboard"
            element={
              user?.role === 'founder' ? <FounderDashboard /> :
              user?.role === 'investor' ? <InvestorDashboard /> :
              user?.role === 'admin' ? <AdminUsers /> : // Admins might have a default dashboard too
              <Navigate to="/login" replace /> // Fallback if role is unknown/invalid
            }
          />

          {/* General Protected Routes */}
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
      </Routes>
    </>
  );
};

// The main App component wraps AppContent with BrowserRouter and AuthProvider
const App = () => (
  <Router>
    {/* AuthProvider wraps AppContent, making auth context available throughout */}
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;