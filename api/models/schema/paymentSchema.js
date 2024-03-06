const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  trackId: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  isSuccessFull: {
    type: Boolean,
    required: true,
    default: false,
  },
  gateway: {
    type: String,
    required: true,
  },
  // Add a reference to Subscription
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true, // Set as required if every payment must be linked to a subscription, otherwise adjust accordingly
  },
}, { timestamps: true });

module.exports = paymentSchema;
