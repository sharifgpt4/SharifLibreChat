// Existing user routes
const express = require('express');
const requireJwtAuth = require('../middleware/requireJwtAuth');

// Subscription controller imports
const {
  createPayment,
  callbackPayment,
  getAllPayments,
  getOnePayment,
  deletePayment,
  editPayment,

} = require('../controllers/PaymentController');

const router = express.Router();

// Subscription routes
router.post('/new', requireJwtAuth, createPayment);
router.get('/callback', callbackPayment);

router.get('/get_all_payment', requireJwtAuth, getAllPayments);
router.get('/:id', requireJwtAuth, getOnePayment);
router.put('/:id', requireJwtAuth, editPayment);
router.delete('/:id', requireJwtAuth, deletePayment);

module.exports = router;
