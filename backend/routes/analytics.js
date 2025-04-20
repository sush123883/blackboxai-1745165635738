const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Get total sales
router.get('/total-sales', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Completed' });
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get popular menu items
router.get('/popular-items', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Completed' }).populate('items.menuItem');
    const itemCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const id = item.menuItem._id.toString();
        itemCount[id] = (itemCount[id] || 0) + item.quantity;
      });
    });
    const popularItems = Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const popularMenuItems = await MenuItem.find({ _id: { $in: popularItems.map(i => i[0]) } });
    res.json(popularMenuItems);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user registrations count
router.get('/user-registrations', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get order trends (orders per day for last 7 days)
router.get('/order-trends', async (req, res) => {
  try {
    const today = new Date();
    const pastWeek = new Date(today);
    pastWeek.setDate(today.getDate() - 6);

    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: pastWeek, $lte: today }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
