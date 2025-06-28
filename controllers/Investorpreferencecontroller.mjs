import { InvestorPreference } from '../Schema.mjs';

export const createPreference = async (req, res) => {
  const preference = await InvestorPreference.create(req.body);
  res.status(201).json(preference);
};

export const getPreferences = async (req, res) => {
  const preferences = await InvestorPreference.find().populate('investorId');
  res.json(preferences);
};
