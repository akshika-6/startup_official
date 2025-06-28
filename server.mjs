import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.mjs';

import userRoutes from './routes/userroutes.mjs';
import startupRoutes from './routes/startuproutes.mjs';
import pitchRoutes from './routes/pitchroutes.mjs';
import meetingRoutes from './routes/meetingroutes.mjs';
import notificationRoutes from './routes/notificationroutes.mjs';
import messageRoutes from './routes/messageroutes.mjs';
import ratingRoutes from './routes/ratingroutes.mjs';
import commentRoutes from './routes/commentroutes.mjs';
import investorPreferenceRoutes from './routes/InvestorPreferencerouts.mjs'; // ✅ NEW

dotenv.config(); // Load environment variables
connectDB();     // Connect to MongoDB

const app = express();
app.use(express.json()); // Enable JSON request body parsing

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/pitches', pitchRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/investor-preferences', investorPreferenceRoutes); // ✅ ADDED

// Root endpoint
app.get('/', (req, res) => {
  res.send('🌉 PitchBridge API is running...');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});




