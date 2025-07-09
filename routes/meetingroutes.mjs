// import express from 'express';
// import {
//   createMeeting,
//   getMeetingsByPitch
// } from '../controllers/meetingcontroller.mjs';
// import { protect } from '../middleware/auth.mjs';

// const router = express.Router();

// router.post('/', protect, createMeeting);
// router.get('/:pitchId', protect, getMeetingsByPitch);

// export default router;
import express from 'express';
import { body, param } from 'express-validator';
import {
  createMeeting,
  getMeetingsByPitch
} from '../controllers/meetingcontroller.mjs';
import { protect } from '../middleware/auth.mjs';
import validateRequest from '../middleware/validateRequest.mjs';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('pitchId').isMongoId().withMessage('Invalid pitch ID'),
    body('scheduledTime').isISO8601().withMessage('Invalid meeting date'),
    body('link').isURL().withMessage('Meeting link must be a valid URL')
  ],
  validateRequest,
  createMeeting
);

router.get(
  '/:pitchId',
  protect,
  [param('pitchId').isMongoId().withMessage('Invalid pitch ID')],
  validateRequest,
  getMeetingsByPitch
);

export default router;

