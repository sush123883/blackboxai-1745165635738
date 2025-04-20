const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth'); // Assuming auth middleware for protected routes

const router = express.Router();

// Create new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod } = req.body;
    const userId = req.user.id;

    const order = new Order({
      user: userId,
      items,
      totalPrice,
      paymentMethod,
      status: 'pending',
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get current user's orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate('items.menuItem').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get order by ID (only if belongs to user)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({ _id: req.params.id, user: userId }).populate('items.menuItem');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
