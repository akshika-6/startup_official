import { Notification } from '../Schema.mjs';

export const createNotification = async (req, res) => {
  const notification = await Notification.create(req.body);
  res.status(201).json(notification);
};

export const getNotificationsForUser = async (req, res) => {
  const notifications = await Notification.find({ userId: req.params.userId });
  res.json(notifications);
};
