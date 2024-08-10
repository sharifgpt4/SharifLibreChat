const Zibal = require('../services/Zibal');
const Payment = require('../../models/Payment'); // Adjust the path as necessary
const Subscription = require('../../models/Subscription');
const { Transaction } = require('~/models/Transaction');
const User = require('~/models/User'); // Adjust the path as necessary
require('dotenv').config();

// Create a new subscription
// Create a new payment and initiate a payment request
exports.createPayment = async (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://chat.qstarmachine.com'; // Adjust according to your environment setup
  const callbackUrl = `${baseUrl}/api/payment/callback`;
  const merchant = process.env.ZIBAL_MERCHANT ; // Adjust according to your environment setup

  Zibal.init({
    merchant: merchant,
    //merchant: 'zibal', // TEST
    logLevel: 2,
    callbackUrl: callbackUrl,
  });

  try {
    const { subscriptionId } = req.body;
    const currentUser = req.user;

    // Fetch the subscription price
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).send({ message: 'Subscription not found' });
    }
    console.log(subscription);
    const amount = (subscription.price * 10).toString(); // Zibal might expect the amount as a string

    // Define callback URL dynamically

    let newPayment = new Payment({
      user: currentUser.id,
      trackId: '-', // Will be filled with the response from Zibal
      isSuccessFull: false,
      gateway: 'Zibal',
      subscription: subscriptionId,
    });

    const zibalResult = await Zibal.requestPayment(amount);

    newPayment.trackId = zibalResult.trackId;
    console.log('Zibal Response:');
    console.log(zibalResult);
    await newPayment.save();

    res.status(200).send({ ...zibalResult, paymentId: newPayment.id, ...subscription });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

exports.callbackPayment = async (req, res) => {
  const { trackId, success } = req.query;
  console.log(trackId);

  try {
    // First, find the payment and update its status based on the callback query parameters
    const updatedPayment = await Payment.findOneAndUpdate(
      { trackId },
      { isSuccessFull: success === '1' },
      { new: true },
    ).populate('subscription');

    // Proceed only if the payment was successful and the payment record was found
    if (success !== '1' || !updatedPayment) {
      // Redirect indicating the payment was not successful or not found
      return res.redirect(`https://chat.qstarmachine.com?Payment_success=${success}&Payment_trackId=${trackId}&error=Payment record not found or was unsuccessful`);
    }

    try {
      const baseUrl = process.env.BASE_URL || 'https://chat.qstarmachine.com'; // Adjust according to your environment setup
      const callbackUrl = `${baseUrl}/api/payment/callback`;
      const merchant = process.env.ZIBAL_MERCHANT ; // Adjust according to your environment setup

      Zibal.init({
        merchant: merchant,
        //merchant: 'zibal', // TEST
        logLevel: 2,
        callbackUrl: callbackUrl,
      });

      const verifyResult = await Zibal.verify(trackId);
      console.log(verifyResult.success);
    } catch (err) {
      console.error(err);
      res.redirect('https://chat.qstarmachine.com');
      return res.status(400).send({ message: 'Arleady Verified' });
    }

    console.log('Zibal DOne...');
    const User = require('../../models/User'); // Adjust the path as necessary

    // Find the user associated with the payment
    const user = await User.findById(updatedPayment.user).populate('activeSubscriptions.subscription');
    if (!user) {
      console.error('User not found');
      return res.status(404).send({ message: 'User not found' });
    }

    console.log('Checking user Subs');
    // Check if the user already has an active subscription from this payment
    const alreadySubscribed = user.activeSubscriptions.some(subscriptionDetail =>
      subscriptionDetail.subscription.trackId === trackId,
    );

    // If the user already has an active subscription for this trackId, prevent adding another
    if (!alreadySubscribed) {
      // Add subscription details to the user's active subscriptions
      const subscriptionDetails = {
        subscription: updatedPayment.subscription._id,
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + updatedPayment.subscription.duration * 24 * 60 * 60 * 1000), // Assuming duration is in days
      };

      // Update user with new subscription details. Replace existing subscriptions.
      await User.findByIdAndUpdate(user._id, {
        $set: { activeSubscriptions: [subscriptionDetails] }, // Sets activeSubscriptions to an array with only the latest subscription
      }, { new: true });
    } else {
      console.log('User already has this subscription active, skipping...');
    }

    // Regardless of subscription status, proceed with token credits addition for successful payment
    await Transaction.create({
      user: user._id,
      tokenType: 'credits',
      context: 'payment',
      rawAmount: updatedPayment.subscription.tokenCreditsCost,
    });
    console.log('add balance too user');

    // Redirect with payment success status
    res.redirect(`https://chat.qstarmachine.com?Payment_success=${success}&Payment_trackId=${trackId}`);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

// Assuming the same require statements at the top

// Retrieve all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

// Retrieve a single payment by ID
exports.getOnePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).send({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

// Update a payment's details
exports.editPayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) {
      return res.status(404).send({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

// Delete a payment (optional)
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).send({ message: 'Payment not found' });
    }
    res.status(200).send({ message: 'Payment successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};
