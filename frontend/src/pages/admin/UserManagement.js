import React, { useState, useEffect } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setMessage(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <div key={user._id} className="bg-white rounded shadow p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserManagement;
