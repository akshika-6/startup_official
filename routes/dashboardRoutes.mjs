import express from 'express';
import { getDashboard } from '../controllers/dashboardController.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

// GET /api/dashboard
router.get('/', protect, getDashboard);

export default router;

