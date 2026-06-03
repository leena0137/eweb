import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      if (res.data.success) {
        setWishlistItems(res.data.data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      return { success: false, message: 'Please log in to add items to your wishlist.' };
    }
    try {
      const res = await api.post(`/wishlist/${productId}`);
      if (res.data.success) {
        // Optimistically update list or refetch
        fetchWishlist();
        return { success: true, message: res.data.message, isWishlisted: res.data.isWishlisted };
      }
    } catch (error) {
      return { success: false, message: 'Wishlist update failed.' };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        fetchWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
