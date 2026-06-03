import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import api from '../utils/api';
import { formatPrice, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import { FaShoppingBag, FaArrowRight, FaSearch } from 'react-icons/fa';
import ProductCard from '../components/common/ProductCard';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          // Fetch a few products for recommendations
          setRecommendations(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      }
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
        toast.error('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing': return 'badge-warning';
      case 'Shipped': return 'badge-secondary';
      case 'Out for Delivery': return 'badge-secondary';
      case 'Delivered': return 'badge-success';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderItems.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="container"><Loader /></div>;

  return (
    <div className="orders-page">
      <div className="container orders-container">
        <div className="orders-header flex justify-between align-center">
          <h1>My Orders</h1>
          
          <div className="search-orders-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Order ID or Product Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="orders-empty card">
            <div className="empty-icon"><FaShoppingBag /></div>
            <h2>No orders found</h2>
            <p>
              {searchTerm
                ? 'No matching results found for your search query. Try another search.'
                : 'You have not placed any orders yet. Start exploring Indiacart24!'}
            </p>
            <button className="btn btn-secondary" onClick={() => navigate('/products')}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-history-card card">
                {/* Top header row of order */}
                <div className="order-card-header flex justify-between align-center">
                  <div className="header-details flex">
                    <div>
                      <span>Order Placed</span>
                      <strong>{formatDate(order.createdAt)}</strong>
                    </div>
                    <div>
                      <span>Total Amount</span>
                      <strong>{formatPrice(order.totalPrice)}</strong>
                    </div>
                    <div>
                      <span>Order ID</span>
                      <strong className="order-id-txt">#{order._id}</strong>
                    </div>
                  </div>

                  <div className="header-status">
                    <span className={`badge ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Body items list snippet */}
                <div className="order-card-items">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="order-history-item flex align-center">
                      <img src={item.image} alt={item.name} className="item-thumbnail" loading="lazy" />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity} | Price: {formatPrice(item.price)}</p>
                      </div>
                      <button
                        className="btn btn-outline detail-btn"
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        Track Order <FaArrowRight />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="orders-recommendations" style={{ marginTop: '56px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>
              Shop Again
            </h3>
            <div className="grid grid-4">
              {recommendations.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
