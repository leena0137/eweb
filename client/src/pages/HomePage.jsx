import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryBar from '../components/home/CategoryBar';
import HeroBanner from '../components/home/HeroBanner';
import DealSection from '../components/home/DealSection';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaUndo, FaTruck, FaHeadset, FaArrowRight, FaFire, FaStar, FaBolt } from 'react-icons/fa';
import './HomePage.css';

const spotlightTiles = [
  {
    title: 'Phones for Every Pace',
    text: 'Flagships, 5G picks, and smart daily drivers.',
    to: '/products?category=mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop',
    tag: 'Hot Deals',
    tagIcon: <FaFire />,
    color: 'linear-gradient(135deg, rgba(12,22,38,0.93) 0%, rgba(12,22,60,0.4) 100%)',
  },
  {
    title: 'Wardrobe Refresh',
    text: 'Comfortable fits, shoes, bags, and accessories.',
    to: '/products?category=fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop',
    tag: 'Up to 70% Off',
    tagIcon: <FaBolt />,
    color: 'linear-gradient(135deg, rgba(40,10,50,0.93) 0%, rgba(60,10,80,0.38) 100%)',
  },
  {
    title: 'Kitchen Made Easier',
    text: 'Cookware, small appliances, storage, and decor.',
    to: '/products?category=home-kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&auto=format&fit=crop',
    tag: 'New Arrivals',
    tagIcon: <FaStar />,
    color: 'linear-gradient(135deg, rgba(10,30,25,0.93) 0%, rgba(10,50,40,0.38) 100%)',
  },
];

const fallbackProducts = [
  {
    _id: 'fallback-iphone',
    slug: 'apple-iphone-15-pro',
    name: 'Apple iPhone 15 Pro',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop'],
    price: 129900,
    mrp: 134900,
    discount: 4,
    stock: 45,
    ratings: 4.8,
    numReviews: 248,
  },
  {
    _id: 'fallback-headphones',
    slug: 'sony-wireless-headphones',
    name: 'Sony Wireless Headphones',
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop'],
    price: 14999,
    mrp: 19999,
    discount: 25,
    stock: 18,
    ratings: 4.7,
    numReviews: 186,
  },
  {
    _id: 'fallback-sneakers',
    slug: 'nike-running-shoes',
    name: 'Nike Running Shoes',
    brand: 'Nike',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop'],
    price: 5999,
    mrp: 8999,
    discount: 33,
    stock: 24,
    ratings: 4.5,
    numReviews: 142,
  },
  {
    _id: 'fallback-kitchen',
    slug: 'premium-kitchen-cooker',
    name: 'Premium Kitchen Cooker',
    brand: 'HomePro',
    images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop'],
    price: 3499,
    mrp: 5299,
    discount: 34,
    stock: 32,
    ratings: 4.4,
    numReviews: 95,
  },
];

const trustBadges = [
  { icon: <FaTruck />, title: 'Free Shipping', text: 'On all orders above ₹500', accent: 'blue' },
  { icon: <FaUndo />, title: '7-Day Returns', text: 'No questions asked policy', accent: 'orange' },
  { icon: <FaShieldAlt />, title: 'Secure Payments', text: '100% encrypted checkout', accent: 'blue' },
  { icon: <FaHeadset />, title: '24/7 Support', text: 'Dedicated customer helpline', accent: 'orange' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await api.get('/products/featured');
        if (res.data.success) {
          setProducts(res.data.data.length > 0 ? res.data.data : fallbackProducts);
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleSubscribe = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Subscribed! Check your email for discount coupons. 🎉');
    setEmail('');
  };

  return (
    <div className="home-page-wrapper">
      {/* Category Icon Bubble Row */}
      <CategoryBar />

      {/* Hero Sliding Banner */}
      <HeroBanner />

      {/* Spotlight Tiles Grid */}
      <div className="container">
        <div className="home-section-header">
          <div className="home-section-label">Featured Collections</div>
          <h2 className="home-section-title">Shop by Category</h2>
          <p className="home-section-subtitle">Handpicked deals across top categories</p>
        </div>
        <div className="home-spotlight-grid">
          {spotlightTiles.map((tile, i) => (
            <Link
              key={tile.title}
              to={tile.to}
              className="home-spotlight-tile"
              style={{
                backgroundImage: `${tile.color}, url(${tile.image})`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div className="spotlight-tag">
                {tile.tagIcon}
                <span>{tile.tag}</span>
              </div>
              <div className="spotlight-body">
                <h3>{tile.title}</h3>
                <p>{tile.text}</p>
                <div className="spotlight-cta">
                  Shop Now <FaArrowRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Deal Section */}
      {loading ? (
        <div className="container"><Loader /></div>
      ) : (
        <DealSection products={products} />
      )}

      {/* Trust Badges */}
      <div className="container trust-badges-section">
        {trustBadges.map((badge, i) => (
          <div key={badge.title} className={`trust-badge-card trust-badge-${badge.accent}`} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="badge-icon-box">
              {badge.icon}
            </div>
            <div className="badge-text-box">
              <h4>{badge.title}</h4>
              <p>{badge.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Products Grid */}
      <div className="container featured-products-wrapper">
        <div className="home-section-header">
          <div className="home-section-label">Top Picks</div>
          <h2 className="home-section-title">Trending Highlights</h2>
          <p className="home-section-subtitle">Explore hot collections and top picks of the week</p>
        </div>
        {loading ? (
          <Loader type="skeleton-grid" />
        ) : (
          <div className="grid grid-auto-fill featured-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <div className="view-all-row">
          <Link to="/products" className="btn btn-view-all">
            View All Products <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* Why Us Section */}
      <div className="why-us-strip">
        <div className="container why-us-inner">
          <div className="why-us-stat">
            <span className="why-stat-num">10L+</span>
            <span className="why-stat-label">Happy Customers</span>
          </div>
          <div className="why-us-divider" />
          <div className="why-us-stat">
            <span className="why-stat-num">50K+</span>
            <span className="why-stat-label">Products Listed</span>
          </div>
          <div className="why-us-divider" />
          <div className="why-us-stat">
            <span className="why-stat-num">500+</span>
            <span className="why-stat-label">Brands & Sellers</span>
          </div>
          <div className="why-us-divider" />
          <div className="why-us-stat">
            <span className="why-stat-num">4.8★</span>
            <span className="why-stat-label">Average Rating</span>
          </div>
        </div>
      </div>

      {/* Newsletter / Promo Banner */}
      <div className="container promo-banner-container animate-fade-in stagger-3">
        <div className="promo-banner">
          <div className="promo-glow promo-glow-1" />
          <div className="promo-glow promo-glow-2" />
          <div className="promo-content">
            <div className="promo-badge">🎁 Exclusive Offer</div>
            <h2 className="promo-title">Join the Indiacart24 Club!</h2>
            <p className="promo-desc">
              Subscribe for active discount coupons, early deal alerts, and shopping picks tuned to your interests.
            </p>
            <div className="promo-input-group">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="promo-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              />
              <button onClick={handleSubscribe} className="btn promo-btn">
                Subscribe
              </button>
            </div>
            <p className="promo-fine-print">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
