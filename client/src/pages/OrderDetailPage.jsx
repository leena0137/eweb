import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Loader from '../components/common/Loader';
import api from '../utils/api';
import { formatPrice, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import { FaChevronLeft, FaTruck, FaMapMarkerAlt, FaCreditCard, FaCalendarAlt, FaBan, FaCheck, FaBoxOpen, FaShippingFast, FaHome } from 'react-icons/fa';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
        toast.error('Failed to load order details');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, navigate]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      setCancelling(true);
      try {
        const res = await api.put(`/orders/${id}/cancel`);
        if (res.data.success) {
          toast.success('Order cancelled successfully.');
          setOrder(res.data.data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to cancel order.');
      } finally {
        setCancelling(false);
      }
    }
  };

  const getStepStatus = (stepIndex) => {
    // 0: Processing, 1: Confirmed, 2: Shipped, 3: Out for Delivery, 4: Delivered
    const statuses = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentStatusIdx = statuses.indexOf(order.orderStatus);

    if (order.orderStatus === 'Cancelled') {
      return 'cancelled';
    }

    if (currentStatusIdx >= stepIndex) {
      return 'completed';
    } else if (currentStatusIdx === stepIndex - 1) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  if (loading) return <div className="container"><Loader /></div>;
  if (!order) return <div className="container"><h2>Order not found</h2></div>;

  return (
    <div className="order-detail-page">
      <div className="container order-detail-container">
        {/* Back Link */}
        <Link to="/orders" className="back-link flex align-center">
          <FaChevronLeft /> Back to Orders
        </Link>

        {/* Order Meta Header */}
        <div className="order-detail-header card flex justify-between align-center">
          <div>
            <h1>Order ID: #{order._id}</h1>
            <p className="order-date-row">
              <FaCalendarAlt /> Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="order-actions">
            {order.orderStatus === 'Processing' && (
              <button
                className="btn btn-outline cancel-btn"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                <FaBan /> {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
            {order.orderStatus === 'Cancelled' && (
              <span className="badge badge-danger">Cancelled</span>
            )}
          </div>
        </div>

        {/* Order Tracking Progress Stepper (Only if not Cancelled) */}
        {order.orderStatus !== 'Cancelled' ? (
          <div className="tracking-stepper card">
            <h3>Live Order Tracking</h3>
            <div className="stepper-grid">
              <div className={`step ${getStepStatus(0)}`}>
                <div className="circle"><FaCheck /></div>
                <span>Processing</span>
                <p>Order Placed</p>
              </div>
              <div className={`line ${getStepStatus(1) === 'completed' || getStepStatus(1) === 'active' ? 'active-line' : ''}`}></div>
              <div className={`step ${getStepStatus(1)}`}>
                <div className="circle"><FaBoxOpen /></div>
                <span>Confirmed</span>
                <p>Packed & Ready</p>
              </div>
              <div className={`line ${getStepStatus(2) === 'completed' || getStepStatus(2) === 'active' ? 'active-line' : ''}`}></div>
              <div className={`step ${getStepStatus(2)}`}>
                <div className="circle"><FaTruck /></div>
                <span>Shipped</span>
                <p>Dispatched</p>
              </div>
              <div className={`line ${getStepStatus(3) === 'completed' || getStepStatus(3) === 'active' ? 'active-line' : ''}`}></div>
              <div className={`step ${getStepStatus(3)}`}>
                <div className="circle"><FaShippingFast /></div>
                <span>Out For Delivery</span>
                <p>With Courier</p>
              </div>
              <div className={`line ${getStepStatus(4) === 'completed' || getStepStatus(4) === 'active' ? 'active-line' : ''}`}></div>
              <div className={`step ${getStepStatus(4)}`}>
                <div className="circle"><FaHome /></div>
                <span>Delivered</span>
                <p>Completed</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="cancelled-alert-banner card">
            <FaBan className="banner-icon" />
            <div>
              <h3>This order has been cancelled</h3>
              <p>Refund will be processed to the original payment source within 3-5 working days if paid online.</p>
            </div>
          </div>
        )}

        {/* Grid: Delivery details, billing summary, order items */}
        <div className="details-layout-grid">
          {/* Left Column: Address, Payment Info & Product Items */}
          <div className="left-column">
            {/* Delivery address & Payment summary cards */}
            <div className="info-cards-row">
              {/* Shipping card */}
              <div className="info-card card">
                <div className="card-title-row">
                  <FaMapMarkerAlt />
                  <h3>Shipping Address</h3>
                </div>
                <div className="card-content">
                  <p><strong>{order.shippingAddress.name}</strong></p>
                  <p>{order.shippingAddress.addressLine}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="phone">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Payment card */}
              <div className="info-card card">
                <div className="card-title-row">
                  <FaCreditCard />
                  <h3>Payment Info</h3>
                </div>
                <div className="card-content">
                  <p>Method: <strong>{order.paymentInfo.method}</strong></p>
                  <p>Transaction ID: <span className="txn-id-txt">{order.paymentInfo.transactionId}</span></p>
                  <p>Status: <span className={`badge ${order.paymentInfo.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{order.paymentInfo.status}</span></p>
                  {order.paymentInfo.paidAt && (
                    <p className="paid-at">Paid At: {formatDate(order.paymentInfo.paidAt)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items Table Card */}
            <div className="items-list-card card">
              <h3>Items in this Order</h3>
              <div className="items-table-wrapper">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th className="align-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="item-cell flex align-center">
                          <img src={item.image} alt={item.name} loading="lazy" />
                          <span>{item.name}</span>
                        </td>
                        <td>{formatPrice(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td className="align-right font-bold">{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Summary Sidebar */}
          <div className="right-column">
            <div className="card order-pricing-card">
              <h3>Billing Invoice</h3>
              <div className="price-row">
                <span>Subtotal</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              {order.discount > 0 && (
                <div className="price-row">
                  <span>Coupon Discounts</span>
                  <span className="success-txt">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="price-row">
                <span>Shipping Fees</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="divider"></div>
              <div className="price-total-row">
                <span>Total Amount Paid</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>

            {/* Courier dispatch alerts */}
            {order.trackingId && (
              <div className="card courier-card">
                <div className="card-title-row">
                  <FaTruck />
                  <h3>Delivery Tracking</h3>
                </div>
                <p>Tracking ID: <strong>{order.trackingId}</strong></p>
                <p className="tracking-notice">Use the ID to track updates on third-party dispatch servers.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
