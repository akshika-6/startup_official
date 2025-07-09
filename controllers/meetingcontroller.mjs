// import { Meeting } from '../Schema.mjs';

// export const createMeeting = async (req, res) => {
//   const meeting = await Meeting.create(req.body);
//   res.status(201).json(meeting);
// };

// export const getMeetingsByPitch = async (req, res) => {
//   const meetings = await Meeting.find({ pitchId: req.params.pitchId }).populate('pitchId');
//   res.json(meetings);
// };

import { Meeting } from '../Schema.mjs';

export const createMeeting = async (req, res, next) => {
  try {
    const { pitchId, scheduledTime, link } = req.body;

    const meeting = await Meeting.create({
      pitchId,
      scheduledTime,
      link
    });

    res.status(201).json({ success: true, data: meeting });
  } catch (err) {
    next(err);
  }
};

export const getMeetingsByPitch = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({ pitchId: req.params.pitchId }).populate('pitchId');
    res.json({ success: true, data: meetings });
  } catch (err) {
    next(err);
  }
};
