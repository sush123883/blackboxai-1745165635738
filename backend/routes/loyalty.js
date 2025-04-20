const express = require('express');
const LoyaltyProgram = require('../models/LoyaltyProgram');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get loyalty program details for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const loyalty = await LoyaltyProgram.findOne({ user: req.user.id });
    if (!loyalty) {
      return res.status(404).json({ message: 'Loyalty program not found' });
    }
    res.json(loyalty);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update loyalty points (e.g., after order completion) - this would typically be called internally
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { points } = req.body;
    let loyalty = await LoyaltyProgram.findOne({ user: req.user.id });
    if (!loyalty) {
      loyalty = new LoyaltyProgram({ user: req.user.id, points });
    } else {
      loyalty.points += points;
      // Update tier based on points
      if (loyalty.points >= 1000) loyalty.tier = 'Platinum';
      else if (loyalty.points >= 500) loyalty.tier = 'Gold';
      else if (loyalty.points >= 200) loyalty.tier = 'Silver';
      else loyalty.tier = 'Bronze';
    }
    await loyalty.save();
    res.json({ message: 'Loyalty points updated', loyalty });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
