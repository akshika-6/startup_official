import { Meeting } from '../Schema.mjs';

export const createMeeting = async (req, res) => {
  const meeting = await Meeting.create(req.body);
  res.status(201).json(meeting);
};

export const getMeetingsByPitch = async (req, res) => {
  const meetings = await Meeting.find({ pitchId: req.params.pitchId }).populate('pitchId');
  res.json(meetings);
};
