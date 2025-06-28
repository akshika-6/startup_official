import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../schema.mjs';

dotenv.config(); // Load JWT_SECRET from .env

// Middleware to verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // Get token from Authorization header: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user object to request (you can add .select() to limit fields)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Proceed to controller
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
