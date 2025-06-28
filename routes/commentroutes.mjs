import express from 'express';
import {
  postComment,
  getComments,
  replyToComment
} from '../controllers/commentcontroller.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, postComment);
router.get('/:type/:id', getComments); // type = 'startup' or 'pitch'
router.post('/:commentId/reply', protect, replyToComment);

export default router;
