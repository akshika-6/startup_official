// import express from 'express';
// import {
//   createNotification,
//   getNotificationsForUser
// } from '../controllers/notificationcontroller.mjs';
// import { protect } from '../middleware/auth.mjs';

// const router = express.Router();

// router.post('/', protect, createNotification);
// router.get('/:userId', protect, getNotificationsForUser);

// export default router;

import express from 'express';
import { body } from 'express-validator';
import {
  createNotification,
  getNotificationsForUser
} from '../controllers/notificationcontroller.mjs';
import { protect } from '../middleware/auth.mjs';
import validateRequest from '../middleware/validateRequest.mjs';

const router = express.Router();

// POST /api/notifications
router.post(
  '/',
  protect,
  [
    body('message')
      .notEmpty()
      .withMessage('Notification message is required'),
    body('type')
      .optional()
      .isString()
      .withMessage('Type must be a string')
  ],
  validateRequest,
  createNotification
);

// GET /api/notifications (get logged-in user's notifications)
router.get('/', protect, getNotificationsForUser);

export default router;

