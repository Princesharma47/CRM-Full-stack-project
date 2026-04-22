const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Residential', 'Commercial', 'Plot', 'Villa', 'Apartment', 'House', 'Land'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Sold', 'Pending', 'Reserved'],
      default: 'Available',
    },
    amenities: [String],
    description: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    // addedBy keeps backward compat with propertyController.js
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // assignedAgent used by newer code
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
