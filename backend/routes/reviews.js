const express = require('express');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get reviews for a menu item
router.get('/:menuItemId', async (req, res) => {
  try {
    const reviews = await Review.find({ menuItem: req.params.menuItemId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Submit a review for a menu item
router.post('/:menuItemId', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const existingReview = await Review.findOne({ user: req.user.id, menuItem: req.params.menuItemId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }
    const review = new Review({
      user: req.user.id,
      menuItem: req.params.menuItemId,
      rating,
      comment
    });
    await review.save();
    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
