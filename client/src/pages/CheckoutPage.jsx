import React, { useState, useEffect } from 'react';
import { load } from '@cashfreepayments/cashfree-js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import Loader from '../components/common/Loader';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaCreditCard, FaMoneyBillWave, FaArrowRight, FaTicketAlt, FaTrash, FaMobile, FaUniversity } from 'react-icons/fa';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    loading: cartLoading,
    coupon,
    couponDiscount,
    cartSubtotal,
    cartMrpTotal,
    discountFromMrp,
    cartShipping,
    cartTotal,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address Details Form
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, Online

  useEffect(() => {
    if (!cartLoading && (!cartItems || cartItems.length === 0)) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cartItems, cartLoading, navigate]);

  // Use pre-saved address if available
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses[0];
      setShippingAddress({
        name: defaultAddr.name || user.name,
        address: defaultAddr.addressLine || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        pincode: defaultAddr.pincode || '',
        phone: defaultAddr.phone || user.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    const res = await applyCoupon(couponCode);
    setApplyingCoupon(false);
    if (res.success) {
      toast.success(res.message || 'Coupon applied successfully!');
    } else {
      toast.error(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const validateShipping = () => {
    const { name, address, city, state, pincode, phone } = shippingAddress;
    if (!name.trim() || !address.trim() || !city.trim() || !state.trim() || !pincode.trim() || !phone.trim()) {
      toast.error('All address fields are required.');
      return false;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error('Pincode must be exactly 6 digits.');
      return false;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      toast.error('Phone number must be exactly 10 digits.');
      return false;
    }
    return true;
  };

  // Initialize Cashfree SDK
  const initializeCashfree = async () => {
    return await load({
      mode: "sandbox", // Use "production" for live
    });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      let paymentInfo = { method: paymentMethod, transactionId: `TXN-${Date.now()}` };

      // Order parameters payload
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: shippingAddress.name,
          addressLine1: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          phone: shippingAddress.phone,
        },
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'Cashfree',
        paymentInfo,
        discount: couponDiscount,
        couponApplied: coupon?._id || null,
      };

      if (paymentMethod === 'Online') {
        const cashfree = await initializeCashfree();

        // 1. Create order on backend to get payment_session_id
        const { data: orderData } = await api.post('/payment/cashfree/create-order', {
          amount: cartTotal,
          customer_name: shippingAddress.name,
          customer_phone: shippingAddress.phone,
          customer_email: user?.email || 'test@example.com'
        });

        if (!orderData.success) {
          toast.error('Failed to initialize payment.');
          setIsSubmitting(false);
          return;
        }

        const checkoutOptions = {
          paymentSessionId: orderData.payment_session_id,
          redirectTarget: "_modal",
        };

        cashfree.checkout(checkoutOptions).then(async (result) => {
          if (result.error) {
            toast.error(result.error.message || 'Payment cancelled or failed');
            setIsSubmitting(false);
          }
          if (result.paymentDetails) {
            try {
              // 2. Verify payment on backend
              const verifyRes = await api.post('/payment/cashfree/verify', {
                order_id: orderData.order_id
              });

              if (verifyRes.data.success) {
                // 3. Complete order
                orderPayload.paymentInfo.transactionId = verifyRes.data.payment_id || orderData.order_id;
                orderPayload.paymentInfo.status = 'completed';
                
                const finalOrderRes = await api.post('/orders', orderPayload);
                if (finalOrderRes.data.success) {
                  clearCart();
                  navigate('/order-success');
                }
              } else {
                 toast.error('Payment verification failed.');
                 setIsSubmitting(false);
              }
            } catch (err) {
              toast.error('Payment verification failed.');
              setIsSubmitting(false);
            }
          }
        });
        return; // Don't proceed to final order creation here, handler will do it
      }

      // COD Flow
      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        clearCart();
        navigate('/order-success');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Error processing order');
      setIsSubmitting(false);
    }
  };

  if (cartLoading) return <div className="container"><Loader /></div>;

  return (
    <div className="checkout-page">
      <div className="container checkout-container">
        {/* Left column: Checkout Steps Form */}
        <div className="checkout-steps-panel">
          {/* Step Headers */}
          <div className="checkout-step-indicator">
            <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="node-circle">{step > 1 ? '✓' : '1'}</div>
              <span>Shipping</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="node-circle">{step > 2 ? '✓' : '2'}</div>
              <span>Payment</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-node ${step === 3 ? 'active' : ''}`}>
              <div className="node-circle">3</div>
              <span>Review</span>
            </div>
          </div>

          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <div className="step-content card">
              <h2>Shipping Address</h2>
              <form onSubmit={(e) => { e.preventDefault(); if (validateShipping()) setStep(2); }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      value={shippingAddress.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-input"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line</label>
                  <textarea
                    name="address"
                    className="form-input"
                    rows="3"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    placeholder="House/Flat No, Street Address, LandMark"
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
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-input"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      className="form-input"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      placeholder="6 digits"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-secondary checkout-next-btn">
                  Continue to Payment <FaArrowRight />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <div className="step-content card">
              <h2>Select Payment Method</h2>
              <div className="payment-options-list">

                {/* COD */}
                <label className={`payment-option-label ${paymentMethod === 'COD' ? 'checked' : ''}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <div className="payment-option-icon"><FaMoneyBillWave /></div>
                  <div className="payment-option-text">
                    <strong>Cash on Delivery (COD)</strong>
                    <span>Pay at your doorstep using cash</span>
                  </div>
                </label>

                {/* Online Payment */}
                <label className={`payment-option-label ${paymentMethod === 'Online' ? 'checked' : ''}`}>
                  <input type="radio" name="payment" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} />
                  <div className="payment-option-icon"><FaCreditCard /></div>
                  <div className="payment-option-text">
                    <strong>Pay Online Securely (Cashfree)</strong>
                    <span>Cards, UPI, NetBanking, Wallets supported</span>
                  </div>
                </label>
              </div>

              <div className="step-actions flex justify-between align-center">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                  Back to Shipping
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(3)}>
                  Review Order <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FINAL REVIEW */}
          {step === 3 && (
            <div className="step-content card">
              <h2>Review Your Order</h2>
              
              <div className="review-block">
                <h3>Delivery Address</h3>
                <p><strong>{shippingAddress.name}</strong></p>
                <p>{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                <p>Phone: {shippingAddress.phone}</p>
                <button className="btn-edit-inline" onClick={() => setStep(1)}>Edit Address</button>
              </div>

              <div className="review-block">
                <h3>Payment Mode</h3>
                <p>
                  <strong>
                    {paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Cashfree Online (UPI/Cards)'}
                  </strong>
                </p>
                <button className="btn-edit-inline" onClick={() => setStep(2)}>Change Payment Method</button>
              </div>

              <div className="review-block">
                <h3>Cart Items Review</h3>
                <div className="checkout-review-items">
                  {cartItems.map((item) => (
                    <div key={item._id} className="checkout-review-item">
                      <img src={item.product.images[0]} alt={item.product.name} loading="lazy" />
                      <div className="review-item-info">
                        <h4>{item.product.name}</h4>
                        <p>{formatPrice(item.product.price)} x {item.quantity}</p>
                      </div>
                      <span className="review-item-total">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="step-actions flex justify-between align-center">
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                  Back to Payment
                </button>
                <button
                  type="button"
                  className="btn btn-primary place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing Order...' : 'Place Order Now'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Checkout Summary Sidebar */}
        <div className="checkout-summary-sidebar">
          {/* Coupon Code Section */}
          <div className="card checkout-coupon-card">
            <h3>Have a Coupon?</h3>
            {!coupon ? (
              <form onSubmit={handleApplyCoupon} className="coupon-form">
                <div className="coupon-input-wrapper">
                  <FaTicketAlt className="ticket-icon" />
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                </div>
                <button type="submit" className="btn btn-secondary" disabled={applyingCoupon}>
                  {applyingCoupon ? 'Applying...' : 'Apply'}
                </button>
              </form>
            ) : (
              <div className="applied-coupon-row">
                <div className="coupon-info">
                  <FaCheckCircle className="coupon-check" />
                  <div>
                    <strong>{coupon.code}</strong>
                    <span>Discount of {formatPrice(couponDiscount)} applied</span>
                  </div>
                </div>
                <button className="remove-coupon-btn" onClick={handleRemoveCoupon}><FaTrash /></button>
              </div>
            )}
          </div>

          {/* Pricing Details Panel */}
          <div className="card checkout-pricing-card">
            <h3>Price Summary</h3>
            <div className="price-row">
              <span>Items Total (MRP)</span>
              <span>{formatPrice(cartMrpTotal)}</span>
            </div>
            {discountFromMrp > 0 && (
              <div className="price-row">
                <span>Product Discounts</span>
                <span className="success-txt">-{formatPrice(discountFromMrp)}</span>
              </div>
            )}
            {coupon && (
              <div className="price-row">
                <span>Coupon Applied ({coupon.code})</span>
                <span className="success-txt">-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="price-row">
              <span>Delivery Charge</span>
              <span className={cartShipping === 0 ? 'success-txt' : ''}>
                {cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}
              </span>
            </div>
            <div className="price-divider"></div>
            <div className="price-total-row">
              <span>Total Payable</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            {discountFromMrp + couponDiscount > 0 && (
              <div className="checkout-savings-box">
                You are saving {formatPrice(discountFromMrp + couponDiscount)} on this order!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
