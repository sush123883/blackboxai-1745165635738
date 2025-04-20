const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  discountPercentage: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Promotion', promotionSchema);
