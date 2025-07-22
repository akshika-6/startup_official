import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <ul className="space-y-3">
        <li><Link to="/settings/username" className="text-blue-600 hover:underline">Change Username</Link></li>
        <li><Link to="/settings/email" className="text-blue-600 hover:underline">Change Email</Link></li>
        <li><Link to="/settings/password" className="text-blue-600 hover:underline">Change Password</Link></li>
        <li><Link to="/settings/profile-picture" className="text-blue-600 hover:underline">Update Profile Picture</Link></li>
        <li><Link to="/settings/notifications" className="text-blue-600 hover:underline">Notification Preferences</Link></li>
        <li><Link to="/settings/privacy" className="text-blue-600 hover:underline">Privacy Settings</Link></li>
        <li><Link to="/settings/delete" className="text-red-600 hover:underline">Delete Account</Link></li>
      </ul>
    </div>
  );
};

export default Settings;

