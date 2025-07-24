// import express from 'express';
// import {
//   createStartup,
//   getAllStartups,
//   getStartupById
// } from '../controllers/startupcontroller.mjs';
// import { protect } from '../middleware/auth.mjs';

// const router = express.Router();

// router.post('/', protect, createStartup);
// router.get('/', getAllStartups);
// router.get('/:id', getStartupById);

// export default router;

import express from 'express';
import { body, param } from 'express-validator';
import {
  createStartup,
  getAllStartups,
  getStartupById,
  getMyStartups // ✅ Add this
} from '../controllers/startupcontroller.mjs';

import { protect } from '../middleware/auth.mjs';
import validateRequest from '../middleware/validateRequest.mjs';

const router = express.Router();

// POST /api/startups - founders only
router.post(
  '/',
  protect,
  [
    body('name').notEmpty().withMessage('Startup name is required'),
    body('domain').notEmpty().withMessage('Domain is required'),
    body('stage')
      .isIn(['idea', 'MVP', 'revenue'])
      .withMessage('Stage must be one of: idea, MVP, revenue')
  ],
  validateRequest,
  createStartup
);

// GET /api/startups
router.get('/', getAllStartups);



router.get('/my', protect, getMyStartups);




// GET /api/startups/:id
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid startup ID')],
  validateRequest,
  getStartupById
);




import upload from '../middleware/multer.mjs';
import { uploadPitch } from '../controllers/startupcontroller.mjs';

router.post(
  '/upload-pitch/:startupId',
  protect,
  upload.single('pitchFile'),
  uploadPitch
);



export default router;

