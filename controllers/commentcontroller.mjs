import { Comment } from '../Schema.mjs';

export const postComment = async (req, res) => {
  const comment = await Comment.create(req.body);
  res.status(201).json(comment);
};

export const getComments = async (req, res) => {
  const comments = await Comment.find({ targetType: req.params.type, targetId: req.params.id });
  res.json(comments);
};

export const replyToComment = async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      $push: {
        replies: {
          userId: req.body.userId,
          replyText: req.body.replyText
        }
      }
    },
    { new: true }
  );
  res.json(comment);
};
