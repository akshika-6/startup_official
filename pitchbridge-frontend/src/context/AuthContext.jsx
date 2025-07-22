// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
// No need for useNavigate or axios imports here if login logic is outside this context
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { API_BASE_URL } from '../config'; // Assuming your API_BASE_URL is used elsewhere

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user to null
  const [loading, setLoading] = useState(true); // <--- NEW: Add loading state, initially true

  // This useEffect runs once on component mount to check localStorage for user data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem('user'); // Clear invalid data
        setUser(null);
      }
    }
    setLoading(false); // <--- IMPORTANT: Set loading to false AFTER checking localStorage
  }, []); // Empty dependency array means this runs only once on mount

  // This useEffect runs whenever 'user' state changes, to save it to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user'); // Also remove if user logs out or is set to null
    }
  }, [user]);

  const logout = () => {
    setUser(null); // Clear user state
    // localStorage.removeItem('user'); // This will be handled by the useEffect above
  };

  // Memoize the context value to prevent unnecessary re-renders of consuming components
  const authContextValue = useMemo(() => ({ user, setUser, logout, loading }), [user, setUser, logout, loading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};