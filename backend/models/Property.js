const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Apartment', 'House', 'Commercial', 'Land'],
      required: true,
    },
    images: {
      type: [String], // Array of image paths/urls
      default: [],
    },
    status: {
      type: String,
      enum: ['Available', 'Sold', 'Pending'],
      default: 'Available',
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
