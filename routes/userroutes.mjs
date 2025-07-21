import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
} from '../controllers/usercontroller.mjs';
import { body, param } from 'express-validator';
import validateRequest from '../middleware/validateRequest.mjs'; // ✅ new
import { protect } from '../middleware/auth.mjs'; // ✅ auth middleware
import { authorizeRoles } from '../middleware/roleAuth.mjs';
import upload from '../middleware/multer.mjs';
import path from 'path';


const router = express.Router();

// router.post('/login', loginUser);
// router.get('/', getAllUsers);
// router.get('/:id', getUserById);
// router.post('/', createUser);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);


router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  loginUser
);

// ✅ Protected Routes

// Get all users (only logged-in users)
router.get('/', protect, getAllUsers);

// Get a specific user by ID
router.get(
  '/by-id/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validateRequest,
  getUserById
);

// Create new user (public route)
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  createUser
);

// Update user info
router.put(
  '/:id',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 })
  ],
  validateRequest,
  updateUser
);

// Delete user
// router.delete(
//   '/:id',
//   protect,
//   [param('id').isMongoId().withMessage('Invalid user ID')],
//   validateRequest,
//   deleteUser
// );
// router.delete(
//   '/:id',
//   protect,
//   authorizeRoles('admin'), // 👈 only admins can access
//   deleteUser
// );

router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'), // ✅ Only admins
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validateRequest,
  deleteUser
);

//router.delete('/:id', protect, deleteUser); // Temporarily allow all authenticated users


router.put(
  '/update-username',
  protect,
  [body('username').notEmpty().withMessage('Username is required')],
  validateRequest,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.name = req.body.username;
      await user.save();
      res.status(200).json({ message: 'Username updated' });
    } catch (err) {
      next(err);
    }
  }
);

// ✅ Update email (PUT /api/users/update-email)
router.put(
  '/update-email',
  protect,
  [body('email').isEmail().withMessage('Valid email required')],
  validateRequest,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.email = req.body.email;
      await user.save();
      res.status(200).json({ message: 'Email updated' });
    } catch (err) {
      next(err);
    }
  }
);

// ✅ Upload profile picture (POST /api/users/upload-avatar)
router.post(
  '/upload-avatar',
  protect,
  upload.single('avatar'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // ✅ FIX: Convert path to use forward slashes
      user.profilePicture = '/' + req.file.path.replace(/\\/g, '/').replace('client/', '');

      await user.save();
      res.status(200).json({ message: 'Profile picture uploaded', path: user.profilePicture });
    } catch (err) {
      next(err);
    }
  }
);

// ✅ Allow user to delete their own account (DELETE /api/users/delete-self)
router.delete('/delete-self', protect, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;

