// import { Message } from '../Schema.mjs';

// export const sendMessage = async (req, res) => {
//   const message = await Message.create(req.body);
//   res.status(201).json(message);
// };

// export const getMessagesByPitch = async (req, res) => {
//   const messages = await Message.find({ pitchId: req.params.pitchId }).populate('senderId receiverId');
//   res.json(messages);
// };

import { Message } from '../Schema.mjs';

export const sendMessage = async (req, res, next) => {
  try {
    const { pitchId, receiverId, text } = req.body;

    const message = await Message.create({
      pitchId,
      senderId: req.user._id,
      receiverId,
      text
    });

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};

export const getMessagesByPitch = async (req, res, next) => {
  try {
    const messages = await Message.find({ pitchId: req.params.pitchId })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');

    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};
