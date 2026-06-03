import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatDate } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaSearch, FaUserMinus, FaUserCheck } from 'react-icons/fa';
import './AdminCustomersPage.css';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/customers');
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (customerId, currentStatus) => {
    const actionText = currentStatus ? 'suspend' : 'activate';
    if (window.confirm(`Are you sure you want to ${actionText} this customer's account?`)) {
      try {
        const res = await api.put(`/admin/customers/${customerId}/status`, {
          isActive: !currentStatus,
        });

        if (res.data.success) {
          toast.success(`Customer account ${currentStatus ? 'suspended' : 'activated'} successfully.`);
          fetchCustomers();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to toggle account status');
      }
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone || '').includes(searchTerm)
  );

  return (
    <div className="admin-customers-page">
      <div className="admin-customers-header">
        <h2>Customer Management</h2>
      </div>

      {/* Search Header */}
      <div className="admin-filters-card card flex align-center">
        <div className="admin-search-wrapper" style={{ maxWidth: '400px' }}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customers List Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="admin-customers-table-wrap card">
          <table className="admin-customers-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name & Email</th>
                <th>Phone Number</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    No customer accounts found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust._id}>
                    <td>
                      <div className="admin-cust-avatar">
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div className="admin-cust-details flex flex-column">
                        <strong>{cust.name}</strong>
                        <span>{cust.email}</span>
                      </div>
                    </td>
                    <td>{cust.phone || <span style={{ color: '#abb8c3', fontStyle: 'italic' }}>Not provided</span>}</td>
                    <td style={{ color: '#878787' }}>{formatDate(cust.createdAt)}</td>
                    <td>
                      <span className={`admin-status-badge ${cust.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {cust.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`admin-action-btn ${cust.isActive ? 'delete' : 'edit'}`}
                        onClick={() => handleToggleStatus(cust._id, cust.isActive)}
                        title={cust.isActive ? 'Suspend account' : 'Activate account'}
                      >
                        {cust.isActive ? <FaUserMinus /> : <FaUserCheck />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;
