import express from "express";
import {
  getInvestorDashboardStats,
  getFounderDashboardStats,
  getAdminDashboardStats,
} from "../controllers/dashboardcontroller.mjs";
import { protect } from "../middleware/auth.mjs";
import { authorizeRoles } from "../middleware/roleAuth.mjs";

const router = express.Router();

// @route   GET /api/dashboard/investor
// @desc    Get investor dashboard statistics
// @access  Protected (Investors only)
router.get("/investor", protect, authorizeRoles("investor"), getInvestorDashboardStats);

// @route   GET /api/dashboard/founder
// @desc    Get founder dashboard statistics
// @access  Protected (Founders only)
router.get("/founder", protect, authorizeRoles("founder"), getFounderDashboardStats);

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard statistics
// @access  Protected (Admin only)
router.get("/admin", protect, authorizeRoles("admin"), getAdminDashboardStats);

// @route   GET /api/dashboard/overview
// @desc    Get general dashboard overview (role-based)
// @access  Protected
router.get("/overview", protect, async (req, res, next) => {
  try {
    const userRole = req.user.role;

    switch (userRole) {
      case "investor":
        return getInvestorDashboardStats(req, res, next);
      case "founder":
        return getFounderDashboardStats(req, res, next);
      case "admin":
        return getAdminDashboardStats(req, res, next);
      default:
        return res.status(403).json({
          success: false,
          message: "Invalid user role",
        });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
