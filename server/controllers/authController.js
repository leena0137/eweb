const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user / Send OTP
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists. Please login instead.',
      });
    }

    // Create user without password
    user = await User.create({
      name,
      email,
      phone: phone || '',
      isEmailVerified: false
    });

    // Generate and send OTP
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    const message = `
      <h1>Welcome to Indiacart24! 🎉</h1>
      <p>Hi <strong>${name}</strong>, your verification code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 14px 32px; background: #f3f4f6; color: #1a1a2e; font-weight: 800; border-radius: 8px; font-size: 24px; letter-spacing: 4px;">${otp}</span>
      </div>
      <p style="color: #888; font-size: 13px;">This OTP expires in 10 minutes.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Indiacart24 - Your Registration OTP',
      html: message,
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user / Send OTP
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.',
      });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email. Please create an account.',
      });
    }

    // Generate and send OTP
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    const message = `
      <h1>Login Request</h1>
      <p>Hi <strong>${user.name}</strong>, here is your One-Time Password (OTP) to log in to Indiacart24:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 14px 32px; background: #f3f4f6; color: #1a1a2e; font-weight: 800; border-radius: 8px; font-size: 24px; letter-spacing: 4px;">${otp}</span>
      </div>
      <p style="color: #888; font-size: 13px;">This OTP expires in 10 minutes. Do not share this code with anyone.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Indiacart24 - Login OTP',
      html: message,
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please enter it to login.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and Login
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    const user = await User.findOne({
      email,
      otp: hashedOTP,
      otpExpire: { $gt: Date.now() },
    }).select('+otp +otpExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.',
      });
    }

    // OTP matched, mark as verified and clear OTP
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      avatar: req.body.avatar,
    };

    // Remove undefined values
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords.',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(oldPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    // Generate and hash password token
    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (10 mins)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create reset URL (points to the frontend page)
    const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>You are receiving this email because you (or someone else) requested a password reset for your Indiacart24 account.</p>
      <p>Please click on the link below, or paste this into your browser to complete the process:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p><strong>Note:</strong> This link is valid for only 10 minutes. If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Indiacart24 - Password Reset Request',
      html: message,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email address.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.',
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Verification link is invalid or has expired.',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login with email + password (no OTP)
// @route   POST /api/auth/login-password
// @access  Public
exports.loginWithPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email and password.',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
exports.resendVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified.',
      });
    }

    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyUrl = `${clientUrl}/verify-email/${verificationToken}`;

    const message = `
      <h1>Verify Your Email</h1>
      <p>Hi <strong>${user.name}</strong>, please verify your email address by clicking the link below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ff9f00, #ff8f00); color: #1a1a2e; font-weight: 700; text-decoration: none; border-radius: 8px; font-size: 14px;">Verify Email Address</a>
      </div>
      <p style="color: #888; font-size: 13px;">This link expires in 24 hours.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Indiacart24 - Verify Your Email Address',
      html: message,
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully.',
    });
  } catch (error) {
    next(error);
  }
};
