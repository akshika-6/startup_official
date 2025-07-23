// src/pages/DeactivateAccountPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShieldOff, Loader2 } from 'lucide-react';

const DeactivateAccountPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDeactivate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!password) {
      setError('Please enter your password to confirm deactivation.');
      setIsLoading(false);
      return;
    }

    try {
      // --- IMPORTANT: Real Deactivation Logic Here ---
      // In a real application, you would:
      // 1. Send an API request to your backend to deactivate the account.
      // 2. The backend would verify the password and perform the deactivation.
      // 3. Upon success, the backend should usually log the user out.

      console.log("Attempting to deactivate account for user with password:", password);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Simulate successful deactivation
      setSuccessMessage('Your account has been successfully deactivated. You will be redirected shortly.');
      // In a real app, after successful API call and logout on backend,
      // you would perform client-side logout (e.g., clear tokens) and navigate.
      setTimeout(() => {
        // Example: If you have an AuthContext logout function:
        // logoutUser();
        navigate('/'); // Redirect to home or login page after deactivation
      }, 3000);

    } catch (err) {
      console.error("Deactivation failed:", err);
      setError('Failed to deactivate account. Please check your password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-theme-bg-content text-theme-text p-4">
      <div className="bg-theme-card-bg rounded-lg shadow-xl p-6 md:p-8 w-full max-w-lg border border-theme-border">
        <div className="flex justify-between items-center mb-6 border-b border-theme-border pb-4">
          <h2 className="text-2xl font-bold text-theme-heading-primary flex items-center gap-2">
            <ShieldOff className="w-6 h-6 text-red-600" aria-hidden="true" /> Account Deactivation
          </h2>
          <button
            onClick={() => navigate('/profile')} // Go back to profile (assuming /profile is its route)
            className="text-theme-text-secondary hover:text-theme-heading-primary transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-theme-text-secondary mb-6 leading-relaxed">
          Deactivating your account is a permanent action. All your data, including your profile, messages, and associated content, will be irreversibly deleted. Please confirm your decision by entering your password below.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 flex items-center gap-2" role="alert">
            <X className="w-5 h-5" aria-hidden="true" /> {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 flex items-center gap-2" role="status">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleDeactivate}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-theme-text-secondary text-sm font-medium mb-2">
              Enter your password to confirm:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-theme-input-bg border border-theme-border focus:ring-2 focus:ring-red-500 outline-none text-theme-text text-lg"
              placeholder="Your password"
              required
              aria-required="true"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile')} // Go back to profile
              className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                'Deactivate My Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeactivateAccountPage;