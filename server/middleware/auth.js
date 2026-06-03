const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check header for token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login first.',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'indiacart24_jwt_secret_key_2024');

      // Add user to request object
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User matching this token no longer exists.',
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token verification failed. Please login again.',
      });
    }
  } catch (err) {
    next(err);
  }
};

// Authorize admin role
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin resource only.',
    });
  }
};
