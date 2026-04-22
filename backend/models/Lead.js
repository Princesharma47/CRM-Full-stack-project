const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
    },
    source: {
      type: String,
      enum: ['Website', 'Facebook', 'Call', 'Referral', 'Ad', 'Other'],
      default: 'Website',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Negotiation', 'Closed', 'Lost'],
      default: 'New',
    },
    // assignedTo keeps backward compat with existing leadController.js
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // alias used by newer code
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
