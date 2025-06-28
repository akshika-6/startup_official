import { Rating } from '../Schema.mjs';

export const giveRating = async (req, res) => {
  const rating = await Rating.create(req.body);
  res.status(201).json(rating);
};

export const getRatingsForStartup = async (req, res) => {
  const ratings = await Rating.find({ startupId: req.params.startupId });
  res.json(ratings);
};
