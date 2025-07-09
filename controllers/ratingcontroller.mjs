// import { Rating } from '../Schema.mjs';

// export const giveRating = async (req, res) => {
//   const rating = await Rating.create(req.body);
//   res.status(201).json(rating);
// };

// export const getRatingsForStartup = async (req, res) => {
//   const ratings = await Rating.find({ startupId: req.params.startupId });
//   res.json(ratings);
// };

import { Rating } from '../Schema.mjs';

export const giveRating = async (req, res, next) => {
  try {
    const { startupId, score, review } = req.body;

    // Prevent duplicate rating
    const existing = await Rating.findOne({
      startupId,
      ratedBy: req.user._id
    });

    if (existing) {
      return next(new CustomError('You have already rated this startup', 400));
    }

    const rating = await Rating.create({
      startupId,
      score,
      review,
      ratedBy: req.user._id
    });

    res.status(201).json({ success: true, data: rating });
  } catch (err) {
    next(err);
  }
};

export const getRatingsForStartup = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ startupId: req.params.startupId })
      .populate('ratedBy', 'name email');
    res.json({ success: true, data: ratings });
  } catch (err) {
    next(err);
  }
};

