import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.mjs";

import userRoutes from "./routes/userroutes.mjs";
import startupRoutes from "./routes/startuproutes.mjs";
import pitchRoutes from "./routes/pitchroutes.mjs";
import meetingRoutes from "./routes/meetingroutes.mjs";
import notificationRoutes from "./routes/notificationroutes.mjs";
import messageRoutes from "./routes/messageroutes.mjs";
import ratingRoutes from "./routes/ratingroutes.mjs";
import commentRoutes from "./routes/commentroutes.mjs";
import investorRoutes from "./routes/investorroutes.mjs";
import investorPreferenceRoutes from "./routes/InvestorPreferenceroutes.mjs";
import dashboardRoutes from "./routes/dashboardroutes.mjs";
import aiMatchRoutes from "./routes/aiMatchRoutes.mjs"; // ✅ NEW IMPORT
import errorHandler from "./middleware/errorHandler.mjs";

dotenv.config(); 
connectDB(); 

const app = express();
app.use(express.json()); 
app.use(
  cors({
    origin: [
      "http://localhost:5173",                        // For local development
      "http://localhost:3000",                        // Just in case you run frontend here
      "https://precious-pika-fd3ec6.netlify.app",     // <--- YOUR NEW LIVE SITE (Found in your screenshot)
      "https://bejewelled-souffle-3f03df.netlify.app" // <--- Your old one (good to keep just in case)
    ],
    credentials: true,
  }),
);
app.use(helmet());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/pitches", pitchRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/investor-preferences", investorPreferenceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai-match", aiMatchRoutes); // ✅ NEW ROUTE

app.get("/", (req, res) => {
  res.send("🌉 PitchBridge API is running...");
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});