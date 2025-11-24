import express from 'express';
import { getStartupMatches, getInvestorMatches } from '../controllers/aiMatchController.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

// For Investors to find Startups
router.get('/startups', protect, getStartupMatches);

// For Founders to find Investors
router.get('/investors', protect, getInvestorMatches);

export default router;