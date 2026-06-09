import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaExclamationCircle, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, verifyOTP, loading } = useAuth();

  const from = location.state?.from?.pathname || '/';

  // 'password' | 'otp'
  const [mode, setMode] = useState('password');
  const [isRegister, setIsRegister] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    otp: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    if (formError) setFormError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setFormError('');
    setErrors({});
    setFormData({ name: '', email: '', phone: '', otp: '', password: '' });
    setIsOtpSent(false);
    setIsRegister(false);
  };

  const toggleRegister = () => {
    setIsRegister(!isRegister);
    setFormError('');
    setErrors({});
    setFormData({ name: '', email: '', phone: '', otp: '', password: '' });
    setIsOtpSent(false);
  };

  /* ──────────────── PASSWORD LOGIN ──────────────── */
  const validatePasswordForm = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    setFormError('');
    setPwdLoading(true);
    try {
      const res = await api.post('/auth/login-password', {
        email: formData.email,
        password: formData.password,
      });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        toast.success('Logged in successfully! 👋');
        // Admin → dashboard, user → intended page
        if (res.data.data.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = from === '/login' ? '/' : from;
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setPwdLoading(false);
    }
  };

  /* ──────────────── OTP FLOW ──────────────── */
  const validateEmailForm = () => {
    const errs = {};
    if (isRegister && !formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
    if (isRegister && formData.phone && !/^\d{10}$/.test(formData.phone))
      errs.phone = 'Enter a valid 10-digit phone number';
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
      toast.success(result.message || 'OTP sent to your email!');
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
      navigate(from === '/login' ? '/' : from, { replace: true });
    } else {
      setFormError(result?.message || 'Invalid OTP. Please try again.');
    }
  };

  const goBackToEmail = () => {
    setIsOtpSent(false);
    setFormData({ ...formData, otp: '' });
    setFormError('');
    setErrors({});
  };

  /* ──────────────── BRAND PANEL TEXT ──────────────── */
  const brandTitle = isRegister
    ? "Looks like you're new here!"
    : 'Welcome Back!';
  const brandDesc = isRegister
    ? 'Sign up to get access to exclusive offers, personalized recommendations, and hassle-free shopping.'
    : 'Sign in to access your orders, wishlist, and personalized recommendations.';

  return (
    <div className="login-page">
      <div className="login-container">
        {/* ── Left Brand Panel ── */}
        <div className="login-brand-panel">
          <div>
            <h2>{brandTitle}</h2>
            <p>{brandDesc}</p>
          </div>
          <div className="login-brand-illustration">🛒</div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="login-form-panel">

          {/* ════ PASSWORD LOGIN (default) ════ */}
          {mode === 'password' && !isRegister && (
            <>
              <h3>Login</h3>
              <p className="login-subtitle">Enter your credentials to continue</p>

              {formError && (
                <div className="login-error-banner">
                  <FaExclamationCircle /> {formError}
                </div>
              )}

              <form className="login-form" onSubmit={handlePasswordLogin} noValidate>
                <div className="login-field">
                  <label htmlFor="pwd-email">Email Address</label>
                  <input
                    type="email"
                    id="pwd-email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    autoFocus
                  />
                  {errors.email && <p className="login-field-error">{errors.email}</p>}
                </div>

                <div className="login-field">
                  <label htmlFor="pwd-password">Password</label>
                  <div className="login-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="pwd-password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="login-field-error">{errors.password}</p>}
                </div>

                <div className="login-forgot-link">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>

                <button type="submit" className="login-submit-btn" disabled={pwdLoading}>
                  {pwdLoading ? 'Signing in...' : 'Login'}
                </button>
              </form>

              <div className="login-divider"><span>OR</span></div>

              <button
                className="login-otp-alt-btn"
                type="button"
                onClick={() => switchMode('otp')}
              >
                Login with OTP instead
              </button>

              <div className="login-toggle">
                New to Indiacart24?{' '}
                <span onClick={toggleRegister}>Create an account</span>
              </div>
            </>
          )}

          {/* ════ OTP LOGIN ════ */}
          {mode === 'otp' && !isRegister && !isOtpSent && (
            <>
              <button className="login-back-btn" onClick={() => switchMode('password')}>
                <FaArrowLeft /> Back
              </button>
              <h3>Login with OTP</h3>
              <p className="login-subtitle">Enter your email to receive a one-time code</p>

              {formError && (
                <div className="login-error-banner">
                  <FaExclamationCircle /> {formError}
                </div>
              )}

              <form className="login-form" onSubmit={handleSendOtp} noValidate>
                <div className="login-field">
                  <label htmlFor="otp-email">Email Address</label>
                  <input
                    type="email"
                    id="otp-email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    autoFocus
                  />
                  {errors.email && <p className="login-field-error">{errors.email}</p>}
                </div>

                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>

              <div className="login-divider"><span>OR</span></div>

              <div className="login-toggle">
                New to Indiacart24?{' '}
                <span onClick={toggleRegister}>Create an account</span>
              </div>
            </>
          )}

          {/* ════ REGISTER ════ */}
          {isRegister && !isOtpSent && (
            <>
              <button className="login-back-btn" onClick={toggleRegister}>
                <FaArrowLeft /> Back
              </button>
              <h3>Create Account</h3>
              <p className="login-subtitle">Fill in your details to get started</p>

              {formError && (
                <div className="login-error-banner">
                  <FaExclamationCircle /> {formError}
                </div>
              )}

              <form className="login-form" onSubmit={handleSendOtp} noValidate>
                <div className="login-field">
                  <label htmlFor="reg-name">Full Name</label>
                  <input
                    type="text"
                    id="reg-name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    autoFocus
                  />
                  {errors.name && <p className="login-field-error">{errors.name}</p>}
                </div>

                <div className="login-field">
                  <label htmlFor="reg-email">Email Address</label>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && <p className="login-field-error">{errors.email}</p>}
                </div>

                <div className="login-field">
                  <label htmlFor="reg-phone">Phone Number <span style={{ fontWeight: 400, textTransform: 'none' }}>(Optional)</span></label>
                  <input
                    type="tel"
                    id="reg-phone"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                  {errors.phone && <p className="login-field-error">{errors.phone}</p>}
                </div>

                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP to Verify'}
                </button>
              </form>

              <div className="login-toggle">
                Already have an account?{' '}
                <span onClick={toggleRegister}>Log in</span>
              </div>
            </>
          )}

          {/* ════ OTP VERIFY (login or register) ════ */}
          {isOtpSent && (
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
                  <FaExclamationCircle /> {formError}
                </div>
              )}

              <form className="login-form" onSubmit={handleVerifyOtp} noValidate>
                <div className="login-field">
                  <label htmlFor="otp-code">One-Time Password</label>
                  <input
                    type="text"
                    id="otp-code"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength="6"
                    autoComplete="one-time-code"
                    autoFocus
                    style={{
                      letterSpacing: '6px',
                      fontSize: '20px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  />
                  {errors.otp && <p className="login-field-error">{errors.otp}</p>}
                </div>

                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>

              <div className="login-toggle" style={{ marginTop: '28px' }}>
                Didn't receive the OTP?{' '}
                <span onClick={handleSendOtp}>Resend Code</span>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
