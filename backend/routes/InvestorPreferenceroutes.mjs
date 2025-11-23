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

// Clean test endpoint with no validation or authorization
router.post("/test", (req, res) => {
  console.log("=== CLEAN TEST ENDPOINT ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  res.json({
    success: true,
    message: "Clean test endpoint working - no validation!",
    requestBody: req.body,
  });
});

// Debug endpoint to test request data
router.post("/debug", protect, (req, res) => {
  console.log("Debug - Request body:", req.body);
  console.log("Debug - User:", req.user);
  res.json({
    success: true,
    message: "Debug endpoint working",
    requestBody: req.body,
    user: req.user,
  });
});

// Main endpoint - save to database with minimal auth
router.post("/", protect, createPreference);

// @route   GET /api/investor-preferences
// @desc    Get investment preferences for logged-in investor
// @access  Protected
router.get("/", protect, getPreferences);

// @route   GET /api/investor-preferences/stats
// @desc    Get investment statistics for investor dashboard
// @access  Protected
router.get("/stats", protect, getInvestmentStats);

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
