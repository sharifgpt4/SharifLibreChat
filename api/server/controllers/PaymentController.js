const Zibal = require('zibal');
const Payment = require('../../models/Payment'); // Adjust the path as necessary
const Subscription = require('../../models/Subscription'); // Adjust the path as necessary

// Create a new subscription
// Create a new payment and initiate a payment request
exports.createPayment = async (req, res) => {
  let zibal = new Zibal({
    merchant: 'zibal',
    logLevel: 2,
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
    const amount = subscription.price.toString(); // Zibal might expect the amount as a string

    // Define callback URL dynamically
    const baseUrl = process.env.BASE_URL || 'http://localhost:3080'; // Adjust according to your environment setup
    const callbackUrl = `${baseUrl}/api/payment/callback`;

    let newPayment = new Payment({
      user: currentUser.id,
      trackId: '', // Will be filled with the response from Zibal
      isSuccessFull: false,
      gateway: 'Zibal',
      subscription: subscriptionId,
    });

    const zibalResult = await zibal.request({
      amount, // Use the fetched subscription price
      callbackUrl,
    });

    newPayment.trackId = zibalResult.trackId;
    await newPayment.save();

    console.log(zibalResult);
    res.status(200).send({ ...zibalResult, paymentId: newPayment.id, ...subscription });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};


exports.callbackPayment = async (req, res) => {
  const { trackId, success } = req.query;

  try {
    const updatedPayment = await Payment.findOneAndUpdate({ trackId }, { isSuccessFull: success === '1' }, { new: true }).populate('subscription');

    if (success === '1' && updatedPayment) {
      const User = require('../../models/User'); // Adjust the path as necessary
      const subscriptionDetails = {
        subscription: updatedPayment.subscription._id,
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + updatedPayment.subscription.duration * 24 * 60 * 60 * 1000), // Assuming duration is in days
      };

      await User.findByIdAndUpdate(updatedPayment.user, {
        $push: { activeSubscriptions: subscriptionDetails },
      }, { new: true });
    }

    console.log(updatedPayment);
    res.redirect(`http://localhost:3080?Payment_success=${success}&Payment_trackId=${trackId}`);
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
