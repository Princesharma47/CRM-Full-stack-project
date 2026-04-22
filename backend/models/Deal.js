const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    dealValue: {
      type: Number,
      required: true,
    },
    stage: {
      type: String,
      enum: ['Negotiation', 'Agreement', 'Closed', 'Lost'],
      default: 'Negotiation',
    },
    commission: {
      type: Number,
      default: 0,
    },
    // Stored as plain strings for flexibility (no ObjectId ref required)
    property:      { type: String },
    assignedAgent: { type: String },
    notes:         { type: String },
    closedAt:      { type: Date },
  },
  { timestamps: true }
);

// Auto-set closedAt when stage becomes "Closed"
dealSchema.pre('save', function (next) {
  if (this.isModified('stage') && this.stage === 'Closed' && !this.closedAt) {
    this.closedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Deal', dealSchema);
