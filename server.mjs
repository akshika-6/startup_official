import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.mjs';

import userRoutes from './routes/userroutes.mjs';
import startupRoutes from './routes/startuproutes.mjs';
import pitchRoutes from './routes/pitchroutes.mjs';
import meetingRoutes from './routes/meetingroutes.mjs';
import notificationRoutes from './routes/notificationroutes.mjs';
import messageRoutes from './routes/messageroutes.mjs';
import ratingRoutes from './routes/ratingroutes.mjs';
import commentRoutes from './routes/commentroutes.mjs';
//import investorPreferenceRoutes from './routes/InvestorPreferencerouts.mjs'; // ✅ NEW
import investorPreferenceRoutes from './routes/InvestorPreferenceroutes.mjs';
import errorHandler from './middleware/errorHandler.mjs';
import dashboardRoutes from './routes/dashboardRoutes.mjs';
import settingsRoutes from './routes/settingsRoutes.mjs';
import investorRoutes from './routes/investorRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config(); // Load environment variables
connectDB();     // Connect to MongoDB
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
app.use(express.json()); // Enable JSON request body parsing
//app.use(cors());
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.netlify.app'],
  credentials: true,
}));
app.use(helmet());

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
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/investors', investorRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('🌉 PitchBridge API is running...');
});


// Serve frontend static files
app.use(express.static(path.join(__dirname, 'client')));

// Serve index.html for any unknown route (except API)
app.get('/*', (req, res) => {
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  }
});




app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route Not Found' });
});

// ✅ Central Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});







