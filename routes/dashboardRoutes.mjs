import express from 'express';
import { protect } from '../middleware/authMiddleware.mjs';
import { getDashboardData } from "../controllers/dashboardController.mjs";


const router = express.Router();

router.get('/', protect, async (req, res) => {
  const role = req.user.role;
  const cards = [];

  if (role === 'founder') {
    cards.push(
      { title: "My Startups", path: "/startups", icon: "Rocket" },
      { title: "Submit Pitch", path: "/submit-pitch", icon: "Briefcase" },
      { title: "Notifications", path: "/notifications", icon: "Bell" }
    );
  } else if (role === 'investor') {
    cards.push(
      { title: "Explore Startups", path: "/startups", icon: "Rocket" },
      { title: "Preferences", path: "/preferences", icon: "Star" },
      { title: "Notifications", path: "/notifications", icon: "Bell" }
    );
  }

  res.json({ cards });
});

export default router;
