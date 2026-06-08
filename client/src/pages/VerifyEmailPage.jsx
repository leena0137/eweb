import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import './VerifyEmailPage.css';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="verify-page">
      <div className="verify-card">
        {status === 'loading' && (
          <div className="verify-loading">
            <FaSpinner className="verify-spinner" />
            <h2>Verifying Your Email...</h2>
            <p className="verify-subtitle">Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verify-result">
            <div className="verify-icon-wrapper verify-icon-success">
              <FaCheckCircle className="verify-result-icon" />
            </div>
            <h2>Email Verified! 🎉</h2>
            <p className="verify-subtitle">
              Your email address has been successfully verified. You now have full access to all features.
            </p>
            <Link to="/" className="verify-action-btn">
              Continue Shopping
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="verify-result">
            <div className="verify-icon-wrapper verify-icon-error">
              <FaTimesCircle className="verify-result-icon" />
            </div>
            <h2>Verification Failed</h2>
            <p className="verify-subtitle">{message}</p>
            <Link to="/login" className="verify-action-btn">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
