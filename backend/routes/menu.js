const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Get all menu items with optional filters and search
router.get('/', async (req, res) => {
  try {
    const { category, search, vegetarian, vegan, glutenFree, spicy } = req.query;
    let filter = { available: true };

    if (category) {
      filter.category = category;
    }
    if (vegetarian === 'true') {
      filter.isVegetarian = true;
    }
    if (vegan === 'true') {
      filter.isVegan = true;
    }
    if (glutenFree === 'true') {
      filter.isGlutenFree = true;
    }
    if (spicy === 'true') {
      filter.isSpicy = true;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const menuItems = await MenuItem.find(filter);
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
