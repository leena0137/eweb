import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaMapMarkerAlt, FaShoppingBag, FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import ProductCard from '../components/common/ProductCard';
import api from '../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, loading, updateProfile, changePassword, addAddress, updateAddress, deleteAddress } = useAuth();

  const [activeTab, setActiveTab] = useState('profile'); // profile, address, security
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          setRecentlyViewed(res.data.data.slice(4, 8));
        }
      } catch (err) {
        console.error('Failed to load recently viewed:', err);
      }
    };
    fetchRecentlyViewed();
  }, []);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Sync form state when user object loads (fixes empty fields on async load)
  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  // Password Form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Address Dialog / Edit form state
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressEditingId, setAddressEditingId] = useState(null);
  const [addressData, setAddressData] = useState({
    name: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false,
  });
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAddressData({ ...addressData, [e.target.name]: val });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setProfileSubmitting(true);
    const res = await updateProfile(profileData);
    setProfileSubmitting(false);
    if (res.success) {
      toast.success('Profile updated successfully!');
      setProfileEditing(false);
    } else {
      toast.error(res.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordData;
    if (!oldPassword || !newPassword) {
      toast.error('Passwords cannot be empty');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setPasswordSubmitting(true);
    const res = await changePassword(oldPassword, newPassword);
    setPasswordSubmitting(false);
    if (res.success) {
      toast.success('Password updated successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(res.message);
    }
  };

  const openAddAddress = () => {
    setAddressEditingId(null);
    setAddressData({
      name: user?.name || '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      phone: user?.phone || '',
      isDefault: false,
    });
    setAddressFormOpen(true);
  };

  const openEditAddress = (addr) => {
    setAddressEditingId(addr._id);
    setAddressData({
      name: addr.name || '',
      addressLine: addr.addressLine || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      phone: addr.phone || '',
      isDefault: addr.isDefault || false,
    });
    setAddressFormOpen(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const { name, addressLine, city, state, pincode, phone } = addressData;
    if (!name || !addressLine || !city || !state || !pincode || !phone) {
      toast.error('All fields are required');
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Pincode must be 6 digits');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    setAddressSubmitting(true);
    let res;
    if (addressEditingId) {
      res = await updateAddress(addressEditingId, addressData);
    } else {
      res = await addAddress(addressData);
    }
    setAddressSubmitting(false);

    if (res.success) {
      toast.success(addressEditingId ? 'Address updated successfully!' : 'Address added successfully!');
      setAddressFormOpen(false);
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const res = await deleteAddress(addrId);
      if (res.success) {
        toast.success('Address deleted successfully!');
      } else {
        toast.error(res.message);
      }
    }
  };

  if (loading) return <div className="container"><Loader /></div>;

  return (
    <div className="profile-page">
      <div className="container profile-container">
        {/* Left Column Profile Sidebar Navigation */}
        <div className="profile-sidebar card">
          <div className="profile-user-summary">
            <div className="avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <h4>{user?.name || 'User'}</h4>
              <p>{user?.email}</p>
              {user?.phone && <p className="user-phone">📞 {user.phone}</p>}
            </div>
          </div>

          <div className="profile-nav-links">
            <button
              className={`profile-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser /> <span>Personal Information</span>
            </button>
            <button
              className={`profile-nav-link ${activeTab === 'address' ? 'active' : ''}`}
              onClick={() => setActiveTab('address')}
            >
              <FaMapMarkerAlt /> <span>Manage Addresses</span>
            </button>
            <button
              className={`profile-nav-link ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <FaLock /> <span>Login &amp; Security</span>
            </button>
            <Link to="/orders" className="profile-nav-link-anchor">
              <FaShoppingBag /> <span>My Orders</span>
            </Link>
          </div>
        </div>

        {/* Right Column Profile Tab Pages */}
        <div className="profile-main-content">
          {/* TAB 1: PROFILE INFO */}
          {activeTab === 'profile' && (
            <div className="tab-pane card">
              <div className="pane-header flex justify-between align-center">
                <h2>Personal Information</h2>
                {!profileEditing ? (
                  <button className="btn btn-outline" onClick={() => setProfileEditing(true)}>
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <div className="edit-buttons-row">
                    <button className="btn btn-outline" onClick={() => setProfileEditing(false)}>Cancel</button>
                  </div>
                )}
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address (Read-only)</label>
                  <input type="text" className="form-input read-only" value={user?.email || ''} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={profileEditing ? profileData.name : user?.name || ''}
                    onChange={handleProfileChange}
                    readOnly={!profileEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    value={profileEditing ? profileData.phone : user?.phone || ''}
                    onChange={handleProfileChange}
                    readOnly={!profileEditing}
                    placeholder="Enter phone number"
                  />
                </div>
                {profileEditing && (
                  <button type="submit" className="btn btn-secondary" disabled={profileSubmitting}>
                    {profileSubmitting ? 'Saving...' : 'Save Profile Details'}
                  </button>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'address' && (
            <div className="tab-pane card">
              <div className="pane-header flex justify-between align-center">
                <h2>Manage Addresses</h2>
                <button className="btn btn-secondary btn-sm" onClick={openAddAddress}>
                  <FaPlus /> Add New Address
                </button>
              </div>

              {/* Address List */}
              <div className="profile-address-list">
                {!user?.addresses || user.addresses.length === 0 ? (
                  <p className="no-address-text">No address stored yet. Click 'Add New Address' to create one.</p>
                ) : (
                  user.addresses.map((addr) => (
                    <div key={addr._id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                      {addr.isDefault && <span className="default-badge">Default</span>}
                      <div className="address-details">
                        <h4>{addr.name}</h4>
                        <p className="phone">Phone: {addr.phone}</p>
                        <p>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                      <div className="address-actions">
                        <button className="btn-icon" onClick={() => openEditAddress(addr)}><FaEdit /></button>
                        <button className="btn-icon delete" onClick={() => handleDeleteAddress(addr._id)}><FaTrash /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Address Form Dialog Modal */}
              {addressFormOpen && (
                <div className="address-modal-overlay">
                  <div className="address-modal card">
                    <div className="modal-header flex justify-between align-center">
                      <h3>{addressEditingId ? 'Edit Address' : 'Add New Address'}</h3>
                      <button className="close-btn" onClick={() => setAddressFormOpen(false)}><FaTimes /></button>
                    </div>
                    <form onSubmit={handleAddressSubmit}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-input"
                            value={addressData.name}
                            onChange={handleAddressChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="text"
                            name="phone"
                            className="form-input"
                            value={addressData.phone}
                            onChange={handleAddressChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Address Line</label>
                        <textarea
                          name="addressLine"
                          className="form-input"
                          rows="3"
                          value={addressData.addressLine}
                          onChange={handleAddressChange}
                          required
                        ></textarea>
                      </div>
                      <div className="form-grid-three">
                        <div className="form-group">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            name="city"
                            className="form-input"
                            value={addressData.city}
                            onChange={handleAddressChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">State</label>
                          <input
                            type="text"
                            name="state"
                            className="form-input"
                            value={addressData.state}
                            onChange={handleAddressChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Pincode</label>
                          <input
                            type="text"
                            name="pincode"
                            className="form-input"
                            value={addressData.pincode}
                            onChange={handleAddressChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group-checkbox">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={addressData.isDefault}
                            onChange={handleAddressChange}
                          />
                          <span>Set as Default Address</span>
                        </label>
                      </div>
                      <button type="submit" className="btn btn-secondary w-full" disabled={addressSubmitting}>
                        {addressSubmitting ? 'Saving...' : 'Save Address'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PASSWORD */}
          {activeTab === 'security' && (
            <div className="tab-pane card">
              <h2>Login & Security</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    className="form-input"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-input"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-secondary" disabled={passwordSubmitting}>
                  {passwordSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Products */}
      {recentlyViewed.length > 0 && (
        <div className="container profile-recommendations-container animate-fade-in stagger-2">
          <div className="section-header text-center">
            <h2 className="recommendations-title">Recently Viewed & Recommended</h2>
            <p className="recommendations-subtitle">Products tailored just for you based on your browsing history</p>
          </div>
          <div className="grid grid-4 recommendations-grid">
            {recentlyViewed.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
