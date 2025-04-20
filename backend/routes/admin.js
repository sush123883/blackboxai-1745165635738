const express = require('express');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin'); // Middleware to check admin role

const router = express.Router();

// Middleware to protect admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Menu Management
router.post('/menu', async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json({ message: 'Menu item added', menuItem });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/menu/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item updated', menuItem });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/menu/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Order Management
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.menuItem').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

const { emitOrderStatusUpdate } = require('../socket');

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();

    // Emit real-time order status update via socket.io
    emitOrderStatusUpdate(order._id.toString(), order.status);

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// User Management
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Additional admin routes for promotions, inventory, feedback analysis can be added here

module.exports = router;
