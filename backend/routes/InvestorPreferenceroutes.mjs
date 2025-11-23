import express from "express";
import { body, param } from "express-validator";
import {
  createPreference,
  getPreferences,
  getAllPreferences,
  getPreferenceById,
  updatePreference,
  deletePreference,
  getInvestmentStats,
} from "../controllers/Investorpreferencecontroller.mjs";
import { protect } from "../middleware/auth.mjs";
import { authorizeRoles } from "../middleware/roleAuth.mjs";
import validateRequest from "../middleware/validateRequest.mjs";

const router = express.Router();

// @route   POST /api/investor-preferences
// @desc    Create new investment preference/interest
// @access  Protected (Investors only)
router.post(
  "/",
  protect,
  authorizeRoles("investor"),
  [
    body("investorName").optional().isString().trim(),
    body("contactEmail")
      .optional()
      .isEmail()
      .withMessage("Valid email is required"),
    body("companyName").optional().isString().trim(),
    body("investmentAmount")
      .optional()
      .isString()
      .withMessage("Investment amount/stage is required"),
    body("areasOfInterest")
      .optional()
      .isString()
      .withMessage("Areas of interest are required"),
    body("notes").optional().isString().trim(),
    body("domain").optional().isString().trim(),
    body("stage").optional().isString().trim(),
  ],
  validateRequest,
  createPreference,
);

// @route   GET /api/investor-preferences
// @desc    Get investment preferences for logged-in investor
// @access  Protected (Investors only)
router.get("/", protect, authorizeRoles("investor"), getPreferences);

// @route   GET /api/investor-preferences/stats
// @desc    Get investment statistics for investor dashboard
// @access  Protected (Investors only)
router.get("/stats", protect, authorizeRoles("investor"), getInvestmentStats);

// @route   GET /api/investor-preferences/all
// @desc    Get all investment preferences (for admin or viewing)
// @access  Protected
router.get("/all", protect, getAllPreferences);

// @route   GET /api/investor-preferences/:id
// @desc    Get investment preference by ID
// @access  Protected
router.get(
  "/:id",
  protect,
  [param("id").isMongoId().withMessage("Invalid preference ID")],
  validateRequest,
  getPreferenceById,
);

// @route   PUT /api/investor-preferences/:id
// @desc    Update investment preference
// @access  Protected (Owner or admin)
router.put(
  "/:id",
  protect,
  [
    param("id").isMongoId().withMessage("Invalid preference ID"),
    body("investorName").optional().isString().trim(),
    body("contactEmail")
      .optional()
      .isEmail()
      .withMessage("Valid email is required"),
    body("companyName").optional().isString().trim(),
    body("investmentAmount").optional().isString(),
    body("areasOfInterest").optional().isString(),
    body("notes").optional().isString().trim(),
    body("status")
      .optional()
      .isIn(["active", "inactive", "completed"])
      .withMessage("Status must be active, inactive, or completed"),
  ],
  validateRequest,
  updatePreference,
);

// @route   DELETE /api/investor-preferences/:id
// @desc    Delete investment preference
// @access  Protected (Owner or admin)
router.delete(
  "/:id",
  protect,
  [param("id").isMongoId().withMessage("Invalid preference ID")],
  validateRequest,
  deletePreference,
);

export default router;
