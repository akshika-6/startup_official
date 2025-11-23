// import express from 'express';
// import {
//   sendMessage,
//   getMessagesByPitch
// } from '../controllers/messagecontroller.mjs';
// import { protect } from '../middleware/auth.mjs';

// const router = express.Router();

// router.post('/', protect, sendMessage);
// router.get('/:pitchId', protect, getMessagesByPitch);

// export default router;

import express from 'express';
import { body, param } from 'express-validator';
import {
  sendMessage,
  getMessagesByPitch
} from '../controllers/messagecontroller.mjs';
import { protect } from '../middleware/auth.mjs';
import validateRequest from '../middleware/validateRequest.mjs';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('pitchId').isMongoId().withMessage('Invalid pitch ID'),
    body('receiverId').isMongoId().withMessage('Invalid receiver ID'),
    body('text')
      .isString()
      .notEmpty()
      .withMessage('Message text is required')
      .isLength({ max: 1000 })
      .withMessage('Message too long')
  ],
  validateRequest,
  sendMessage
);

router.get(
  '/:pitchId',
  protect,
  [param('pitchId').isMongoId().withMessage('Invalid pitch ID')],
  validateRequest,
  getMessagesByPitch
);

export default router;
