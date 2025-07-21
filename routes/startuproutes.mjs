import express from 'express';
import { body, param } from 'express-validator';
import {
  createStartup,
  getAllStartups,
  getStartupById
} from '../controllers/startupcontroller.mjs';
import { protect } from '../middleware/auth.mjs';
import validateRequest from '../middleware/validateRequest.mjs';
import { authorizeRoles } from '../middleware/roleAuth.mjs';

const router = express.Router();

// 🔐 POST /api/startups - founders only (still protected)
router.post(
  '/',
  protect,
  checkRole(['founder']),
  [
    body('startupName').notEmpty().withMessage('Startup name is required'),
    body('domain').notEmpty().withMessage('Domain is required'),
    body('stage')
      .isIn(['idea', 'MVP', 'revenue'])
      .withMessage('Stage must be one of: idea, MVP, revenue')
  ],
  validateRequest,
  createStartup
);

// 🔓 GET /api/startups - now public
router.get('/', getAllStartups);

// 🔓 GET /api/startups/:id - public but with ID validation
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid startup ID')],
  validateRequest,
  getStartupById
);

export default router;
