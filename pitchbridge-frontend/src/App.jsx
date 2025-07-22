// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { AuthProvider } from './context/AuthContext'; // Ensure AuthProvider is imported

// Import your Navbar components
import AuthNavbar from './components/AuthNavbar'; // For public/auth pages
import Navbar from './components/Navbar';       // For logged-in pages (minimal top nav)
import Sidebar from './components/Sidebar';     // Your Sidebar component

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


// AppContent component: Manages state, location, and conditional rendering
const AppContent = () => {
  const [user, setUser] = useState(null);
  const location = useLocation(); // To get the current URL path

  // Effect to check user token and set user state on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => {
        setUser(null); // Clear user if token is invalid or request fails
        localStorage.removeItem('token'); // Also clear invalid token
        localStorage.removeItem('user');  // Also clear invalid user data
      });
    } else {
      setUser(null); // Ensure user is null if no token exists
    }
  }, []); // Run only once on mount

  // Define which paths are considered "public/auth" and should get the AuthNavbar
  const publicAuthPaths = [
    '/', '/login', '/register', '/forgot-password',
    '/startups', '/startups/:id', '/faq', '/contact', '/investors'
  ];
  const isPublicAuthPath = publicAuthPaths.some(path => {
    // For dynamic routes like /startups/:id, we need to use a regex or check if it starts with
    if (path.includes(':')) {
      const regex = new RegExp(`^${path.split(':')[0]}(/.*)?$`);
      return regex.test(location.pathname);
    }
    return location.pathname === path;
  });


  return (
    // AuthProvider should wrap all components that need access to authentication context
    <AuthProvider value={{ user, setUser }}>
      {/* Conditionally renders AuthNavbar for public/auth routes, else renders the minimal Navbar */}
      {isPublicAuthPath ? <AuthNavbar /> : <Navbar />}

      {/* Conditional Rendering of Layouts: Sidebar+Content for logged in, or just content for public */}
      {user && !isPublicAuthPath ? (
        // Layout for logged-in users: Sidebar and main content area
        <div className="flex bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
          {/* The Sidebar is now fixed and positioned using top-16, so the flex container doesn't need pt-16 */}
          {/* Main content needs to account for the sidebar's width by adding left padding/margin */}
          <Sidebar /> {/* Sidebar visible only when logged in */}
          <main className="flex-1 p-6 overflow-y-auto mt-16 ml-64"> {/* mt-16 to clear top Navbar, ml-64 to clear sidebar */}
            <Routes>
              {/* --- Logged-In User Routes (will appear next to Sidebar) --- */}
              {/* Dashboard routes, role-specific */}
              <Route
                path="/dashboard"
                element={
                  user.role === 'founder' ? <FounderDashboard /> :
                  user.role === 'investor' ? <InvestorDashboard /> :
                  <Navigate to="/" replace />
                }
              />

              {/* Other general protected routes */}
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/messages" element={<Messages user={user} />} />
              <Route path="/notifications" element={<Notifications user={user} />} />
              <Route path="/submit-pitch" element={user.role === 'founder' ? <SubmitPitch user={user} /> : <Navigate to="/dashboard" replace />} />
              <Route path="/create-startup" element={user.role === 'founder' ? <CreateStartup user={user} /> : <Navigate to="/dashboard" replace />} />
              <Route path="/investor-deck" element={user.role === 'investor' ? <InvestorDeck user={user} /> : <Navigate to="/dashboard" replace />} />
              <Route path="/rate-startups" element={user.role === 'investor' ? <RateStartup user={user} /> : <Navigate to="/dashboard" replace />} />
              <Route path="/add-startup" element={user.role === 'founder' ? <AddStartup user={user} /> : <Navigate to="/dashboard" replace />} />
              <Route path="/logout" element={<Logout />} />


              {/* Settings and its Sub-Routes (typically protected and within sidebar context) */}
              <Route path="/settings" element={<Settings user={user} />} />
              <Route path="/settings/username" element={<ChangeUsername />} />
              <Route path="/settings/email" element={<ChangeEmail />} />
              <Route path="/settings/password" element={<ChangePassword />} />
              <Route path="/settings/profile-picture" element={<UpdateProfilePicture />} />
              <Route path="/settings/notifications" element={<NotificationSettings />} />
              <Route path="/settings/privacy" element={<PrivacySettings />} />
              <Route path="/settings/delete" element={<DeleteAccount />} />

              {/* Admin Routes (protected by role) */}
              <Route path="/admin/users" element={user.role === 'admin' ? <AdminUsers user={user} /> : <Navigate to="/dashboard" replace />} />
              <Route path="/admin/activity" element={user.role === 'admin' ? <AdminActivity user={user} /> : <Navigate to="/dashboard" replace />} />

              {/* Redirects for logged-in users trying to access public auth pages */}
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/register" element={<Navigate to="/dashboard" replace />} />
              <Route path="/forgot-password" element={<Navigate to="/dashboard" replace />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/startups" element={<Navigate to="/dashboard" replace />} />
              <Route path="/startups/:id" element={<Navigate to="/dashboard" replace />} />
              <Route path="/faq" element={<Navigate to="/dashboard" replace />} />
              <Route path="/contact" element={<Navigate to="/dashboard" replace />} />
              <Route path="/investors" element={<Navigate to="/dashboard" replace />} />


              {/* Catch-all for protected routes that don't match */}
              <Route path="*" element={<div>Protected 404 Not Found</div>} />
            </Routes>
          </main>
        </div>
      ) : (
        // Layout for public/unauthenticated users: just content below Navbar
        <div className="pt-16 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <Routes>
            {/* --- Public & Auth Routes (visible to everyone, outside sidebar layout) --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/startups" element={<Startups />} />
            <Route path="/startups/:id" element={<StartupDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/investors" element={<ExploreInvestors />} />

            {/* --- Redirect unauthenticated users trying to access protected routes --- */}
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/profile" element={<Navigate to="/login" replace />} />
            <Route path="/messages" element={<Navigate to="/login" replace />} />
            <Route path="/submit-pitch" element={<Navigate to="/login" replace />} />
            <Route path="/create-startup" element={<Navigate to="/login" replace />} />
            <Route path="/notifications" element={<Navigate to="/login" replace />} />
            <Route path="/rate-startups" element={<Navigate to="/login" replace />} />
            <Route path="/investor-deck" element={<Navigate to="/login" replace />} />
            <Route path="/add-startup" element={<Navigate to="/login" replace />} />
            <Route path="/settings/*" element={<Navigate to="/login" replace />} />
            <Route path="/admin/*" element={<Navigate to="/login" replace />} />
            <Route path="/logout" element={<Navigate to="/login" replace />} />

            {/* Catch-all for public routes that don't match */}
            <Route path="*" element={<div>Public 404 Not Found</div>} />
          </Routes>
        </div>
      )}
    </AuthProvider>
  );
};

// The main App component just wraps AppContent with BrowserRouter
const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;