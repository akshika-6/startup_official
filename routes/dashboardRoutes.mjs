import express from 'express';
import { protect } from '../middleware/auth.mjs';
import { getDashboardCards } from '../controllers/dashboardController.mjs';

const router = express.Router();

router.get('/', protect, getDashboardCards);

export default router;

