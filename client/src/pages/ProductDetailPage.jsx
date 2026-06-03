import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Rating from '../components/common/Rating';
import Loader from '../components/common/Loader';
import ProductCard from '../components/common/ProductCard';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/formatters';
import toast from 'react-hot-toast';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaShieldAlt, FaTruck, FaUndoAlt, FaPen } from 'react-icons/fa';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Detail actions state
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const productRes = await api.get(`/products/${id}`);
        if (productRes.data.success) {
          const fetchedProduct = productRes.data.data;
          setProduct(fetchedProduct);
          setActiveImage(fetchedProduct.images[0] || '');

          // Fetch reviews
          const reviewRes = await api.get(`/reviews/product/${fetchedProduct._id}`);
          if (reviewRes.data.success) setReviews(reviewRes.data.data);

          // Fetch related products (same category)
          const relatedRes = await api.get(`/products?category=${fetchedProduct.category._id || fetchedProduct.category}`);
          if (relatedRes.data.success) {
            // Filter out current product
            setRelatedProducts(relatedRes.data.data.filter(p => p._id !== fetchedProduct._id));
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        toast.error('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock.');
      return;
    }
    const res = await addToCart(product._id, quantity);
    if (res.success) {
      toast.success('Added to Cart! 🛒');
    } else {
      toast.error(res.message);
    }
  };

  const handleBuyNow = async () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock.');
      return;
    }
    const res = await addToCart(product._id, quantity);
    if (res.success) {
      navigate('/cart');
    } else {
      toast.error(res.message);
    }
  };

  const handleWishlistToggle = async () => {
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please enter a review comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/reviews/${product._id}`, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Review submitted successfully!');
        setReviewTitle('');
        setReviewComment('');
        
        // Refresh reviews and product details (for aggregated rating changes)
        const [revRes, prodRes] = await Promise.all([
          api.get(`/reviews/product/${product._id}`),
          api.get(`/products/${product._id}`),
        ]);
        if (revRes.data.success) setReviews(revRes.data.data);
        if (prodRes.data.success) setProduct(prodRes.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review. Login required.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="container"><Loader /></div>;
  if (!product) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><h2>Product Not Found</h2></div>;

  return (
    <div className="container product-detail-container">
      {/* Breadcrumbs */}
      <nav className="detail-breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/products">Shop</Link> &gt; <span className="active">{product.name}</span>
      </nav>

      {/* Main product showcase */}
      <div className="detail-showcase-grid">
        {/* Left: Gallery */}
        <div className="gallery-showcase">
          <div className="main-image-wrapper">
            <img src={activeImage} alt={product.name} className="detail-main-image" />
          </div>
          <div className="thumbnail-strip">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className={`thumbnail-card ${img === activeImage ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="details-info-box">
          <span className="info-brand-tag">{product.brand}</span>
          <h1 className="info-product-title">{product.name}</h1>

          {/* Rating overview */}
          <div className="info-rating-row">
            <Rating value={product.ratings} text={`${product.ratings.toFixed(1)} Stars`} />
            <span className="info-review-count">({reviews.length} Customer Reviews)</span>
          </div>

          {/* Price Overview */}
          <div className="info-price-block">
            <div className="price-primary-row">
              <span className="info-sale-price">{formatPrice(product.price)}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="info-mrp-price">{formatPrice(product.mrp)}</span>
                  <span className="info-discount-badge">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="taxes-notice">Inclusive of all taxes</p>
          </div>

          {/* highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="info-highlights-box">
              <h4>Product Highlights</h4>
              <ul>
                {product.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector & Purchase Actions */}
          <div className="info-purchase-actions">
            {product.stock > 0 ? (
              <div className="qty-picker">
                <label>Qty:</label>
                <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                  {[...Array(Math.min(product.stock, 5)).keys()].map((n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="badge badge-danger out-of-stock-badge">Sold Out</div>
            )}

            <div className="purchase-buttons-wrapper">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-secondary buy-cart-btn"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn btn-primary buy-now-btn"
              >
                Buy Now
              </button>
              <button
                onClick={handleWishlistToggle}
                className="btn btn-outline wishlist-btn-circle"
              >
                {isWishlisted ? <FaHeart style={{ color: 'var(--danger)' }} /> : <FaRegHeart />}
              </button>
            </div>
          </div>

          {/* Specifications table snippet */}
          <div className="specs-table-wrapper" style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
              Specifications
            </h4>
            <table className="specs-table">
              <tbody>
                {product.specifications.slice(0, 4).map((spec, i) => (
                  <tr key={i}>
                    <td className="spec-key">{spec.key}</td>
                    <td className="spec-value">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trust Guarantees */}
          <div className="detail-guarantees-grid">
            <div className="guarantee-box">
              <FaTruck /> <span>Free Shipping</span>
            </div>
            <div className="guarantee-box">
              <FaUndoAlt /> <span>7-Day Return</span>
            </div>
            <div className="guarantee-box">
              <FaShieldAlt /> <span>Secure Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews tabs split */}
      <div className="tabs-description-reviews" style={{ marginTop: '40px' }}>
        <h2 className="section-tab-title">Product Details & Reviews</h2>
        <div className="details-split-grid">
          {/* Left: Product Description */}
          <div className="details-desc-left">
            <h3>Description</h3>
            <p className="desc-text-content">{product.description}</p>

            <h3 style={{ marginTop: '24px' }}>All Specifications</h3>
            <table className="specs-table spec-table-full">
              <tbody>
                {product.specifications.map((spec, i) => (
                  <tr key={i}>
                    <td className="spec-key">{spec.key}</td>
                    <td className="spec-value">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right: Review Listings */}
          <div className="reviews-section-right">
            <h3>Customer Reviews</h3>
            
            {/* Review form */}
            <form className="write-review-form card" onSubmit={handleReviewSubmit}>
              <h4><FaPen /> Write a Review</h4>
              <div className="form-group" style={{ marginTop: '8px' }}>
                <label className="form-label">Rating score:</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="form-input"
                  style={{ width: '80px' }}
                >
                  <option value="5">5 ★</option>
                  <option value="4">4 ★</option>
                  <option value="3">3 ★</option>
                  <option value="2">2 ★</option>
                  <option value="1">1 ★</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Review title (e.g. Awesome Product!)"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Tell us what you liked or disliked about this product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="form-input"
                  rows="3"
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="btn btn-secondary"
                style={{ fontSize: '13px', padding: '8px 16px', width: '100%' }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>

            {/* List reviews */}
            <div className="reviews-scroller-box" style={{ marginTop: '24px' }}>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  No reviews yet. Be the first to write a review!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="review-card card" style={{ marginBottom: '12px' }}>
                    <div className="review-card-top flex justify-between align-center">
                      <div className="user-ident">
                        <strong>{rev.user?.name || 'Anonymous User'}</strong>
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '11px' }}>
                        {rev.rating} ★
                      </span>
                    </div>
                    {rev.title && <h5 className="review-card-title">{rev.title}</h5>}
                    <p className="review-card-text">{rev.comment}</p>
                    <span className="review-card-date" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar products catalog */}
      {relatedProducts.length > 0 && (
        <div className="related-products-carousel" style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '700' }}>Similar Products You May Like</h2>
          <div className="grid grid-4 related-grid">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
