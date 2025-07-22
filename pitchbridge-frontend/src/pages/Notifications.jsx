import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE_URL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Fetched notifications:", data); // 🐞 Debug log
        setNotifications(data.data || []); // ✅ Assign only array
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <section className="min-h-screen pt-24 px-4 sm:px-8 dark:bg-gray-950 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((note, index) => (
            <li
              key={index}
              className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <p className="font-semibold">
                {note.title || "New Notification"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {note.message}
              </p>
              <p className="text-xs text-right text-gray-400 mt-1">
                {note.timestamp
                  ? new Date(note.timestamp).toLocaleString()
                  : "Unknown time"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Notifications;
