import { User } from '../Schema.mjs';

// GET /api/investors
export const getAllInvestors = async (req, res) => {
  try {
    const investors = await User.find({ role: 'Investor' }).select('-password');
    res.status(200).json(investors);
  } catch (error) {
    console.error('Error fetching investors:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
