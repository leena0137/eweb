import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSent(true);
        toast.success('Password reset link sent to your email!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        {!sent ? (
          <>
            <div className="forgot-icon-wrapper">
              <FaEnvelope className="forgot-icon" />
            </div>
            <h2>Forgot Password?</h2>
            <p className="forgot-subtitle">
              No worries! Enter your email address below and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="forgot-field">
                <label htmlFor="forgot-email">Email Address</label>
                <input
                  type="email"
                  id="forgot-email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button type="submit" className="forgot-submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <Link to="/login" className="forgot-back-link">
              <FaArrowLeft /> Back to Login
            </Link>
          </>
        ) : (
          <div className="forgot-success">
            <div className="forgot-success-icon-wrapper">
              <FaCheckCircle className="forgot-success-icon" />
            </div>
            <h2>Check Your Email</h2>
            <p className="forgot-subtitle">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox (and spam folder) and click the link to reset your password.
            </p>
            <p className="forgot-note">
              The link will expire in <strong>10 minutes</strong>.
            </p>
            <button className="forgot-submit-btn" onClick={() => setSent(false)}>
              Didn't receive it? Try Again
            </button>
            <Link to="/login" className="forgot-back-link">
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
