import express from 'express';
import {
  createPreference,
  getPreferences
} from '../controllers/Investorpreferencecontroller.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, createPreference);
router.get('/', getPreferences);

export default router;
