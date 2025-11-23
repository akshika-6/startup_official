import express from 'express';
import { body, param } from 'express-validator';
import {
  getAllInvestors,
  getInvestorById,
  createInvestor,
  updateInvestor,
  deleteInvestor
} from '../controllers/investorcontroller.mjs';
import { protect } from '../middleware/auth.mjs';
import { authorizeRoles } from '../middleware/roleAuth.mjs';
import validateRequest from '../middleware/validateRequest.mjs';

const router = express.Router();

// GET /api/investors - Get all investors (protected)
router.get('/', protect, getAllInvestors);

// GET /api/investors/:id - Get investor by ID (protected)
router.get(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid investor ID')],
  validateRequest,
  getInvestorById
);

// POST /api/investors - Create new investor (investors only)
router.post(
  '/',
  protect,
  authorizeRoles('investor'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('company').optional().isString(),
    body('role').optional().isString(),
    body('location').optional().isString(),
    body('bio').optional().isString(),
    body('investmentStage').optional().isArray(),
    body('industry').optional().isArray(),
    body('preferredDealSize').optional().isString()
  ],
  validateRequest,
  createInvestor
);

// PUT /api/investors/:id - Update investor (own profile or admin)
router.put(
  '/:id',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid investor ID'),
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('company').optional().isString(),
    body('role').optional().isString(),
    body('location').optional().isString(),
    body('bio').optional().isString(),
    body('investmentStage').optional().isArray(),
    body('industry').optional().isArray(),
    body('preferredDealSize').optional().isString()
  ],
  validateRequest,
  updateInvestor
);

// DELETE /api/investors/:id - Delete investor (admin only)
router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  [param('id').isMongoId().withMessage('Invalid investor ID')],
  validateRequest,
  deleteInvestor
);

export default router;
