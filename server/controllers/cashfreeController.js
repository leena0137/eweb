const { Cashfree, CFEnvironment } = require("cashfree-pg");

console.log("Cashfree package loaded successfully");
console.log("Cashfree ENV:", process.env.CASHFREE_ENVIRONMENT);

// TEMP TEST
const cashfree = {};

// @desc    Create a Cashfree Order
// @route   POST /api/payment/cashfree/create-order
// @access  Public (Should ideally be protected)
exports.createCashfreeOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', customer_id, customer_email, customer_phone, customer_name } = req.body;

    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const request = {
      order_amount: amount,
      order_currency: currency,
      order_id: orderId,
      customer_details: {
        customer_id: customer_id || `cust_${Date.now()}`,
        customer_phone: customer_phone || '9999999999',
        customer_email: customer_email || 'test@example.com',
        customer_name: customer_name || 'Test User'
      },
      order_meta: {
        return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?order_id={order_id}&payment_session_id={payment_session_id}`
      }
    };

    cashfree.PGCreateOrder("2023-08-01", request)
      .then((response) => {
        const paymentSessionId = response.data.payment_session_id;
        res.status(200).json({
          success: true,
          payment_session_id: paymentSessionId,
          order_id: response.data.order_id
        });
      })
      .catch((error) => {
        console.error("Cashfree Order Creation Error:", error?.response?.data || error);
        res.status(500).json({
          success: false,
          message: error?.response?.data?.message || 'Payment initialization failed'
        });
      });

  } catch (error) {
    console.error("Cashfree create order error:", error);
    res.status(500).json({ success: false, message: 'Server error during payment initialization' });
  }
};

// @desc    Verify a Cashfree Order Status
// @route   POST /api/payment/cashfree/verify
// @access  Public
exports.verifyCashfreeOrder = async (req, res) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ success: false, message: 'order_id is required' });
    }

    cashfree.PGOrderFetchPayments("2023-08-01", order_id)
      .then((response) => {
        // Find if any payment was successful
        const payments = response.data || [];
        const successfulPayment = payments.find(payment => payment.payment_status === 'SUCCESS');

        if (successfulPayment) {
          res.status(200).json({
            success: true,
            status: 'completed',
            payment_id: successfulPayment.cf_payment_id,
            payment_method: successfulPayment.payment_group,
            amount: successfulPayment.payment_amount
          });
        } else {
          res.status(400).json({
            success: false,
            message: 'Payment not successful',
            status: payments[0]?.payment_status || 'PENDING'
          });
        }
      })
      .catch((error) => {
        console.error("Cashfree Verify Error:", error?.response?.data || error);
        res.status(500).json({
          success: false,
          message: error?.response?.data?.message || 'Payment verification failed'
        });
      });

  } catch (error) {
    console.error("Cashfree verification error:", error);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
};
