const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      match: [/^\d{10}$/, 'Phone number must be 10 digits'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Pincode must be 6 digits'],
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create the model
module.exports = mongoose.model('User', userSchema);
