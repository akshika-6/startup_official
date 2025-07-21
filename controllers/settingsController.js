// controllers/settingsController.js
import { User } from '../Schema.mjs';
import bcrypt from 'bcryptjs';

// Change Username
export const updateUsername = async (req, res) => {
  const { username } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.username = username || user.username;
  await user.save();
  res.json({ message: 'Username updated successfully' });
};

// Change Email
export const updateEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.email = email || user.email;
  await user.save();
  res.json({ message: 'Email updated successfully' });
};

// Change Password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password updated successfully' });
};

// Update Profile Picture (can extend with Multer later)
export const updateProfilePicture = async (req, res) => {
  const { profilePicture } = req.body; // expect base64 or URL
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.profilePicture = profilePicture || user.profilePicture;
  await user.save();
  res.json({ message: 'Profile picture updated successfully' });
};

// Notification Preferences
export const updateNotificationPreferences = async (req, res) => {
  const { preferences } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.notificationPreferences = preferences || user.notificationPreferences;
  await user.save();
  res.json({ message: 'Notification preferences updated successfully' });
};

// Privacy Settings
export const updatePrivacySettings = async (req, res) => {
  const { privacy } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.privacySettings = privacy || user.privacySettings;
  await user.save();
  res.json({ message: 'Privacy settings updated successfully' });
};

// Delete Account
export const deleteAccount = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.remove();
  res.json({ message: 'Account deleted successfully' });
};
