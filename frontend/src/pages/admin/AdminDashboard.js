import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

function AdminDashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [popularItems, setPopularItems] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [orderTrends, setOrderTrends] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: 'Bearer ' + token };

      const salesRes = await fetch('/api/analytics/total-sales', { headers });
      const salesData = await salesRes.json();
      if (salesRes.ok) setTotalSales(salesData.totalSales);

      const popularRes = await fetch('/api/analytics/popular-items', { headers });
      const popularData = await popularRes.json();
      if (popularRes.ok) setPopularItems(popularData);

      const userRes = await fetch('/api/analytics/user-registrations', { headers });
      const userData = await userRes.json();
      if (userRes.ok) setUserCount(userData.count);

      const trendsRes = await fetch('/api/analytics/order-trends', { headers });
      const trendsData = await trendsRes.json();
      if (trendsRes.ok) setOrderTrends(trendsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Total Sales</h3>
          <p className="text-2xl font-bold">₹{totalSales.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">User Registrations</h3>
          <p className="text-2xl font-bold">{userCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Popular Menu Items</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={popularItems} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Order Trends (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={orderTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;
