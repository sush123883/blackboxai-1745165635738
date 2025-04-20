const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Snacks, Main Course, Desserts, Beverages
  description: { type: String },
  ingredients: { type: [String] },
  nutritionalInfo: { type: String },
  imageUrl: { type: String },
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  isNonVegetarian: { type: Boolean, default: false },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
