import express from "express";
import { body, param } from "express-validator";
import {
  createPitch,
  getAllPitches,
  updatePitchStatus,
  getPitchesByStartup,
  getPitchesByFounder,
  createPitchForStartup,
} from "../controllers/pitchcontroller.mjs";
import { protect } from "../middleware/auth.mjs";
import validateRequest from "../middleware/validateRequest.mjs";

const router = express.Router();

// POST /api/pitches
router.post(
  "/",
  protect,
  [
    body("startupId").isMongoId().withMessage("Invalid startup ID"),
    body("investorId").isMongoId().withMessage("Invalid investor ID"),
    body("message")
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage("Message can be up to 500 characters"),
  ],
  validateRequest,
  createPitch,
);

// GET /api/pitches
router.get("/", getAllPitches);

// GET /api/pitches/my - Get pitches for current founder's startups
router.get("/my", protect, getPitchesByFounder);

// GET /api/pitches/startup/:startupId - Get pitches for specific startup
router.get(
  "/startup/:startupId",
  protect,
  [param("startupId").isMongoId().withMessage("Invalid startup ID")],
  validateRequest,
  getPitchesByStartup,
);

// POST /api/pitches/startup/:startupId - Create pitch for specific startup
router.post(
  "/startup/:startupId",
  protect,
  [
    param("startupId").isMongoId().withMessage("Invalid startup ID"),
    body("investorId").isMongoId().withMessage("Invalid investor ID"),
    body("message")
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage("Message can be up to 500 characters"),
  ],
  validateRequest,
  createPitchForStartup,
);

// PUT /api/pitches/:id/status
router.put(
  "/:id/status",
  protect,
  [
    param("id").isMongoId().withMessage("Invalid pitch ID"),
    body("status")
      .isIn(["pending", "viewed", "interested", "rejected"])
      .withMessage("Invalid status value"),
  ],
  validateRequest,
  updatePitchStatus,
);

export default router;
