const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurantEmail: {type:String, required: true},
  restaurantName:{type: String, required: true},
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      // quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Order status
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema); 