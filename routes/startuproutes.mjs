

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

// router.post(
//   '/upload-pitch/:startupId',
//   protect,
//   upload.single('pitchFile'),
//   uploadPitch
// );


router.post(
  "/upload-pitch/:startupId",
  protect,
  upload.single("pitchFile"),
  async (req, res) => {
    const { startupId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ error: "Startup not found" });

    if (req.file.mimetype === "application/pdf") {
      startup.pitchDeck = req.file.filename;
    } else if (req.file.mimetype === "video/mp4") {
      startup.videoPitch = req.file.filename;
    }

    await startup.save();
    res.json({ message: "Pitch uploaded successfully", file: req.file.filename });
  }
);




export default router;

