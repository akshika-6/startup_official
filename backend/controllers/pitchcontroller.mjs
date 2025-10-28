// import { Pitch } from '../Schema.mjs';

// export const createPitch = async (req, res) => {
//   const pitch = await Pitch.create(req.body);
//   res.status(201).json(pitch);
// };

// export const getAllPitches = async (req, res) => {
//   const pitches = await Pitch.find().populate('startupId investorId');
//   res.json(pitches);
// };

// export const updatePitchStatus = async (req, res) => {
//   const pitch = await Pitch.findByIdAndUpdate(
//     req.params.id,
//     { status: req.body.status },
//     { new: true }
//   );
//   res.json(pitch);
// };

import { Pitch } from '../Schema.mjs';

export const createPitch = async (req, res, next) => {
  try {
    const { startupId, investorId, message } = req.body;

    // Optional: prevent duplicate pitches
    const existing = await Pitch.findOne({ startupId, investorId });
    if (existing) {
      return next(new CustomError('Pitch already exists', 400));
    }

    const pitch = await Pitch.create({
      startupId,
      investorId,
      message
    });

    res.status(201).json({ success: true, data: pitch });
  } catch (err) {
    next(err);
  }
};

export const getAllPitches = async (req, res, next) => {
  try {
    const pitches = await Pitch.find().populate('startupId investorId');
    res.json({ success: true, data: pitches });
  } catch (err) {
    next(err);
  }
};

export const updatePitchStatus = async (req, res, next) => {
  try {
    const pitch = await Pitch.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!pitch) {
      return next(new CustomError('Pitch not found', 404));
    }

    res.json({ success: true, data: pitch });
  } catch (err) {
    next(err);
  }
};
