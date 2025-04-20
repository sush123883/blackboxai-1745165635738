const express = require('express');
const Promotion = require('../models/Promotion');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Get active promotions for all users
router.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.find({ active: true, validFrom: { $lte: new Date() }, validTo: { $gte: new Date() } });
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin routes to create, update, delete promotions
router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/', async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.status(201).json({ message: 'Promotion created', promotion });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json({ message: 'Promotion updated', promotion });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json({ message: 'Promotion deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
