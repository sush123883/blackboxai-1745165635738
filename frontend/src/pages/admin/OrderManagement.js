import React, { useState, useEffect } from 'react';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/orders', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        setMessage(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/admin/orders/" + orderId + "/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Order status updated");
        fetchOrders();
      } else {
        setMessage(data.message || "Failed to update order status");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Order ID: {order._id}</h3>
      <select
        value={order.status}
        onChange={(e) => handleStatusChange(order._id, e.target.value)}
        className="border border-gray-300 rounded px-3 py-1"
      >
        <option value="pending">Pending</option>
        <option value="preparing">Preparing</option>
        <option value="ready for pickup">Ready for Pickup</option>
        <option value="out for delivery">Out for Delivery</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
              </div>
              <p className="mb-2">User: {order.user.name} ({order.user.email})</p>
              <ul className="mb-2">
                {order.items.map(item => (
                  <li key={item._id} className="mb-1">
                    {item.menuItem.name} x {item.quantity}
                    {item.customizations && <span> (Custom: {item.customizations})</span>}
                    {item.specialInstructions && <span> (Instructions: {item.specialInstructions})</span>}
                  </li>
                ))}
              </ul>
              <p className="font-bold">Total: ₹{order.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
