const mongoose = require('mongoose');
const subscriptionSchema = require('./schema/subscription.js');

subscriptionSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    price: this.price,
    duration: this.duration,
    description: this.description,
    tokenCreditsCost: this.tokenCreditsCost,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
