const express = require('express');
const router = express.Router();
const {
  getStripeKey,
  createPaymentIntent,
  confirmPayment,
} = require('../controllers/paymentController');
const { createRazorpayOrder, verifyPayment } = require('../controllers/razorpayController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/config', getStripeKey);
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);

// Razorpay routes
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);

module.exports = router;
