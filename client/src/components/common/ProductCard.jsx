import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isWishlisted = isInWishlist(product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggleWishlist(product._id);
    if (res.success) {
      if (res.isWishlisted) {
        toast.success('Added to Wishlist! ❤️');
      } else {
        toast.success('Removed from Wishlist. 💔');
      }
    } else {
      toast.error(res.message);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) {
      toast.error('Out of Stock!');
      return;
    }

    const res = await addToCart(product._id, 1);
    if (res.success) {
      toast.success('Added to Cart! 🛒');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.slug || product._id}`}>
        {/* Card Image Container */}
        <div className="image-container">
          <img
            src={product.images[0] || 'https://via.placeholder.com/400x400?text=Product'}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          {/* Wishlist Icon */}
          <button className="wishlist-toggle" onClick={handleWishlistToggle}>
            {isWishlisted ? <FaHeart className="heart-filled" /> : <FaRegHeart />}
          </button>
          
          {/* Discount tag if present */}
          {product.discount > 0 && (
            <span className="discount-tag">{product.discount}% OFF</span>
          )}
        </div>

        {/* Card Details */}
        <div className="product-info">
          <span className="brand-label">{product.brand}</span>
          <h3 className="product-title">{product.name}</h3>

          {/* Rating Display */}
          <div className="rating-row">
            <span className="rating-badge">
              {product.ratings.toFixed(1)} <FaStar className="star-icon" />
            </span>
            <span className="review-count">({product.numReviews})</span>
          </div>

          {/* Price Block */}
          <div className="price-row">
            <span className="sale-price">{formatPrice(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="mrp-price">{formatPrice(product.mrp)}</span>
                <span className="discount-percentage">
                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                </span>
              </>
            )}
          </div>
          
          {/* Stock details */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="stock-alert">Hurry, only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="stock-alert out-of-stock">Out of Stock</p>
          )}
        </div>
      </Link>
      
      {/* Quick Add to Cart button */}
      <button
        className={`quick-add-btn ${product.stock === 0 ? 'disabled' : ''}`}
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
