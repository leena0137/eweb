import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { FaHeart, FaShoppingBag } from 'react-icons/fa';
import './WishlistPage.css';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, loading, fetchWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <Loader />
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon"><FaHeart /></div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you like here to purchase them later!</p>
            <button className="wishlist-empty-btn" onClick={() => navigate('/products')}>
              <FaShoppingBag />
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1>My Wishlist <span className="wishlist-count-label">({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})</span></h1>
        </div>

        <div className="grid grid-4 wishlist-grid">
          {wishlistItems.map((product, index) => (
            <div key={product._id} className={`wishlist-item-wrapper stagger-${(index % 5) + 1}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
