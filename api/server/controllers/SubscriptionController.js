const { Subscription } = require('~/models');

// Create a new subscription
exports.createSubscription = async (req, res) => {
  console.log("HERE S")
  try {
    const subscription = new Subscription(req.body);
    await subscription.save();
    res.status(201).send(subscription);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({});
    res.send(subscriptions);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single subscription by id
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).send();
    }
    res.send(subscription);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a subscription
exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subscription) {
      return res.status(404).send();
    }
    res.send(subscription);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription) {
      return res.status(404).send();
    }
    res.send(subscription);
  } catch (error) {
    res.status(500).send(error);
  }
};
