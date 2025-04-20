import React, { useState, useEffect } from 'react';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
      } else {
        setError(data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(\`/api/notifications/\${id}/read\`, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  return (
    <div className="fixed top-4 right-4 w-80 max-h-[80vh] overflow-y-auto bg-white shadow-lg rounded p-4 z-50">
      <h3 className="text-lg font-bold mb-2">Notifications</h3>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={\`p-2 rounded cursor-pointer \${notification.read ? 'bg-gray-100' : 'bg-yellow-100'}\`}
              onClick={() => markAsRead(notification._id)}
              title="Click to mark as read"
            >
              <strong>{notification.title}</strong>
              <p className="text-sm">{notification.message}</p>
              <small className="text-gray-500">{new Date(notification.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
