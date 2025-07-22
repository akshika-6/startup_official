import { User } from '../Schema.mjs';

// GET /api/investors
export const getAllInvestors = async (req, res) => {
  try {
    const investors = await User.find({ role: 'investor' }).select('-password');

    res.status(200).json({
      success: true,
      count: investors.length,
      data: investors,
    });
  } catch (error) {
    console.error('Error fetching investors:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
