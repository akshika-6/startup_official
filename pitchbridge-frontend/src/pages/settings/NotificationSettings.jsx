import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const NotificationSettings = () => {
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.put(
        `${API_BASE_URL}/settings/notifications`,
        { preferences: { email, sms } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating preferences');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <input type="checkbox" checked={email} onChange={() => setEmail(!email)} />
          <span className="ml-2">Email Notifications</span>
        </label>
        <label className="block">
          <input type="checkbox" checked={sms} onChange={() => setSms(!sms)} />
          <span className="ml-2">SMS Notifications</span>
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Preferences
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default NotificationSettings;
