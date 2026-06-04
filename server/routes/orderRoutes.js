const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);

// Admin only routes (must be BEFORE /:id to avoid dynamic param matching)
router.get('/admin/all', admin, getAllOrders);
router.put('/:id/status', admin, updateOrderStatus);

// Dynamic param routes last
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
