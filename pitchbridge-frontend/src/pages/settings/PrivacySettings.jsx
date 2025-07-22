import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const PrivacySettings = () => {
  const [showProfile, setShowProfile] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.put(
        `${API_BASE_URL}/settings/privacy`,
        { privacy: { showProfile, allowMessages } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating privacy settings');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <input type="checkbox" checked={showProfile} onChange={() => setShowProfile(!showProfile)} />
          <span className="ml-2">Show My Profile</span>
        </label>
        <label className="block">
          <input type="checkbox" checked={allowMessages} onChange={() => setAllowMessages(!allowMessages)} />
          <span className="ml-2">Allow Messages</span>
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Privacy Settings
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default PrivacySettings;

