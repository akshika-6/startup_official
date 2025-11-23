import { InvestorPreference, User } from "../Schema.mjs";

// @desc    Create new investment preference/interest
// @route   POST /api/investor-preferences
// @access  Protected (Investors only)
export const createPreference = async (req, res, next) => {
  try {
    const {
      investorName,
      contactEmail,
      companyName,
      investmentAmount,
      areasOfInterest,
      notes,
      domain,
      stage,
    } = req.body;

    // Check if user is an investor
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "investor") {
      return res.status(403).json({
        success: false,
        message: "Only investors can submit investment preferences",
      });
    }

    // Create investment preference/interest
    const preference = await InvestorPreference.create({
      investorId: req.user._id,
      investorName: investorName || user.name,
      contactEmail: contactEmail || user.email,
      companyName: companyName || "",
      investmentAmount: investmentAmount || stage || "",
      areasOfInterest: areasOfInterest || domain || "",
      notes: notes || "",
      domain: domain || areasOfInterest || "",
      stage: stage || investmentAmount || "",
      status: "active",
      submittedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Investment interest submitted successfully",
      data: preference,
    });
  } catch (error) {
    console.error("Error creating investment preference:", error);
    next(error);
  }
};

// @desc    Get all investment preferences for logged-in investor
// @route   GET /api/investor-preferences
// @access  Protected (Investors only)
export const getPreferences = async (req, res, next) => {
  try {
    const preferences = await InvestorPreference.find({
      investorId: req.user._id,
    })
      .populate("investorId", "name email")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      count: preferences.length,
      data: preferences,
    });
  } catch (error) {
    console.error("Error fetching investment preferences:", error);
    next(error);
  }
};

// @desc    Get all investment preferences (for admin or startups to view)
// @route   GET /api/investor-preferences/all
// @access  Protected
export const getAllPreferences = async (req, res, next) => {
  try {
    const preferences = await InvestorPreference.find()
      .populate("investorId", "name email role")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      count: preferences.length,
      data: preferences,
    });
  } catch (error) {
    console.error("Error fetching all investment preferences:", error);
    next(error);
  }
};

// @desc    Get investment preference by ID
// @route   GET /api/investor-preferences/:id
// @access  Protected
export const getPreferenceById = async (req, res, next) => {
  try {
    const preference = await InvestorPreference.findById(
      req.params.id,
    ).populate("investorId", "name email role");

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: "Investment preference not found",
      });
    }

    // Check if user can view this preference (owner or admin)
    if (
      preference.investorId._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this preference",
      });
    }

    res.json({
      success: true,
      data: preference,
    });
  } catch (error) {
    console.error("Error fetching investment preference:", error);
    next(error);
  }
};

// @desc    Update investment preference
// @route   PUT /api/investor-preferences/:id
// @access  Protected (Owner or admin)
export const updatePreference = async (req, res, next) => {
  try {
    const preference = await InvestorPreference.findById(req.params.id);

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: "Investment preference not found",
      });
    }

    // Check if user can update this preference (owner or admin)
    if (
      preference.investorId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this preference",
      });
    }

    const updatedPreference = await InvestorPreference.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("investorId", "name email");

    res.json({
      success: true,
      message: "Investment preference updated successfully",
      data: updatedPreference,
    });
  } catch (error) {
    console.error("Error updating investment preference:", error);
    next(error);
  }
};

// @desc    Delete investment preference
// @route   DELETE /api/investor-preferences/:id
// @access  Protected (Owner or admin)
export const deletePreference = async (req, res, next) => {
  try {
    const preference = await InvestorPreference.findById(req.params.id);

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: "Investment preference not found",
      });
    }

    // Check if user can delete this preference (owner or admin)
    if (
      preference.investorId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this preference",
      });
    }

    await InvestorPreference.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Investment preference deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting investment preference:", error);
    next(error);
  }
};

// @desc    Get investment statistics for investor dashboard
// @route   GET /api/investor-preferences/stats
// @access  Protected (Investors only)
export const getInvestmentStats = async (req, res, next) => {
  try {
    const investorId = req.user._id;

    // Get total preferences submitted
    const totalPreferences = await InvestorPreference.countDocuments({
      investorId,
    });

    // Get preferences by status
    const activePreferences = await InvestorPreference.countDocuments({
      investorId,
      status: "active",
    });

    // Get preferences by investment stage/amount (for analytics)
    const preferencesByStage = await InvestorPreference.aggregate([
      { $match: { investorId: req.user._id } },
      {
        $group: {
          _id: "$investmentAmount",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get preferences by industry/domain
    const preferencesByIndustry = await InvestorPreference.aggregate([
      { $match: { investorId: req.user._id } },
      {
        $group: {
          _id: "$areasOfInterest",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalPreferences,
        activePreferences,
        preferencesByStage,
        preferencesByIndustry,
        recentActivity: await InvestorPreference.find({ investorId })
          .sort({ submittedAt: -1 })
          .limit(5)
          .select("investmentAmount areasOfInterest submittedAt status"),
      },
    });
  } catch (error) {
    console.error("Error fetching investment stats:", error);
    next(error);
  }
};
