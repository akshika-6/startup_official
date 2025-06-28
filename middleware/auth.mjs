import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../Schema.mjs';

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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};