const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get recommended menu items based on user's order history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user's past orders
    const orders = await Order.find({ user: userId }).populate('items.menuItem');

    // Collect menu item IDs from past orders
    const orderedItemIds = new Set();
    orders.forEach(order => {
      order.items.forEach(item => {
        orderedItemIds.add(item.menuItem._id.toString());
      });
    });

    // Find other menu items not ordered by user, limit 5
    const recommendations = await MenuItem.find({
      _id: { $nin: Array.from(orderedItemIds) },
      available: true
    }).limit(5);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
