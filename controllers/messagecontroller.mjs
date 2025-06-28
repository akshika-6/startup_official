import { Message } from '../Schema.mjs';

export const sendMessage = async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json(message);
};

export const getMessagesByPitch = async (req, res) => {
  const messages = await Message.find({ pitchId: req.params.pitchId }).populate('senderId receiverId');
  res.json(messages);
};
