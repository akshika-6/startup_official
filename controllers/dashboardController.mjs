export const getDashboardCards = (req, res) => {
  const { role } = req.user;

  let cards = [];

  if (role === 'founder') {
    cards = [
      { title: 'Create Startup', path: '/create-startup', icon: 'Rocket' },
      { title: 'Submit Pitch', path: '/submit-pitch', icon: 'Briefcase' },
      { title: 'Notifications', path: '/notifications', icon: 'Bell' },
    ];
  } else if (role === 'investor') {
    cards = [
      { title: 'Browse Startups', path: '/startups', icon: 'Briefcase' },
      { title: 'Give Ratings', path: '/rate-startup', icon: 'Star' },
      { title: 'Notifications', path: '/notifications', icon: 'Bell' },
    ];
  } else if (role === 'admin') {
    cards = [
      { title: 'Manage Users', path: '/admin/users', icon: 'Users' },
      { title: 'View Platform Activity', path: '/admin/activity', icon: 'ActivityBarChart' },
    ];
  }

  res.json({ cards });
};
