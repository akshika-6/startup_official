import express from 'express';
import {
  createStartup,
  getAllStartups,
  getStartupById
} from '../controllers/startupcontroller.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, createStartup);
router.get('/', getAllStartups);
router.get('/:id', getStartupById);

export default router;
