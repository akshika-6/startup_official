import express from 'express';
import {
  createPitch,
  getAllPitches,
  updatePitchStatus
} from '../controllers/pitchcontroller.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, createPitch);
router.get('/', getAllPitches);
router.put('/:id/status', protect, updatePitchStatus);

export default router;
