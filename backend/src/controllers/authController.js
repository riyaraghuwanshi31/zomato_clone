require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { name, email, phone, address, state, city, pincode } = req.body;

  // Check for missing fields
  if (!name || !email || !phone || !address || !state || !city || !pincode) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create the user in the database
    const user = await User.create({ name, email, phone, address, state, city, pincode });

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error('Error registering user:', error); // Log the full error

    if (error.name === 'ValidationError') {
      // Handle validation errors
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }

    if (error.code === 11000) {
      // Handle duplicate key errors (e.g., email or phone already exists)
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${duplicateField} already exists` });
    }

    // Handle any other errors
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};




// Login User
exports.loginUser = async (req, res) => {
  const { email } = req.body;

  // Check for missing fields
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};