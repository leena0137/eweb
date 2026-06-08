import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, verifyOTP, loading } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [isRegister, setIsRegister] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (formError) setFormError('');
  };

  const validateEmailForm = () => {
    const errs = {};
    if (isRegister && !formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
    if (isRegister && formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errs.phone = 'Enter a valid 10-digit phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateOtpForm = () => {
    const errs = {};
    if (!formData.otp || formData.otp.length !== 6) errs.otp = 'Please enter a valid 6-digit OTP';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmailForm()) return;
    setFormError('');

    let result;
    if (isRegister) {
      result = await register(formData.name, formData.email, formData.phone);
    } else {
      result = await login(formData.email);
    }

    if (result?.success) {
      toast.success(result.message || 'OTP sent successfully!');
      setIsOtpSent(true);
    } else {
      setFormError(result?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validateOtpForm()) return;
    setFormError('');

    const result = await verifyOTP(formData.email, formData.otp);

    if (result?.success) {
      toast.success('Logged in successfully! 👋');
      navigate(from, { replace: true });
    } else {
      setFormError(result?.message || 'Invalid OTP. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setFormError('');
    setErrors({});
    setFormData({ name: '', email: '', phone: '', otp: '' });
    setIsOtpSent(false);
  };

  const goBackToEmail = () => {
    setIsOtpSent(false);
    setFormData({ ...formData, otp: '' });
    setFormError('');
    setErrors({});
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Brand Panel */}
        <div className="login-brand-panel">
          <div>
            <h2>{isRegister ? 'Looks like you\'re new here!' : 'Welcome Back!'}</h2>
            <p>
              {isRegister
                ? 'Sign up to get access to exclusive offers, personalized recommendations, and hassle-free shopping.'
                : 'Get access to your orders, wishlist, and recommendations. Shop the best of Indian brands.'}
            </p>
          </div>
          <div className="login-brand-illustration">🛒</div>
        </div>

        {/* Right Form Panel */}
        <div className="login-form-panel">
          {!isOtpSent ? (
            <>
              <h3>{isRegister ? 'Create Account' : 'Login'}</h3>
              <p className="login-subtitle">
                {isRegister
                  ? 'Fill in your details to get started'
                  : 'Enter your email to receive an OTP'}
              </p>

              {formError && (
                <div className="login-error-banner">
                  <FaExclamationCircle />
                  {formError}
                </div>
              )}

              <form className="login-form" onSubmit={handleSendOtp} noValidate>
                {isRegister && (
                  <div className="login-field">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                    {errors.name && <p className="login-field-error">{errors.name}</p>}
                  </div>
                )}

                <div className="login-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && <p className="login-field-error">{errors.email}</p>}
                </div>

                {isRegister && (
                  <div className="login-field">
                    <label htmlFor="phone">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="login-field-error">{errors.phone}</p>}
                  </div>
                )}

                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? 'Please wait...' : 'Send OTP'}
                </button>
              </form>

              <div className="login-divider">
                <span>OR</span>
              </div>

              <div className="login-toggle">
                {isRegister ? (
                  <>Already have an account? <span onClick={toggleMode}>Log in</span></>
                ) : (
                  <>New to Indiacart24? <span onClick={toggleMode}>Create an account</span></>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="login-back-btn" onClick={goBackToEmail}>
                <FaArrowLeft /> Back
              </button>
              
              <h3>Enter OTP</h3>
              <p className="login-subtitle">
                We've sent a 6-digit code to <strong>{formData.email}</strong>
              </p>

              {formError && (
                <div className="login-error-banner">
                  <FaExclamationCircle />
                  {formError}
                </div>
              )}

              <form className="login-form" onSubmit={handleVerifyOtp} noValidate>
                <div className="login-field">
                  <label htmlFor="otp">One-Time Password</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength="6"
                    autoComplete="one-time-code"
                    style={{ letterSpacing: '4px', fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}
                  />
                  {errors.otp && <p className="login-field-error">{errors.otp}</p>}
                </div>

                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>

              <div className="login-toggle" style={{ marginTop: '30px' }}>
                Didn't receive the OTP? <span onClick={handleSendOtp}>Resend Code</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
