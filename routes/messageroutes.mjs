import express from 'express';
import {
  sendMessage,
  getMessagesByPitch
} from '../controllers/messagecontroller.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:pitchId', protect, getMessagesByPitch);

export default router;
