import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatPrice, formatDate } from '../../utils/formatters';
import {
  FaShoppingBag,
  FaChartLine,
  FaBox,
  FaUsers,
  FaPlus,
  FaEye,
  FaTags,
  FaClipboardList,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './DashboardPage.css';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const s = status?.toLowerCase().replace(/\s+/g, '');
    const map = {
      processing: 'admin-status-processing',
      confirmed: 'admin-status-confirmed',
      shipped: 'admin-status-shipped',
      outfordelivery: 'admin-status-shipped',
      delivered: 'admin-status-delivered',
      cancelled: 'admin-status-cancelled',
    };
    return map[s] || 'admin-status-processing';
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  const maxSale = stats?.monthlySales
    ? Math.max(...stats.monthlySales.map((s) => s.revenue || 0), 1)
    : 1;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="admin-dashboard-date">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-card-info">
              <span className="admin-stat-card-label">Total Orders</span>
              <span className="admin-stat-card-value">{stats?.totalOrders || 0}</span>
            </div>
            <div className="admin-stat-card-icon">
              <FaShoppingBag />
            </div>
          </div>
          <div className="admin-stat-card-trend up">↑ Active</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-card-info">
              <span className="admin-stat-card-label">Total Revenue</span>
              <span className="admin-stat-card-value">
                {formatPrice(stats?.totalRevenue || 0)}
              </span>
            </div>
            <div className="admin-stat-card-icon">
              <FaChartLine />
            </div>
          </div>
          <div className="admin-stat-card-trend up">↑ Growing</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-card-info">
              <span className="admin-stat-card-label">Total Products</span>
              <span className="admin-stat-card-value">{stats?.totalProducts || 0}</span>
            </div>
            <div className="admin-stat-card-icon">
              <FaBox />
            </div>
          </div>
          <div className="admin-stat-card-trend up">↑ In Stock</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-top">
            <div className="admin-stat-card-info">
              <span className="admin-stat-card-label">Total Customers</span>
              <span className="admin-stat-card-value">{stats?.totalCustomers || 0}</span>
            </div>
            <div className="admin-stat-card-icon">
              <FaUsers />
            </div>
          </div>
          <div className="admin-stat-card-trend up">↑ Growing</div>
        </div>
      </div>

      {/* Chart + Quick Actions */}
      <div className="admin-dashboard-grid">
        {/* Revenue Chart */}
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <div className="admin-chart-title">Monthly Revenue</div>
              <div className="admin-chart-subtitle">Revenue over the last 12 months</div>
            </div>
          </div>
          <div className="admin-bar-chart">
            {monthLabels.map((month, i) => {
              const sale = stats?.monthlySales?.find((s) => s.month === i + 1);
              const revenue = sale?.revenue || 0;
              const height = maxSale > 0 ? (revenue / maxSale) * 100 : 0;
              return (
                <div className="admin-bar-col" key={month}>
                  <div className="admin-bar-value">{formatPrice(revenue)}</div>
                  <div
                    className="admin-bar"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={`${month}: ${formatPrice(revenue)}`}
                  />
                  <div className="admin-bar-label">{month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-quick-actions">
          <div className="admin-quick-actions-title">Quick Actions</div>
          <div className="admin-quick-actions-list">
            <Link to="/admin/products" className="admin-quick-action-btn">
              <div className="admin-quick-action-icon">
                <FaPlus />
              </div>
              Add New Product
            </Link>
            <Link to="/admin/orders" className="admin-quick-action-btn">
              <div className="admin-quick-action-icon">
                <FaClipboardList />
              </div>
              Manage Orders
            </Link>
            <Link to="/admin/customers" className="admin-quick-action-btn">
              <div className="admin-quick-action-icon">
                <FaUsers />
              </div>
              View Customers
            </Link>
            <Link to="/admin/categories" className="admin-quick-action-btn">
              <div className="admin-quick-action-icon">
                <FaTags />
              </div>
              Manage Categories
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-recent-orders">
        <div className="admin-recent-orders-header">
          <div className="admin-recent-orders-title">Recent Orders</div>
          <Link to="/admin/orders" className="admin-view-all-btn">
            View All →
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.slice(0, 5).map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                      #{order._id?.slice(-8).toUpperCase()}
                    </td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td style={{ color: '#9a9cae' }}>{formatDate(order.createdAt)}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(order.totalAmount)}</td>
                    <td>
                      <span className={`admin-status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#5d5f6e', padding: '40px' }}>
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
