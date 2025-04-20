import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function Orders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Join rooms for each order to receive real-time updates
    orders.forEach(order => {
      socket.emit('joinOrderRoom', order._id);
    });

    socket.on('orderStatusUpdate', ({ orderId, status }) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );
      setMessage(`Order ${orderId} status updated to ${status}`);
    });

    return () => {
      orders.forEach(order => {
        socket.emit('leaveOrderRoom', order._id);
      });
      socket.off('orderStatusUpdate');
    };
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Order ID: {order._id}</h3>
              <p>Status: <span className="font-bold">{order.status}</span></p>
              <ul className="mb-2">
                {order.items.map(item => (
                  <li key={item._id}>
                    {item.menuItem.name} x {item.quantity}
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

export default Orders;
