// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "../context/AuthContext"; // Adjust path as needed, assuming context is in src/context
import { useNavigate } from 'react-router-dom';
import {
  Mail, User, Briefcase, Edit, Save, X, Lock, Bell, ChevronRight, Shield,
  Phone, MapPin, MessageSquare, Loader2, Image // Added Image icon for photo
} from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl || null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setProfileImage(user.profileImageUrl || null);
    }
  }, [user]);

  const handleSave = async () => {
    setStatusMessage('');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await updateUserProfile({
        name,
        email,
        bio,
        phone,
        location,
        profileImageUrl: profileImage
      });
      setStatusMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setStatusMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setBio(user?.bio || '');
    setPhone(user?.phone || '');
    setLocation(user?.location || '');
    setProfileImage(user?.profileImageUrl || null);
    setIsEditing(false);
    setStatusMessage('');
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoChangeClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex-grow p-4 md:p-8 bg-theme-bg-content text-theme-text min-h-[calc(100vh-64px)] overflow-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header & Avatar Section */}
        <div className="bg-gradient-to-br from-blue-700 to-purple-800 rounded-lg shadow-xl p-6 md:p-8 text-white relative overflow-hidden">
          {/* Subtle background pattern/gradient overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zm0-30V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
            aria-hidden="true"
          ></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Profile Avatar with dynamic image or initials */}
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Avatar"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                <span className="sr-only">User Avatar: </span>
                {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-extrabold mb-2 leading-tight">
                Hello, {user?.name || 'User'}!
              </h1>
              <p className="text-blue-100 text-lg">
                Manage your personal information and public profile.
              </p>
            </div>
          </div>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
            aria-label="Upload new profile photo"
          />
          {/* Button to trigger file input */}
          <button
            onClick={handlePhotoChangeClick}
            className="absolute bottom-4 right-4 bg-white text-blue-700 px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-blue-50 transition flex items-center gap-2"
            aria-label="Change Profile Photo"
          >
            <Image className="w-4 h-4" aria-hidden="true" /> Change Photo
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`flex items-center gap-2 mb-4 p-3 rounded-md text-sm ${
              statusMessage.includes('successfully')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
            role="status"
            aria-live="polite"
          >
            {statusMessage.includes('successfully') ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <X className="w-5 h-5" aria-hidden="true" />
            )}
            {statusMessage}
          </div>
        )}

        {/* Basic & Contact Information Section */}
        <div className="bg-theme-card-bg rounded-lg shadow-xl p-6 md:p-8 border border-theme-border">
          <div className="flex justify-between items-center mb-6 border-b border-theme-border pb-4">
            <h2 className="text-2xl font-bold text-theme-heading-primary">Your Details</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold transition"
                aria-label="Edit Profile"
              >
                <Edit className="w-5 h-5" aria-hidden="true" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 text-theme-text-secondary hover:text-theme-heading-primary font-semibold transition px-3 py-2 rounded-md"
                  aria-label="Cancel Profile Edit"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Save Profile Changes"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Save className="w-5 h-5" aria-hidden="true" />
                  )}
                  <span>{isLoading ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="fullName" className="text-theme-text-secondary text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" aria-hidden="true" /> Full Name
              </label>
              {isEditing ? (
                <input
                  id="fullName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-md bg-theme-input-bg border border-theme-border focus:ring-2 focus:ring-blue-500 outline-none text-theme-text text-lg"
                  placeholder="Your Name"
                  aria-invalid={!name ? 'true' : 'false'}
                />
              ) : (
                <p className="text-theme-text text-lg font-medium">{user?.name || 'Not Set'}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label htmlFor="emailAddress" className="text-theme-text-secondary text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" aria-hidden="true" /> Email Address
              </label>
              {isEditing ? (
                <input
                  id="emailAddress"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-md bg-theme-input-bg border border-theme-border focus:ring-2 focus:ring-blue-500 outline-none text-theme-text text-lg"
                  placeholder="your.email@example.com"
                  aria-invalid={!email || !email.includes('@') ? 'true' : 'false'}
                />
              ) : (
                <p className="text-theme-text text-lg font-medium">{user?.email || 'Not Set'}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label htmlFor="phoneNumber" className="text-theme-text-secondary text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" aria-hidden="true" /> Phone Number
              </label>
              {isEditing ? (
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-md bg-theme-input-bg border border-theme-border focus:ring-2 focus:ring-blue-500 outline-none text-theme-text text-lg"
                  placeholder="e.g., +1 (555) 123-4567"
                />
              ) : (
                <p className="text-theme-text text-lg font-medium">{user?.phone || 'Not Set'}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label htmlFor="location" className="text-theme-text-secondary text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" aria-hidden="true" /> Location
              </label>
              {isEditing ? (
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 rounded-md bg-theme-input-bg border border-theme-border focus:ring-2 focus:ring-blue-500 outline-none text-theme-text text-lg"
                  placeholder="e.g., New York, USA"
                />
              ) : (
                <p className="text-theme-text text-lg font-medium">{user?.location || 'Not Set'}</p>
              )}
            </div>

            {/* Role (Static Display) */}
            <div className="space-y-1">
              <label className="text-theme-text-secondary text-sm font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" aria-hidden="true" /> Your Role
              </label>
              <p className="text-theme-text text-lg font-medium capitalize">{user?.role || 'Not Set'}</p>
            </div>

            {/* Joined On (Static Display) */}
            <div className="space-y-1">
              <label className="text-theme-text-secondary text-sm font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" aria-hidden="true" /> Joined On
              </label>
              <p className="text-theme-text text-lg font-medium">
                {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            {/* Bio (Full width) */}
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="bio" className="text-theme-text-secondary text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" aria-hidden="true" /> Bio / About Me
              </label>
              {isEditing ? (
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  className="w-full p-3 rounded-md bg-theme-input-bg border border-theme-border focus:ring-2 focus:ring-blue-500 outline-none text-theme-text text-lg resize-y"
                  placeholder="Tell us a little about yourself..."
                ></textarea>
              ) : (
                <p className="text-theme-text text-lg font-medium whitespace-pre-wrap">{user?.bio || 'Not Set'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Management Section */}
        <div className="bg-theme-card-bg rounded-lg shadow-xl p-6 md:p-8 border border-theme-border">
          <h2 className="text-2xl font-bold text-theme-heading-primary mb-6 border-b border-theme-border pb-4">
            Account Management
          </h2>
          <p className="text-theme-text-secondary mb-4">
            For advanced settings like changing your password, managing notifications, or other account actions, please visit the dedicated settings page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
              aria-label="Go to Settings page"
            >
              <Bell className="w-5 h-5" aria-hidden="true" /> Go to Settings
            </button>
            <button
              onClick={() => navigate('/settings/delete')} // Navigates to the DeleteAccount component
              className="flex items-center gap-3 bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition"
              aria-label="Delete Account" // Changed label
            >
              <X className="w-5 h-5" aria-hidden="true" /> Delete Account {/* Changed button text */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;