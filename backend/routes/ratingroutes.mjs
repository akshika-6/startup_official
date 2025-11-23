// import express from 'express';
// import {
//   giveRating,
//   getRatingsForStartup
// } from '../controllers/ratingcontroller.mjs';
// import { protect } from '../middleware/auth.mjs';

// const router = express.Router();

// router.post('/', protect, giveRating);
// router.get('/:startupId', getRatingsForStartup);

// export default router;

import express from 'express';
import { body, param } from 'express-validator';
import {
  giveRating,
  getRatingsForStartup
} from '../controllers/ratingcontroller.mjs';
import { protect } from '../middleware/auth.mjs';
import validateRequest from '../middleware/validateRequest.mjs';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('startupId').isMongoId().withMessage('Invalid startup ID'),
    body('score')
      .isInt({ min: 1, max: 5 })
      .withMessage('Score must be between 1 and 5'),
    body('review')
      .optional()
      .isString()
      .withMessage('Review must be a string')
  ],
  validateRequest,
  giveRating
);

router.get(
  '/:startupId',
  [param('startupId').isMongoId().withMessage('Invalid startup ID')],
  validateRequest,
  getRatingsForStartup
);

export default router;

