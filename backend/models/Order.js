const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, default: 1 },
      customizations: { type: String }, // e.g., extra toppings, spice level
      specialInstructions: { type: String },
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready for pickup', 'out for delivery', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'wallet', 'cash_on_delivery'],
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
