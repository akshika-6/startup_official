// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Try to get theme from localStorage, default to 'light'
    const storedTheme = localStorage.getItem('theme');
    // Check for user's system preference if no theme is stored
    if (storedTheme) {
      return storedTheme;
    }
    // Fallback to system preference if no stored theme
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement; // Get the <html> element
    if (theme === 'dark') {
      root.classList.add('dark'); // Add the 'dark' class
      localStorage.setItem('theme', 'dark'); // Save preference
    } else {
      root.classList.remove('dark'); // Remove the 'dark' class
      localStorage.setItem('theme', 'light'); // Save preference
    }
  }, [theme]); // Re-run effect when theme changes

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) { // Or `if (!context)` works too
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};