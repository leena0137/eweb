import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        {!success ? (
          <>
            <div className="reset-icon-wrapper">
              <FaLock className="reset-icon" />
            </div>
            <h2>Set New Password</h2>
            <p className="reset-subtitle">
              Create a new password for your account. Make sure it's at least 6 characters long.
            </p>

            <form onSubmit={handleSubmit} className="reset-form">
              <div className="reset-field">
                <label htmlFor="new-password">New Password</label>
                <div className="reset-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="new-password"
                    placeholder="Enter new password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="reset-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="reset-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="reset-password-wrapper">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="confirm-password"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="reset-password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="reset-submit-btn" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <Link to="/login" className="reset-back-link">
              <FaArrowLeft /> Back to Login
            </Link>
          </>
        ) : (
          <div className="reset-success">
            <div className="reset-success-icon-wrapper">
              <FaCheckCircle className="reset-success-icon" />
            </div>
            <h2>Password Reset!</h2>
            <p className="reset-subtitle">
              Your password has been changed successfully. You can now log in with your new password.
            </p>
            <button
              className="reset-submit-btn"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
