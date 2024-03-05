const Zibal = require('zibal');

// Create a new subscription
exports.createPayment = async (req, res) => {

  let zibal = new Zibal({
    merchant: '65a14466c5d2cb001d8d45ce',
    logLevel: 2,

  });

  // Payment Request
  zibal.request({
    amount: '2000',
    callbackUrl: 'http://localhost:3080/api/payment/callback',
  })
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
      // { trackId: 1533727744287, result: 100, message: 'success', statusMessage: 'با موفقیت تایید شد.' }
    }).catch((err) => {
      console.error(err);
      res.status(400).send(err);
      // { result: 103, message: 'authentication error', statusMessage: '{merchant} غیرفعال' }
    });

};

exports.callbackPayment = async (req, res) => {

  console.log(req);

  res.redirect('http://localhost:3080');

  //res.status(200).send(res);

};
