import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    loading,
    cartCount,
    cartSubtotal,
    cartMrpTotal,
    discountFromMrp,
    cartShipping,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    const res = await updateQuantity(itemId, newQty);
    if (!res?.success) {
      toast.error(res?.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    const res = await removeFromCart(itemId);
    if (res?.success) {
      toast.success('Item removed from cart');
    } else {
      toast.error(res?.message || 'Failed to remove item');
    }
  };

  const handleClear = async () => {
    const res = await clearCart();
    if (res?.success) {
      toast.success('Cart cleared');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <Loader />
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet. Let's fix that!</p>
            <Link to="/products">
              <button className="cart-empty-btn">
                <FaShoppingBag />
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>
            Shopping Cart
            <span className="cart-count-label">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
          </h1>
          <button className="cart-clear-btn" onClick={handleClear}>
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          {/* Items List */}
          <div className="cart-items-section">
            {cartItems.map((item) => {
              const product = item.product;
              if (!product) return null;
              const discount = product.mrp && product.mrp > product.price
                ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                : 0;

              return (
                <div className="cart-item" key={item._id || product._id}>
                  <div
                    className="cart-item-image"
                    onClick={() => navigate(`/products/${product.slug || product._id}`)}
                  >
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/200x200?text=Product'}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="cart-item-details">
                    {product.brand && (
                      <span className="cart-item-brand">{product.brand}</span>
                    )}
                    <span
                      className="cart-item-name"
                      onClick={() => navigate(`/products/${product.slug || product._id}`)}
                    >
                      {product.name}
                    </span>

                    <div className="cart-item-price-row">
                      <span className="cart-item-sale-price">{formatPrice(product.price)}</span>
                      {product.mrp && product.mrp > product.price && (
                        <>
                          <span className="cart-item-mrp">{formatPrice(product.mrp)}</span>
                          <span className="cart-item-discount">{discount}% off</span>
                        </>
                      )}
                    </div>

                    <div className="cart-item-actions">
                      <div className="cart-qty-controls">
                        <button
                          className="cart-qty-btn"
                          onClick={() => handleUpdateQty(item._id || product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => handleUpdateQty(item._id || product._id, item.quantity + 1)}
                          disabled={product.stock && item.quantity >= product.stock}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <button
                        className="cart-remove-btn"
                        onClick={() => handleRemove(item._id || product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3>Price Details</h3>

            <div className="cart-summary-row">
              <span className="label">Price ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
              <span className="value">{formatPrice(cartMrpTotal)}</span>
            </div>

            {discountFromMrp > 0 && (
              <div className="cart-summary-row">
                <span className="label">Discount</span>
                <span className="value discount">−{formatPrice(discountFromMrp)}</span>
              </div>
            )}

            <div className="cart-summary-row">
              <span className="label">Delivery Charges</span>
              <span className={`value ${cartShipping === 0 ? 'free' : ''}`}>
                {cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}
              </span>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span>Total Amount</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            {discountFromMrp > 0 && (
              <p className="cart-summary-savings">
                You will save {formatPrice(discountFromMrp)} on this order
              </p>
            )}

            <button className="cart-checkout-btn" onClick={handleCheckout}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
