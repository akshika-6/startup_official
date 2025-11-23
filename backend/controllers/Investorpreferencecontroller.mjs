// import { InvestorPreference } from '../Schema.mjs';

// export const createPreference = async (req, res) => {
//   const preference = await InvestorPreference.create(req.body);
//   res.status(201).json(preference);
// };

// export const getPreferences = async (req, res) => {
//   const preferences = await InvestorPreference.find().populate('investorId');
//   res.json(preferences);
// };

import { InvestorPreference } from '../Schema.mjs';

export const createPreference = async (req, res, next) => {
  try {
    const { domain, stage } = req.body;

    const preference = await InvestorPreference.create({
      investorId: req.user._id,
      domain,
      stage
    });

    res.status(201).json({ success: true, data: preference });
  } catch (err) {
    next(err);
  }
};

export const getPreferences = async (req, res, next) => {
  try {
    const preferences = await InvestorPreference.find({ investorId: req.user._id }).populate('investorId', 'name email');
    res.json({ success: true, data: preferences });
  } catch (err) {
    next(err);
  }
};

