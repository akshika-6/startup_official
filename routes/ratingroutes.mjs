import express from 'express';
import {
  giveRating,
  getRatingsForStartup
} from '../controllers/ratingcontroller.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, giveRating);
router.get('/:startupId', getRatingsForStartup);

export default router;
