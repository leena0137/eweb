import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Col 1: About */}
        <div className="footer-col about-col">
          <h3 className="footer-title">Indiacart<span>24</span></h3>
          <p className="about-text">
            India's ultimate online shopping destination. Offering a massive collection of electronics, fashion, mobile phones, home appliances, and more at unbeatable prices.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="footer-col links-col">
          <h4 className="footer-subtitle">Useful Links</h4>
          <ul className="footer-links-list">
            <li><Link to="/products">Browse All Products</Link></li>
            <li><Link to="/cart">My Shopping Cart</Link></li>
            <li><Link to="/wishlist">My Wishlist</Link></li>
            <li><Link to="/orders">Order History</Link></li>
          </ul>
        </div>

        {/* Col 3: Customer Care */}
        <div className="footer-col links-col">
          <h4 className="footer-subtitle">Customer Service</h4>
          <ul className="footer-links-list">
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
            <li><a href="#faq">Frequently Asked Questions</a></li>
            <li><a href="#returns">Returns & Refunds</a></li>
          </ul>
        </div>

        {/* Col 4: Contact Info */}
        <div className="footer-col contact-col">
          <h4 className="footer-subtitle">Store Information</h4>
          <ul className="contact-details">
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>B-Wing, Tech Park, Outer Ring Road, Sector 4, Bengaluru, KA - 560103</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>support@indiacart24.com</span>
            </li>
            <li>
              <FaPhoneAlt className="contact-icon" />
              <span>+91 98765 43210</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Indiacart24. All Rights Reserved. Made with ❤️ in India.
          </p>
          <div className="payment-gateways">
            <span className="gateway-label">100% Secure Payments:</span>
            <span className="gateway-card">Visa</span>
            <span className="gateway-card">Mastercard</span>
            <span className="gateway-card">UPI</span>
            <span className="gateway-card">Rupay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
