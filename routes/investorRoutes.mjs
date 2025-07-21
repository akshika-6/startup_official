import express from 'express';
import { getAllInvestors } from '../controllers/investorController.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

// GET /api/investors - Founders can view all investors
router.get('/', protect, getAllInvestors);

export default router;
