// import express from 'express';
// import {
//   postComment,
//   getComments,
//   replyToComment
// } from '../controllers/commentcontroller.mjs';
// import { protect } from '../middleware/auth.mjs';

// const router = express.Router();

// router.post('/', protect, postComment);
// router.get('/:type/:id', getComments); // type = 'startup' or 'pitch'
// router.post('/:commentId/reply', protect, replyToComment);

// export default router;

import express from 'express';
import { body, param } from 'express-validator';
import {
  postComment,
  getComments,
  replyToComment
} from '../controllers/commentcontroller.mjs';
import { protect } from '../middleware/auth.mjs';
import validateRequest from '../middleware/validateRequest.mjs';

const router = express.Router();

// Post a comment
router.post(
  '/',
  protect,
  [
    body('targetType')
      .isIn(['startup', 'pitch'])
      .withMessage('targetType must be startup or pitch'),
    body('targetId').isMongoId().withMessage('Invalid targetId'),
    body('text').notEmpty().withMessage('Comment text is required')
  ],
  validateRequest,
  postComment
);

// Get comments by type and target
router.get(
  '/:type/:id',
  [
    param('type').isIn(['startup', 'pitch']).withMessage('Invalid comment type'),
    param('id').isMongoId().withMessage('Invalid target ID')
  ],
  validateRequest,
  getComments
);

// Reply to a comment
router.post(
  '/:commentId/reply',
  protect,
  [
    param('commentId').isMongoId().withMessage('Invalid comment ID'),
    body('replyText').notEmpty().withMessage('Reply text is required')
  ],
  validateRequest,
  replyToComment
);

export default router;

