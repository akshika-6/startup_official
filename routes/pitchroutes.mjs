// import express from 'express';
// import {
//   createPitch,
//   getAllPitches,
//   updatePitchStatus
// } from '../controllers/pitchcontroller.mjs';
// import { protect } from '../middleware/auth.mjs';

// const router = express.Router();

// router.post('/', protect, createPitch);
// router.get('/', getAllPitches);
// router.put('/:id/status', protect, updatePitchStatus);

// export default router;

import express from 'express';
import { body, param } from 'express-validator';
import {
  createPitch,
  getAllPitches,
  updatePitchStatus
} from '../controllers/pitchcontroller.mjs';
import { protect } from '../middleware/auth.mjs';
import validateRequest from '../middleware/validateRequest.mjs';

const router = express.Router();

// POST /api/pitches
router.post(
  '/',
  protect,
  [
    body('startupId').isMongoId().withMessage('Invalid startup ID'),
    body('investorId').isMongoId().withMessage('Invalid investor ID'),
    body('message')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Message can be up to 500 characters')
  ],
  validateRequest,
  createPitch
);

// GET /api/pitches
router.get('/', getAllPitches);

// PUT /api/pitches/:id/status
router.put(
  '/:id/status',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid pitch ID'),
    body('status')
      .isIn(['pending', 'viewed', 'interested', 'rejected'])
      .withMessage('Invalid status value')
  ],
  validateRequest,
  updatePitchStatus
);

export default router;

