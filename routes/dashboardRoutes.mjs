// routes/dashboardRoutes.mjs
import express from 'express';
import { getDashboard } from '../controllers/dashboardController.mjs';
import { authorizeRoles } from '../middleware/auth.mjs';

const router = express.Router();

// GET /api/dashboard
router.get('/', authenticateUser, getDashboard);

export default router;
