const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    comment: 'Duration in days',
  },
  tokenCreditsCost: {
    type: Number,
    required: true,
    comment: 'Cost in tokenCredits for purchasing the subscription',
  },
  isActive: {
    type: Boolean,
    default: true,
    comment: 'Indicates if the subscription is available for purchase',
  },
  description: { // Adding the description field
    type: String,
    required: false, // Adjust according to whether this field is mandatory
    comment: 'Description of the subscription',
  },
}, { timestamps: true });

module.exports = subscriptionSchema;

