import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatPrice, formatDate } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';
import { FaSearch, FaEye, FaTimes, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import './AdminOrdersPage.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Order Details modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingId, setTrackingId] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [status, currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/admin/all', {
        params: {
          status,
          page: currentPage,
          limit: 10,
        },
      });
      if (res.data.success) {
        setOrders(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
        trackingId: newStatus === 'Shipped' || newStatus === 'Out for Delivery' ? trackingId : undefined,
      });

      if (res.data.success) {
        toast.success(`Order updated to: ${newStatus}`);
        fetchOrders();
        // Update selected order details inside modal if open
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.data);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setTrackingId(order.trackingId || '');
    setIsModalOpen(true);
  };

  const getStatusClass = (statusVal) => {
    const s = statusVal?.toLowerCase().replace(/\s+/g, '');
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

  // Client-side search filters
  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <h2>Manage Orders</h2>
      </div>

      {/* Filters Row */}
      <div className="admin-filters-card card flex justify-between align-center">
        <div className="admin-search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID or User name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-select-wrapper">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="admin-orders-table-wrap card">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total Payable</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    No orders matching your criteria were found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div className="admin-order-customer flex flex-column">
                        <strong>{order.user?.name || 'N/A'}</strong>
                        <span>{order.user?.email}</span>
                      </div>
                    </td>
                    <td style={{ color: '#878787' }}>{formatDate(order.createdAt)}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(order.totalPrice)}</td>
                    <td>
                      <span className={`admin-status-badge ${getStatusClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <button className="admin-action-btn" onClick={() => handleOpenDetails(order)}>
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="admin-pagination-row flex justify-between align-center">
              <span>Page {currentPage} of {totalPages}</span>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      )}

      {/* Order Details Dialog Modal */}
      {isModalOpen && selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal card">
            <div className="admin-modal-header flex justify-between align-center">
              <h3>Order Details: #{selectedOrder._id}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>

            <div className="admin-order-details-layout">
              {/* Left Column info */}
              <div className="details-info-pane">
                <div className="details-block">
                  <h4 className="flex align-center"><FaMapMarkerAlt /> Shipping Details</h4>
                  <p><strong>{selectedOrder.shippingAddress.name}</strong></p>
                  <p>{selectedOrder.shippingAddress.addressLine}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                  <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>

                <div className="details-block">
                  <h4 className="flex align-center"><FaEnvelope /> Customer Account</h4>
                  <p>Name: {selectedOrder.user?.name || 'N/A'}</p>
                  <p>Email: {selectedOrder.user?.email || 'N/A'}</p>
                </div>

                {/* Items snapshot */}
                <div className="details-block">
                  <h4>Order Items Snapshot</h4>
                  <div className="snapshot-items-list">
                    {selectedOrder.orderItems.map((item, idx) => (
                      <div key={idx} className="snapshot-item flex align-center justify-between">
                        <div className="item-left flex align-center">
                          <img src={item.image} alt={item.name} loading="lazy" />
                          <div>
                            <h5>{item.name}</h5>
                            <p>{formatPrice(item.price)} x {item.quantity}</p>
                          </div>
                        </div>
                        <span className="item-sub">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column controls */}
              <div className="details-controls-pane card">
                <h4>Invoice Summary</h4>
                <div className="price-summary-row flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.itemsPrice)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="price-summary-row flex justify-between success-txt">
                    <span>Discount:</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="price-summary-row flex justify-between">
                  <span>Shipping:</span>
                  <span>{selectedOrder.shippingPrice === 0 ? 'FREE' : formatPrice(selectedOrder.shippingPrice)}</span>
                </div>
                <div className="price-divider"></div>
                <div className="price-total-row flex justify-between">
                  <span>Total Paid:</span>
                  <span>{formatPrice(selectedOrder.totalPrice)}</span>
                </div>

                <div className="status-update-block">
                  <h4>Update Order Status</h4>
                  <div className="form-group">
                    <select
                      className="form-input"
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                      disabled={updatingStatus || selectedOrder.orderStatus === 'Delivered' || selectedOrder.orderStatus === 'Cancelled'}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Dispatch tracking code inputs */}
                  {(selectedOrder.orderStatus === 'Shipped' || selectedOrder.orderStatus === 'Out for Delivery') && (
                    <div className="form-group tracking-code-input">
                      <label className="form-label">Tracking ID</label>
                      <div className="flex gap-sm">
                        <input
                          type="text"
                          className="form-input"
                          value={trackingId}
                          onChange={(e) => setTrackingId(e.target.value)}
                          placeholder="Courier tracking id"
                        />
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleUpdateStatus(selectedOrder._id, selectedOrder.orderStatus)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
