const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');

// Place Order
router.post('/placeOrder', async (req, res) => {
  const { restaurantEmail, restaurantName, userEmail, userName, items, totalAmount, status = 'Pending' } = req.body;

  try {
    const order = new Order({
      restaurantEmail,
      restaurantName,
      userEmail,
      userName,
      items,
      totalAmount,
      status,
      createdAt: Date.now()
    });
    await order.save();

    // Emit the new order to the restaurant
    req.io.emit('newOrder', order);

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
      order
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({
      message: 'Failed to place order',
      error: error.message
    });
  }
});

// Get Orders for a Restaurant
router.get('/', async (req, res) => {
  const { restaurantEmail } = req.query;

  if (!restaurantEmail) {
    return res.status(400).json({ message: 'Restaurant email is required' });
  }

  try {
    const orders = await Order.find({ restaurantEmail }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
});


// Get Order Status
router.get('/orderStatus/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (order) {
      res.status(200).json({ status: order.status });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order status', error });
  }
});

// Update Order Status
router.patch('/updateStatus/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: 'Invalid Order ID format' });
  }

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (order) {
      req.io.emit('orderUpdated', order);

      res.status(200).json({
        message: 'Order status updated successfully',
        updatedOrder: order,
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      message: 'Failed to update order status',
      error: error.message,
    });
  }
});

module.exports = router;