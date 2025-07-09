// import { Startup } from '../Schema.mjs';

// export const createStartup = async (req, res) => {
//   const startup = await Startup.create(req.body);
//   res.status(201).json(startup);
// };

// export const getAllStartups = async (req, res) => {
//   const startups = await Startup.find().populate('founderId');
//   res.json(startups);
// };

// export const getStartupById = async (req, res) => {
//   const startup = await Startup.findById(req.params.id).populate('founderId');
//   res.json(startup);
// };

// import { Startup } from '../Schema.mjs';

// export const createStartup = async (req, res, next) => {
//   try {
//     if (req.user.role !== 'founder') {
//       return res.status(403).json({ message: 'Only founders can create startups' });
//     }

//     const startup = await Startup.create({
//       ...req.body,
//       founderId: req.user._id
//     });

//     res.status(201).json({ success: true, data: startup });
//   } catch (err) {
//     next(err);
//   }
// };

// export const getAllStartups = async (req, res, next) => {
//   try {
//     const startups = await Startup.find().populate('founderId', 'name email');
//     res.json({ success: true, data: startups });
//   } catch (err) {
//     next(err);
//   }
// };

// export const getStartupById = async (req, res, next) => {
//   try {
//     const startup = await Startup.findById(req.params.id).populate('founderId', 'name email');
//     if (!startup) {
//       return res.status(404).json({ message: 'Startup not found' });
//     }
//     res.json({ success: true, data: startup });
//   } catch (err) {
//     next(err);
//   }
// };

import { Startup } from '../Schema.mjs';
import CustomError from '../utils/CustomError.mjs';

export const createStartup = async (req, res, next) => {
  try {
    if (req.user.role !== 'founder') {
      return next(new CustomError('Only founders can create startups', 403));
    }

    const startup = await Startup.create({
      ...req.body,
      founderId: req.user._id
    });

    res.status(201).json({ success: true, data: startup });
  } catch (err) {
    next(err);
  }
};

export const getAllStartups = async (req, res, next) => {
  try {
    const startups = await Startup.find().populate('founderId', 'name email');
    res.json({ success: true, data: startups });
  } catch (err) {
    next(err);
  }
};

export const getStartupById = async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id).populate('founderId', 'name email');
    if (!startup) {
      return next(new CustomError('Startup not found', 404));
    }
    res.json({ success: true, data: startup });
  } catch (err) {
    next(err);
  }
};

