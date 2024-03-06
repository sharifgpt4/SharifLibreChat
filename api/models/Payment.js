const mongoose = require('mongoose');
const paymentSchema = require('./schema/paymentSchema');

module.exports = mongoose.model('Payments', paymentSchema);
