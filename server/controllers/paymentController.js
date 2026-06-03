const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_secret_key_indiacart24_2026';
let stripe;

try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.log('Stripe initialization skipped - no secret key provided');
}

// @desc    Get Stripe Publishable Key
// @route   GET /api/payment/config
// @access  Private
exports.getStripeKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_publishable_key_indiacart24_2026',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required.',
      });
    }

    // Convert INR to Paise (e.g. ₹500 is 50000 paise)
    const amountInPaise = Math.round(amount * 100);

    // If real Stripe is configured, create a real intent
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPaise,
        currency: 'inr',
        metadata: { userId: req.user.id },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        isMock: false,
      });
    }

    // Otherwise, return a mock client secret for instant development testing
    res.status(200).json({
      success: true,
      clientSecret: `mock_secret_${Date.now()}_client_secret_${Math.random().toString(36).substr(2, 9)}`,
      isMock: true,
      message: 'Running in sandbox mode with mock payments.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm Payment (creates mock order transaction)
// @route   POST /api/payment/confirm
// @access  Private
exports.confirmPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.body;

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully.',
      transactionId: transactionId || `TXN-${Date.now()}`,
    });
  } catch (error) {
    next(error);
  }
};
