// import { Comment } from '../Schema.mjs';

// export const postComment = async (req, res) => {
//   const comment = await Comment.create(req.body);
//   res.status(201).json(comment);
// };

// export const getComments = async (req, res) => {
//   const comments = await Comment.find({ targetType: req.params.type, targetId: req.params.id });
//   res.json(comments);
// };

// export const replyToComment = async (req, res) => {
//   const comment = await Comment.findByIdAndUpdate(
//     req.params.commentId,
//     {
//       $push: {
//         replies: {
//           userId: req.body.userId,
//           replyText: req.body.replyText
//         }
//       }
//     },
//     { new: true }
//   );
//   res.json(comment);
// };

import { Comment } from '../Schema.mjs';

export const postComment = async (req, res, next) => {
  try {
    const { targetType, targetId, text } = req.body;

    const comment = await Comment.create({
      userId: req.user._id,
      targetType,
      targetId,
      text
    });

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      targetType: req.params.type,
      targetId: req.params.id
    }).populate('userId', 'name email');

    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

export const replyToComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        $push: {
          replies: {
            userId: req.user._id,
            replyText: req.body.replyText
          }
        }
      },
      { new: true }
    ).populate('replies.userId', 'name email');

    res.json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};
