const express = require('express');
const router = express.Router();
const {
  register,
  login,
  loginWithPassword,
  getMe,
  logout,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyOTP,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/login-password', loginWithPassword);
router.post('/verify-otp', verifyOTP);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
