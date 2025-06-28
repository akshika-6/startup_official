import { Startup } from '../Schema.mjs';

export const createStartup = async (req, res) => {
  const startup = await Startup.create(req.body);
  res.status(201).json(startup);
};

export const getAllStartups = async (req, res) => {
  const startups = await Startup.find().populate('founderId');
  res.json(startups);
};

export const getStartupById = async (req, res) => {
  const startup = await Startup.findById(req.params.id).populate('founderId');
  res.json(startup);
};
