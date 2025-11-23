import { User, Startup, InvestorPreference, Pitch, Meeting, Notification, Message, Rating, Comment } from "../Schema.mjs";
import mongoose from "mongoose";

// @desc    Get investor dashboard statistics
// @route   GET /api/dashboard/investor
// @access  Protected (Investors only)
export const getInvestorDashboardStats = async (req, res, next) => {
  try {
    const investorId = req.user._id;

    // Get investment preferences/interests
    const totalPreferences = await InvestorPreference.countDocuments({
      investorId,
    });

    const activePreferences = await InvestorPreference.countDocuments({
      investorId,
      status: "active",
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPreferences = await InvestorPreference.find({
      investorId,
      submittedAt: { $gte: thirtyDaysAgo },
    }).sort({ submittedAt: -1 });

    // Get this month's activity
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisMonthPreferences = await InvestorPreference.countDocuments({
      investorId,
      submittedAt: { $gte: startOfMonth },
    });

    // Get unique industries
    const preferences = await InvestorPreference.find({ investorId });
    const uniqueIndustries = new Set();
    preferences.forEach(pref => {
      if (pref.areasOfInterest) {
        pref.areasOfInterest.split(',').forEach(industry => {
          uniqueIndustries.add(industry.trim());
        });
      }
    });

    // Get portfolio companies (pitches investor has shown interest in)
    const portfolioCompanies = await Pitch.find({
      investorId,
      status: { $in: ['interested', 'viewed'] }
    }).populate('startupId', 'startupName domain stage targetRaise')
     .sort({ createdAt: -1 })
     .limit(10);

    // Get recent activity from various sources
    const recentActivity = await Promise.all([
      // Recent pitch activities
      Pitch.find({ investorId })
        .populate('startupId', 'startupName')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // Recent messages
      Message.find({ receiverId: investorId })
        .populate('senderId', 'name')
        .sort({ timestamp: -1 })
        .limit(3)
        .lean(),

      // Recent meetings
      Meeting.find({
        pitchId: { $in: await Pitch.find({ investorId }).distinct('_id') }
      })
        .populate('pitchId')
        .sort({ scheduledAt: -1 })
        .limit(3)
        .lean()
    ]);

    // Format recent activity
    const formattedActivity = [];

    // Add pitch activities
    recentActivity[0].forEach(pitch => {
      formattedActivity.push({
        id: pitch._id,
        type: 'New Deal',
        description: `Evaluated "${pitch.startupId?.startupName || 'Unknown'}" pitch.`,
        time: pitch.createdAt,
        icon: 'lightbulb'
      });
    });

    // Add messages
    recentActivity[1].forEach(message => {
      formattedActivity.push({
        id: message._id,
        type: 'Message',
        description: `New message from ${message.senderId?.name || 'Unknown'}`,
        time: message.timestamp,
        icon: 'mail'
      });
    });

    // Sort by time and limit
    formattedActivity.sort((a, b) => new Date(b.time) - new Date(a.time));
    const limitedActivity = formattedActivity.slice(0, 10);

    // Get investment stage distribution
    const stageDistribution = await InvestorPreference.aggregate([
      { $match: { investorId } },
      { $group: { _id: '$investmentAmount', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get industry distribution
    const industryDistribution = await InvestorPreference.aggregate([
      { $match: { investorId } },
      { $group: { _id: '$areasOfInterest', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Calculate ROI and portfolio value (mock data for now)
    const portfolioStats = {
      currentValue: portfolioCompanies.length * 500000, // Mock calculation
      roi: Math.random() * 20 + 5, // Mock ROI between 5-25%
      activeInvestments: portfolioCompanies.length,
      exitedInvestments: Math.floor(Math.random() * 5), // Mock exits
    };

    res.status(200).json({
      success: true,
      data: {
        portfolioStats,
        opportunitiesStats: {
          newOpportunities: await Startup.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
          }),
          trendingStartups: await Startup.countDocuments({
            stage: 'revenue'
          }),
        },
        dealFlowStats: {
          activeDeals: await Pitch.countDocuments({
            investorId,
            status: 'interested'
          }),
          dueDiligence: await Meeting.countDocuments({
            pitchId: { $in: await Pitch.find({ investorId }).distinct('_id') },
            status: 'scheduled'
          }),
        },
        portfolioCompanies: portfolioCompanies.map(pitch => ({
          id: pitch.startupId?._id,
          name: pitch.startupId?.startupName || 'Unknown',
          industry: pitch.startupId?.domain || 'Unknown',
          stage: pitch.startupId?.stage || 'Unknown',
          invested: Math.floor(Math.random() * 2000000) + 500000, // Mock
          current: Math.floor(Math.random() * 3000000) + 1000000, // Mock
          nextRound: 'TBD'
        })),
        recentActivity: limitedActivity,
        upcomingMeetings: await Meeting.find({
          pitchId: { $in: await Pitch.find({ investorId }).distinct('_id') },
          status: 'scheduled',
          scheduledAt: { $gte: new Date() }
        })
          .populate('pitchId')
          .sort({ scheduledAt: 1 })
          .limit(5),
        preferences: {
          total: totalPreferences,
          active: activePreferences,
          thisMonth: thisMonthPreferences,
          industries: uniqueIndustries.size,
          stageDistribution,
          industryDistribution,
        }
      }
    });
  } catch (error) {
    console.error("Error fetching investor dashboard stats:", error);
    next(error);
  }
};

// @desc    Get founder dashboard statistics
// @route   GET /api/dashboard/founder
// @access  Protected (Founders only)
export const getFounderDashboardStats = async (req, res, next) => {
  try {
    const founderId = req.user._id;

    // Get founder's startups
    const startups = await Startup.find({ founderId });
    const startupIds = startups.map(s => s._id);

    // Basic stats
    const totalStartups = startups.length;
    const totalPitches = await Pitch.countDocuments({
      startupId: { $in: startupIds }
    });

    // Pitch status distribution
    const pitchStats = await Pitch.aggregate([
      { $match: { startupId: { $in: startupIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const pitchStatusCounts = {
      pending: 0,
      viewed: 0,
      interested: 0,
      rejected: 0
    };

    pitchStats.forEach(stat => {
      pitchStatusCounts[stat._id] = stat.count;
    });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get meetings
    const upcomingMeetings = await Meeting.find({
      pitchId: { $in: await Pitch.find({ startupId: { $in: startupIds } }).distinct('_id') },
      status: 'scheduled',
      scheduledAt: { $gte: new Date() }
    })
      .populate({
        path: 'pitchId',
        populate: { path: 'investorId', select: 'name email' }
      })
      .sort({ scheduledAt: 1 })
      .limit(5);

    // Get messages
    const recentMessages = await Message.find({
      receiverId: founderId
    })
      .populate('senderId', 'name')
      .sort({ timestamp: -1 })
      .limit(10);

    // Get ratings for startups
    const ratings = await Rating.find({
      startupId: { $in: startupIds }
    });

    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
      : 0;

    // Get funding progress
    const totalTargetRaise = startups.reduce((sum, s) => sum + (s.targetRaise || 0), 0);
    const currentFunding = totalTargetRaise * 0.3; // Mock 30% funded

    // Recent activity
    const recentActivity = [];

    // Add pitch activities
    const recentPitches = await Pitch.find({
      startupId: { $in: startupIds },
      createdAt: { $gte: thirtyDaysAgo }
    })
      .populate('investorId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    recentPitches.forEach(pitch => {
      recentActivity.push({
        id: pitch._id,
        type: 'Pitch Activity',
        description: `${pitch.investorId?.name || 'An investor'} ${pitch.status} your pitch`,
        time: pitch.createdAt,
        icon: 'trending-up'
      });
    });

    // Add message activities
    recentMessages.slice(0, 5).forEach(message => {
      recentActivity.push({
        id: message._id,
        type: 'Message',
        description: `New message from ${message.senderId?.name || 'Unknown'}`,
        time: message.timestamp,
        icon: 'mail'
      });
    });

    // Sort by time
    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Chart data for pitch views over time
    const pitchViewsData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Pitch Views',
        data: [12, 19, 15, 25, 32, 28], // Mock data
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    };

    // Investor interest data
    const investorInterestData = {
      labels: ['Interested', 'Viewed', 'Pending', 'Rejected'],
      datasets: [{
        data: [
          pitchStatusCounts.interested,
          pitchStatusCounts.viewed,
          pitchStatusCounts.pending,
          pitchStatusCounts.rejected
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }]
    };

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStartups,
          totalPitches,
          avgRating: Math.round(avgRating * 10) / 10,
          upcomingMeetings: upcomingMeetings.length
        },
        fundingStats: {
          totalTargetRaise,
          currentFunding,
          fundingPercentage: Math.round((currentFunding / totalTargetRaise) * 100) || 0
        },
        pitchStats: pitchStatusCounts,
        recentActivity: recentActivity.slice(0, 10),
        upcomingMeetings,
        startups: startups.map(startup => ({
          id: startup._id,
          name: startup.startupName,
          domain: startup.domain,
          stage: startup.stage,
          targetRaise: startup.targetRaise,
          pitchCount: pitchStats.reduce((sum, stat) => sum + stat.count, 0)
        })),
        chartData: {
          pitchViews: pitchViewsData,
          investorInterest: investorInterestData
        }
      }
    });
  } catch (error) {
    console.error("Error fetching founder dashboard stats:", error);
    next(error);
  }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/dashboard/admin
// @access  Protected (Admin only)
export const getAdminDashboardStats = async (req, res, next) => {
  try {
    // Basic user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      verified: true
    });

    // User role distribution
    const userRoleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const roleDistribution = {
      founder: 0,
      investor: 0,
      admin: 0
    };

    userRoleStats.forEach(stat => {
      roleDistribution[stat._id] = stat.count;
    });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Startup statistics
    const totalStartups = await Startup.countDocuments();
    const startupsThisMonth = await Startup.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Startup stage distribution
    const startupStageStats = await Startup.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 } } }
    ]);

    // Investment activity
    const totalPreferences = await InvestorPreference.countDocuments();
    const totalPitches = await Pitch.countDocuments();
    const totalMeetings = await Meeting.countDocuments();

    // Recent registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt verified');

    // Platform activity summary
    const platformActivity = await Promise.all([
      Message.countDocuments({ timestamp: { $gte: sevenDaysAgo } }),
      Pitch.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Meeting.countDocuments({ scheduledAt: { $gte: sevenDaysAgo } }),
      Rating.countDocuments({ timestamp: { $gte: sevenDaysAgo } })
    ]);

    // System health metrics
    const systemHealth = {
      totalUsers,
      activeUsers,
      userGrowth: Math.round(((newUsersThisWeek / totalUsers) * 100) * 100) / 100,
      platformEngagement: Math.round(((platformActivity.reduce((a, b) => a + b, 0) / totalUsers) * 100) * 100) / 100
    };

    // Monthly user registration data for chart
    const monthlyUserData = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Content statistics
    const contentStats = {
      totalStartups,
      totalPitches,
      totalMeetings,
      totalPreferences,
      totalMessages: await Message.countDocuments(),
      totalRatings: await Rating.countDocuments(),
      totalComments: await Comment.countDocuments()
    };

    res.status(200).json({
      success: true,
      data: {
        userStats: {
          totalUsers,
          activeUsers,
          newUsersThisWeek,
          roleDistribution
        },
        startupStats: {
          totalStartups,
          startupsThisMonth,
          stageDistribution: startupStageStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {})
        },
        platformActivity: {
          messagesThisWeek: platformActivity[0],
          pitchesThisWeek: platformActivity[1],
          meetingsThisWeek: platformActivity[2],
          ratingsThisWeek: platformActivity[3]
        },
        systemHealth,
        contentStats,
        recentUsers,
        monthlyUserData: monthlyUserData.map(item => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          users: item.count
        })),
        recentActivity: await Promise.all([
          // Recent startups
          Startup.find()
            .populate('founderId', 'name')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()
            .then(startups => startups.map(startup => ({
              id: startup._id,
              type: 'New Startup',
              description: `${startup.founderId?.name || 'Someone'} created "${startup.startupName}"`,
              time: startup.createdAt,
              icon: 'building'
            }))),

          // Recent users
          User.find({ createdAt: { $gte: sevenDaysAgo } })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()
            .then(users => users.map(user => ({
              id: user._id,
              type: 'New User',
              description: `${user.name} joined as ${user.role}`,
              time: user.createdAt,
              icon: 'user-plus'
            })))
        ]).then(activities => activities.flat().sort((a, b) => new Date(b.time) - new Date(a.time)))
      }
    });
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    next(error);
  }
};
