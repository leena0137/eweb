import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);

  // Load cart on auth state change
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCoupon(null);
    }
  }, [user]);

  // Fetch Cart from Backend
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      if (res.data.success) {
        setCartItems(res.data.data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add Item to Cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      return { success: false, message: 'Please log in to add items to your cart.' };
    }
    try {
      const res = await api.post('/cart', { productId, quantity });
      if (res.data.success) {
        setCartItems(res.data.data.items || []);
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add item to cart.' };
    }
  };

  // Update Item Quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity });
      if (res.data.success) {
        setCartItems(res.data.data.items || []);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update quantity.' };
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (itemId) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      if (res.data.success) {
        setCartItems(res.data.data.items || []);
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to remove item.' };
    }
  };

  // Clear Cart
  const clearCart = async () => {
    try {
      const res = await api.delete('/cart');
      if (res.data.success) {
        setCartItems([]);
        setCoupon(null);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: 'Failed to clear cart.' };
    }
  };

  // Apply Discount Coupon
  const applyCoupon = async (code) => {
    if (!user) return { success: false, message: 'Login to apply coupons.' };
    
    try {
      const res = await api.post('/coupons/validate', {
        code,
        orderAmount: cartSubtotal,
      });

      if (res.data.success) {
        setCoupon(res.data.data);
        return { success: true, message: res.data.message, data: res.data.data };
      }
    } catch (error) {
      setCoupon(null);
      return { success: false, message: error.response?.data?.message || 'Coupon validation failed.' };
    }
  };

  // Remove Applied Coupon
  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculated Pricing Variables
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  const cartMrpTotal = cartItems.reduce((total, item) => {
    const mrp = item.product?.mrp || item.product?.price || 0;
    return total + mrp * item.quantity;
  }, 0);

  const discountFromMrp = cartMrpTotal - cartSubtotal;

  const couponDiscount = coupon
    ? coupon.discountAmount
    : 0;

  const cartShipping = cartSubtotal > 0 && cartSubtotal < 500 ? 40 : 0;

  const cartTotal = cartSubtotal + cartShipping - couponDiscount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        coupon,
        cartCount,
        cartSubtotal,
        cartMrpTotal,
        discountFromMrp,
        couponDiscount,
        cartShipping,
        cartTotal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
