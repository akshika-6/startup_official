import express from 'express';
import {
  createMeeting,
  getMeetingsByPitch
} from '../controllers/meetingcontroller.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, createMeeting);
router.get('/:pitchId', protect, getMeetingsByPitch);

export default router;
