// import express from 'express';
// import {
//   createPreference,
//   getPreferences
// } from '../controllers/Investorpreferencecontroller.mjs';
// import { protect } from '../middleware/auth.mjs';

// const router = express.Router();

// router.post('/', protect, createPreference);
// router.get('/', getPreferences);

// export default router;

import express from 'express';
import { body } from 'express-validator';
import {
  createPreference,
  getPreferences
} from '../controllers/Investorpreferencecontroller.mjs';
import { protect } from '../middleware/auth.mjs';
import validateRequest from '../middleware/validateRequest.mjs';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('domain')
      .notEmpty()
      .withMessage('Domain is required'),
    body('stage')
      .isIn(['idea', 'MVP', 'revenue'])
      .withMessage('Stage must be one of: idea, MVP, revenue')
  ],
  validateRequest,
  createPreference
);

router.get('/', protect, getPreferences);

export default router;
