import { Pitch } from '../Schema.mjs';

export const createPitch = async (req, res) => {
  const pitch = await Pitch.create(req.body);
  res.status(201).json(pitch);
};

export const getAllPitches = async (req, res) => {
  const pitches = await Pitch.find().populate('startupId investorId');
  res.json(pitches);
};

export const updatePitchStatus = async (req, res) => {
  const pitch = await Pitch.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(pitch);
};
