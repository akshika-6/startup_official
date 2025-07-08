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
  '/:id',
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

export default router;

