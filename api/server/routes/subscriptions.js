// Existing user routes
const express = require('express');
const requireJwtAuth = require('../middleware/requireJwtAuth');

// Subscription controller imports
const {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} = require('../controllers/SubscriptionController'); // Adjust the path as necessary

const router = express.Router();

// Subscription routes
router.post('/', requireJwtAuth, createSubscription);
router.get('/get_all_subscription', requireJwtAuth, getAllSubscriptions);
router.get('/:id', requireJwtAuth, getSubscriptionById);
router.put('/:id', requireJwtAuth, updateSubscription);
router.delete('/:id', requireJwtAuth, deleteSubscription);

module.exports = router;
