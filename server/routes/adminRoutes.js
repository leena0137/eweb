const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCustomers,
  getSalesReport,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardStats);
router.get('/customers', getCustomers);
router.get('/sales-report', getSalesReport);

module.exports = router;
