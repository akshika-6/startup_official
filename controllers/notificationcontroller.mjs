// import { Notification } from '../Schema.mjs';

// export const createNotification = async (req, res) => {
//   const notification = await Notification.create(req.body);
//   res.status(201).json(notification);
// };

// export const getNotificationsForUser = async (req, res) => {
//   const notifications = await Notification.find({ userId: req.params.userId });
//   res.json(notifications);
// };

import { Notification } from '../Schema.mjs';
import CustomError from '../utils/CustomError.mjs';

export const createNotification = async (req, res, next) => {
  try {
    const { message, type } = req.body;

    const notification = await Notification.create({
      userId: req.user._id,
      message,
      type
    });

    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

export const getNotificationsForUser = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};
