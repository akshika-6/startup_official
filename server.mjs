// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import helmet from 'helmet';
// import connectDB from './config/db.mjs';

// import userRoutes from './routes/userroutes.mjs';
// import startupRoutes from './routes/startuproutes.mjs';
// import pitchRoutes from './routes/pitchroutes.mjs';
// import meetingRoutes from './routes/meetingroutes.mjs';
// import notificationRoutes from './routes/notificationroutes.mjs';
// import messageRoutes from './routes/messageroutes.mjs';
// import ratingRoutes from './routes/ratingroutes.mjs';
// import commentRoutes from './routes/commentroutes.mjs';
// import investorPreferenceRoutes from './routes/InvestorPreferenceroutes.mjs';
// import errorHandler from './middleware/errorHandler.mjs';
// import dashboardRoutes from './routes/dashboardRoutes.mjs';
// import settingsRoutes from './routes/settingsRoutes.mjs';
// import investorRoutes from './routes/investorRoutes.mjs';

// import path from 'path';
// import { fileURLToPath } from 'url';

// dotenv.config(); // Load environment variables
// connectDB();     // Connect to MongoDB

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(express.json());

// // ✅ Enable CORS for both local & production frontend
// app.use(cors({
//   origin: ['http://localhost:5173', 'https://your-frontend-domain.netlify.app'],
//   credentials: true,
// }));

// app.use(helmet());

// /* ✅ Static folder for profile pictures (avatars) */
// //app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));
// app.use('/uploads/avatars', express.static(path.join(__dirname, 'client/assets/uploads/avatars')));


// // ✅ API Routes
// app.use('/api/users', userRoutes);
// app.use('/api/startups', startupRoutes);
// app.use('/api/pitches', pitchRoutes);
// app.use('/api/meetings', meetingRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/ratings', ratingRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/investor-preferences', investorPreferenceRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/settings', settingsRoutes);
// app.use('/api/investors', investorRoutes);

// // ✅ Root endpoint
// app.get('/', (req, res) => {
//   res.send('🌉 PitchBridge API is running...');
// });

// // ✅ Serve frontend static files (optional if deploying fullstack together)
// app.use(express.static(path.join(__dirname, 'client', 'dist')));


// // ✅ Fallback to index.html for SPA routing (not API)
// app.get('*', (req, res) => {
//   if (!req.originalUrl.startsWith('/api')) {
//     res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
//   }
// });

// // ✅ 404 Handler
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route Not Found' });
// });

// // ✅ Central Error Handler
// app.use(errorHandler);

// // ✅ Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server started on http://localhost:${PORT}`);
// });



import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables
connectDB();     // Connect to MongoDB

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.netlify.app'],
  credentials: true,
}));
app.use(helmet());

// ✅ Serve uploaded avatars
app.use('/uploads/avatars', express.static(path.join(__dirname, 'client/assets/uploads/avatars')));

// ✅ Dynamic route loading with try-catch for debugging

try {
  const { default: userRoutes } = await import('./routes/userroutes.mjs');
  app.use('/api/users', userRoutes);
  console.log('✅ userRoutes loaded');
} catch (err) {
  console.error('❌ userRoutes failed:', err.message);
}

try {
  const { default: startupRoutes } = await import('./routes/startuproutes.mjs');
  app.use('/api/startups', startupRoutes);
  console.log('✅ startupRoutes loaded');
} catch (err) {
  console.error('❌ startupRoutes failed:', err.message);
}

try {
  const { default: pitchRoutes } = await import('./routes/pitchroutes.mjs');
  app.use('/api/pitches', pitchRoutes);
  console.log('✅ pitchRoutes loaded');
} catch (err) {
  console.error('❌ pitchRoutes failed:', err.message);
}

try {
  const { default: meetingRoutes } = await import('./routes/meetingroutes.mjs');
  app.use('/api/meetings', meetingRoutes);
  console.log('✅ meetingRoutes loaded');
} catch (err) {
  console.error('❌ meetingRoutes failed:', err.message);
}

try {
  const { default: notificationRoutes } = await import('./routes/notificationroutes.mjs');
  app.use('/api/notifications', notificationRoutes);
  console.log('✅ notificationRoutes loaded');
} catch (err) {
  console.error('❌ notificationRoutes failed:', err.message);
}

try {
  const { default: messageRoutes } = await import('./routes/messageroutes.mjs');
  app.use('/api/messages', messageRoutes);
  console.log('✅ messageRoutes loaded');
} catch (err) {
  console.error('❌ messageRoutes failed:', err.message);
}

try {
  const { default: ratingRoutes } = await import('./routes/ratingroutes.mjs');
  app.use('/api/ratings', ratingRoutes);
  console.log('✅ ratingRoutes loaded');
} catch (err) {
  console.error('❌ ratingRoutes failed:', err.message);
}

try {
  const { default: commentRoutes } = await import('./routes/commentroutes.mjs');
  app.use('/api/comments', commentRoutes);
  console.log('✅ commentRoutes loaded');
} catch (err) {
  console.error('❌ commentRoutes failed:', err.message);
}

try {
  const { default: investorPreferenceRoutes } = await import('./routes/InvestorPreferenceroutes.mjs');
  app.use('/api/investor-preferences', investorPreferenceRoutes);
  console.log('✅ investorPreferenceRoutes loaded');
} catch (err) {
  console.error('❌ investorPreferenceRoutes failed:', err.message);
}

try {
  const { default: dashboardRoutes } = await import('./routes/dashboardRoutes.mjs');
  app.use('/api/dashboard', dashboardRoutes);
  console.log('✅ dashboardRoutes loaded');
} catch (err) {
  console.error('❌ dashboardRoutes failed:', err.message);
}

try {
  const { default: settingsRoutes } = await import('./routes/settingsRoutes.mjs');
  app.use('/api/settings', settingsRoutes);
  console.log('✅ settingsRoutes loaded');
} catch (err) {
  console.error('❌ settingsRoutes failed:', err.message);
}

try {
  const { default: investorRoutes } = await import('./routes/investorRoutes.mjs');
  app.use('/api/investors', investorRoutes);
  console.log('✅ investorRoutes loaded');
} catch (err) {
  console.error('❌ investorRoutes failed:', err.message);
}

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('🌉 PitchBridge API is running...');
});

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// ✅ SPA fallback
app.get('*', (req, res) => {
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  }
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route Not Found' });
});

// ✅ Central error handler
import errorHandler from './middleware/errorHandler.mjs';
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});








