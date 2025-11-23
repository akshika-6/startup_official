import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../Schema.mjs';

dotenv.config(); // Load JWT_SECRET

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. If token not found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // 3. If token found, verify
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // ✅ Proceed
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
