import { User } from '../Schema.mjs';
import jwt from 'jsonwebtoken';

// @desc    Get all investors
// @route   GET /api/investors
// @access  Protected
export const getAllInvestors = async (req, res, next) => {
  try {
    const investors = await User.find({ role: 'investor' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: investors.length,
      data: investors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get investor by ID
// @route   GET /api/investors/:id
// @access  Protected
export const getInvestorById = async (req, res, next) => {
  try {
    const investor = await User.findById(req.params.id).select('-password');

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    if (investor.role !== 'investor') {
      return res.status(400).json({
        success: false,
        message: 'User is not an investor'
      });
    }

    res.status(200).json({
      success: true,
      data: investor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new investor
// @route   POST /api/investors
// @access  Protected (investors only)
export const createInvestor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      company,
      role: userRole,
      location,
      bio,
      investmentStage,
      industry,
      preferredDealSize
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const investor = await User.create({
      name,
      email,
      password,
      role: 'investor',
      company,
      location,
      bio,
      investmentStage,
      industry,
      preferredDealSize
    });

    const token = jwt.sign({ id: investor._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      message: 'Investor created successfully',
      data: {
        _id: investor._id,
        name: investor.name,
        email: investor.email,
        role: investor.role,
        company: investor.company,
        location: investor.location,
        bio: investor.bio,
        investmentStage: investor.investmentStage,
        industry: investor.industry,
        preferredDealSize: investor.preferredDealSize,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update investor
// @route   PUT /api/investors/:id
// @access  Protected (own profile or admin)
export const updateInvestor = async (req, res, next) => {
  try {
    const investor = await User.findById(req.params.id);

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    if (investor.role !== 'investor') {
      return res.status(400).json({
        success: false,
        message: 'User is not an investor'
      });
    }

    // Check if user can update this profile (own profile or admin)
    if (req.user.id !== investor._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    const updatedInvestor = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Investor updated successfully',
      data: updatedInvestor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete investor
// @route   DELETE /api/investors/:id
// @access  Protected (admin only)
export const deleteInvestor = async (req, res, next) => {
  try {
    const investor = await User.findById(req.params.id);

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    if (investor.role !== 'investor') {
      return res.status(400).json({
        success: false,
        message: 'User is not an investor'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Investor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
