const User = require('../../models/User'); // Make sure this path is correct
const Balance = require('../../models/Balance'); // Adjust the path as necessary

async function balanceController(req, res) {
  

  try {
    // Find the user and their active subscriptions
    const user = await User.findById(req.user.id)
      .populate({
        path: 'activeSubscriptions.subscription',
        model: 'Subscription', // Ensure this matches your Subscription model name
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Separately, find the user's balance from the Balance model
    const balanceDoc = await Balance.findOne({ user: req.user.id }, 'tokenCredits').lean();
    const balance = balanceDoc ? balanceDoc.tokenCredits : 0;

    // Prepare the basic response
    const response = {
      balance,
      hasSubscription: user.activeSubscriptions && user.activeSubscriptions.length > 0 || false,
    };

    // If the user has active subscriptions, enrich the response with the latest subscription details
    if (response.hasSubscription) {
      // Filter active subscriptions based on current date
      const now = new Date();
      const activeSubscriptions = user.activeSubscriptions.filter(sub => sub.expiresAt > now);

      if (activeSubscriptions.length > 0) {
        // Assuming we're interested in the latest active subscription
        const latestSubscription = activeSubscriptions[activeSubscriptions.length - 1];
        response.subscriptionDetails = {
          subscription: latestSubscription.subscription, // Populated subscription details
          activatedAt: latestSubscription.activatedAt,
          expiresAt: latestSubscription.expiresAt,
        };
      } else {
        // Update hasSubscription in case there are no currently active subscriptions
        response.hasSubscription = false;
      }
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while retrieving user details.' });
  }
}

module.exports = balanceController;
