import express from 'express';
import {
  updateUsername,
  updateEmail,
  updatePassword,
  updateProfilePicture,
  updateNotificationPreferences,
  updatePrivacySettings,
  deleteAccount,
} from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/username', protect, updateUsername);
router.put('/email', protect, updateEmail);
router.put('/password', protect, updatePassword);
router.put('/profile-picture', protect, updateProfilePicture);
router.put('/notifications', protect, updateNotificationPreferences);
router.put('/privacy', protect, updatePrivacySettings);
router.delete('/delete', protect, deleteAccount);

export default router;
