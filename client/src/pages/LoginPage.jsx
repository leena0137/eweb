import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (formError) setFormError('');
  };

  const validate = () => {
    const errs = {};
    if (isRegister && !formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Minimum 6 characters';
    if (isRegister && formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errs.phone = 'Enter a valid 10-digit phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setFormError('');

    let result;
    if (isRegister) {
      result = await register(formData.name, formData.email, formData.password, formData.phone);
    } else {
      result = await login(formData.email, formData.password);
    }

    if (result?.success) {
      toast.success(isRegister ? 'Account created successfully! 🎉' : 'Welcome back! 👋');
      navigate(from, { replace: true });
    } else {
      setFormError(result?.message || 'Something went wrong. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setFormError('');
    setErrors({});
    setFormData({ name: '', email: '', password: '', phone: '' });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Brand Panel */}
        <div className="login-brand-panel">
          <div>
            <h2>{isRegister ? 'Looks like you\'re new here!' : 'Login'}</h2>
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
          <h3>{isRegister ? 'Create Account' : 'Welcome Back'}</h3>
          <p className="login-subtitle">
            {isRegister
              ? 'Fill in your details to get started'
              : 'Enter your credentials to continue'}
          </p>

          {formError && (
            <div className="login-error-banner">
              <FaExclamationCircle />
              {formError}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
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

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder={isRegister ? 'Create a password (min 6 chars)' : 'Enter your password'}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
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
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
