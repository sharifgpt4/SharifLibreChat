// Existing user routes
const express = require('express');
const requireJwtAuth = require('../middleware/requireJwtAuth');

// Subscription controller imports
const {
  createPayment,
  callbackPayment,

} = require('../controllers/PaymentController'); // Adjust the path as necessary

const router = express.Router();

// Subscription routes
router.post('/new', createPayment);
router.get('/callback', callbackPayment);

module.exports = router;
