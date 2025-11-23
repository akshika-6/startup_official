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

import { Pitch } from "../Schema.mjs";
import { CustomError } from "../middleware/errorHandler.mjs";

export const createPitch = async (req, res, next) => {
  try {
    const { startupId, investorId, message } = req.body;

    // Optional: prevent duplicate pitches
    const existing = await Pitch.findOne({ startupId, investorId });
    if (existing) {
      return next(new CustomError("Pitch already exists", 400));
    }

    const pitch = await Pitch.create({
      startupId,
      investorId,
      message,
    });

    res.status(201).json({ success: true, data: pitch });
  } catch (err) {
    next(err);
  }
};

export const getAllPitches = async (req, res, next) => {
  try {
    const pitches = await Pitch.find().populate("startupId investorId");
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
      { new: true },
    );

    if (!pitch) {
      return next(new CustomError("Pitch not found", 404));
    }

    res.json({ success: true, data: pitch });
  } catch (err) {
    next(err);
  }
};

export const getPitchesByStartup = async (req, res, next) => {
  try {
    const pitches = await Pitch.find({ startupId: req.params.startupId })
      .populate("investorId", "name email")
      .populate("startupId", "startupName domain")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: pitches });
  } catch (err) {
    next(err);
  }
};

export const getPitchesByFounder = async (req, res, next) => {
  try {
    // First get all startups owned by this founder
    const { Startup } = await import("../Schema.mjs");
    const startups = await Startup.find({ founderId: req.user._id });
    const startupIds = startups.map((startup) => startup._id);

    // Then get all pitches for those startups
    const pitches = await Pitch.find({ startupId: { $in: startupIds } })
      .populate("investorId", "name email")
      .populate("startupId", "startupName domain")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: pitches });
  } catch (err) {
    next(err);
  }
};

export const createPitchForStartup = async (req, res, next) => {
  try {
    const { startupId } = req.params;
    const { investorId, message } = req.body;

    // Verify the startup exists and belongs to the current user
    const { Startup } = await import("../Schema.mjs");
    const startup = await Startup.findById(startupId);

    if (!startup) {
      return next(new CustomError("Startup not found", 404));
    }

    if (startup.founderId.toString() !== req.user._id.toString()) {
      return next(
        new CustomError("Not authorized to create pitch for this startup", 403),
      );
    }

    // Check for duplicate pitch
    const existing = await Pitch.findOne({ startupId, investorId });
    if (existing) {
      return next(
        new CustomError("Pitch already exists for this investor", 400),
      );
    }

    const pitch = await Pitch.create({
      startupId,
      investorId,
      message,
    });

    const populatedPitch = await Pitch.findById(pitch._id)
      .populate("investorId", "name email")
      .populate("startupId", "startupName domain");

    res.status(201).json({ success: true, data: populatedPitch });
  } catch (err) {
    next(err);
  }
};
