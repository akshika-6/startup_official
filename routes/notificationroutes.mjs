import express from 'express';
import {
  createNotification,
  getNotificationsForUser
} from '../controllers/notificationcontroller.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, createNotification);
router.get('/:userId', protect, getNotificationsForUser);

export default router;
