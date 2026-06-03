import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch, FaUser, FaSignOutAlt, FaTshirt, FaMobileAlt, FaLaptop, FaHome, FaTv, FaBook, FaRunning, FaMagic, FaBars, FaTimes, FaChevronDown, FaCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatters';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const { wishlistItems } = useWishlist();

  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'User';
  const firstName = displayName.split(' ')[0];
  const userInitial = displayName.charAt(0).toUpperCase();
  const userEmail = user?.email || 'Account details';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (catSlug) => {
    navigate(`/products?category=${catSlug}`);
    setMobileMenuOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    closeDropdown();
    setMobileMenuOpen(false);
    await logout();
  };

  return (
    <header className="site-header animate-fade-in">
      {/* Row 1: Primary Navbar */}
      <div className="nav-top">
        <div className="container nav-top-container">
          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
            <span className="logo-text">Indiacart<span>24</span></span>
          </Link>

          {/* Search Form */}
          <form className="nav-search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Nav Icons */}
          <div className="nav-actions">
            {/* User Dropdown (desktop) */}
            {user ? (
              <div className="nav-action-item user-menu-container" ref={dropdownRef}>
                <Link to="/profile" className="user-profile-trigger" onClick={closeDropdown} aria-label="Open my profile">
                  <div className="user-avatar-mini">
                    {userInitial}
                  </div>
                  <span className="nav-action-text user-name-text">Hi, {firstName}</span>
                </Link>
                <button
                  type="button"
                  className="user-dropdown-toggle"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                  aria-label="Open account menu"
                >
                  <FaChevronDown className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-user-info">
                      <div className="dropdown-avatar">{userInitial}</div>
                      <div>
                        <p className="dropdown-user-name">{displayName}</p>
                        <p className="dropdown-user-email">{userEmail}</p>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-link" onClick={closeDropdown}>
                      <FaUser /> My Profile
                    </Link>
                    <Link to="/orders" className="dropdown-link" onClick={closeDropdown}>
                      <FaShoppingCart /> My Orders
                    </Link>
                    <Link to="/wishlist" className="dropdown-link" onClick={closeDropdown}>
                      <FaHeart /> Wishlist
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-link admin-highlight" onClick={closeDropdown}>
                        <FaCog /> Admin Panel
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-link logout-btn" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-action-item btn-login-nav">
                <FaUser className="nav-icon" />
                <span className="nav-action-text font-bold">Login</span>
              </Link>
            )}

            {/* Mobile Profile Avatar (visible only on mobile for logged-in users) */}
            {user && (
              <Link to="/profile" className="mobile-profile-avatar-btn" aria-label="My Profile">
                <div className="user-avatar-mini">{userInitial}</div>
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="nav-action-item nav-wishlist-btn">
              <div className="badge-icon-wrapper">
                <FaHeart className="nav-icon animate-float" style={{ animationDuration: '3s' }} />
                {wishlistItems.length > 0 && (
                  <span className="badge-count count-red">{wishlistItems.length}</span>
                )}
              </div>
              <span className="nav-action-text">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nav-action-item nav-cart-btn">
              <div className="badge-icon-wrapper">
                <FaShoppingCart className="nav-icon" />
                {cartCount > 0 && (
                  <span className="badge-count count-orange">{cartCount}</span>
                )}
              </div>
              <div className="cart-text-details">
                <span className="nav-action-text font-bold">Cart</span>
                {cartTotal > 0 && <span className="cart-nav-total">{formatPrice(cartTotal)}</span>}
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Row */}
      <div className="mobile-search-row">
        <form className="nav-search-form" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search for products, brands..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </div>
        </form>
      </div>

      {/* Row 2: Secondary Category Nav */}
      <div className="nav-bottom animate-fade-in stagger-1">
        <div className="container nav-bottom-container">
          <ul className="category-links">
            <li><button onClick={() => handleCategoryClick('mobiles')}><FaMobileAlt /> Mobiles</button></li>
            <li><button onClick={() => handleCategoryClick('electronics')}><FaLaptop /> Electronics</button></li>
            <li><button onClick={() => handleCategoryClick('fashion')}><FaTshirt /> Fashion</button></li>
            <li><button onClick={() => handleCategoryClick('home-kitchen')}><FaHome /> Home &amp; Kitchen</button></li>
            <li><button onClick={() => handleCategoryClick('appliances')}><FaTv /> Appliances</button></li>
            <li><button onClick={() => handleCategoryClick('books')}><FaBook /> Books</button></li>
            <li><button onClick={() => handleCategoryClick('sports')}><FaRunning /> Sports</button></li>
            <li><button onClick={() => handleCategoryClick('beauty')}><FaMagic /> Beauty</button></li>
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar Overlay and Menu */}
      {mobileMenuOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`mobile-sidebar-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          {user && (
            <div className="mobile-user-info">
              <div className="mobile-avatar">{userInitial}</div>
              <div>
                <p className="mobile-user-name">{displayName}</p>
                <p className="mobile-user-email">{userEmail}</p>
              </div>
            </div>
          )}
          <button onClick={() => setMobileMenuOpen(false)}><FaTimes /></button>
        </div>

        {user && (
          <div className="mobile-quick-links">
            <Link to="/profile" onClick={closeMobileMenu} className="mobile-quick-link"><FaUser /> My Profile</Link>
            <Link to="/orders" onClick={closeMobileMenu} className="mobile-quick-link"><FaShoppingCart /> My Orders</Link>
            <Link to="/wishlist" onClick={closeMobileMenu} className="mobile-quick-link"><FaHeart /> Wishlist
              {wishlistItems.length > 0 && <span className="mobile-badge">{wishlistItems.length}</span>}
            </Link>
            <Link to="/cart" onClick={closeMobileMenu} className="mobile-quick-link"><FaShoppingCart /> Cart
              {cartCount > 0 && <span className="mobile-badge mobile-badge-orange">{cartCount}</span>}
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" onClick={closeMobileMenu} className="mobile-quick-link mobile-admin-link"><FaCog /> Admin Panel</Link>
            )}
          </div>
        )}

        <p className="mobile-section-label">Shop by Category</p>
        <ul className="mobile-sidebar-links">
          <li><button onClick={() => handleCategoryClick('mobiles')}><FaMobileAlt /> Mobiles</button></li>
          <li><button onClick={() => handleCategoryClick('electronics')}><FaLaptop /> Electronics</button></li>
          <li><button onClick={() => handleCategoryClick('fashion')}><FaTshirt /> Fashion</button></li>
          <li><button onClick={() => handleCategoryClick('home-kitchen')}><FaHome /> Home &amp; Kitchen</button></li>
          <li><button onClick={() => handleCategoryClick('appliances')}><FaTv /> Appliances</button></li>
          <li><button onClick={() => handleCategoryClick('books')}><FaBook /> Books</button></li>
          <li><button onClick={() => handleCategoryClick('sports')}><FaRunning /> Sports</button></li>
          <li><button onClick={() => handleCategoryClick('beauty')}><FaMagic /> Beauty</button></li>
        </ul>

        {user && (
          <button className="mobile-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
