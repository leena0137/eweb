import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaQuestionCircle } from 'react-icons/fa';
import ProductCard from '../components/common/ProductCard';
import api from '../utils/api';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const [activeFaq, setActiveFaq] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/products/featured');
        if (res.data.success) {
          setRecommendedProducts(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch recommended products:', err);
      }
    };
    fetchRecommendations();
  }, []);

  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'We deliver orders within 3-5 business days across major cities in India. For remote locations, it may take 5-7 business days.',
    },
    {
      q: 'Can I pay using Cash on Delivery (COD)?',
      a: 'Yes, we support Cash on Delivery (COD) for orders up to ₹10,000. You can pay via cash or UPI to the delivery executive.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a hassle-free 7-day return policy for unused products in their original packaging. Returns can be initiated from the order details page.',
    },
    {
      q: 'How do I track my order?',
      a: 'Once shipped, you will get a tracking link via SMS. You can also track live updates on the order history details page.',
    },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Your message has been received! We will get back to you soon. 📩');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="contact-page">
      <div className="container contact-container">
        {/* Page title banner */}
        <div className="contact-title-banner text-center">
          <h1>Contact Us</h1>
          <p>Have questions about your order, shipping, or products? Send us a message or find quick answers below.</p>
        </div>

        {/* Form and Info Columns */}
        <div className="contact-split-layout">
          {/* Left Column: Form Card */}
          <div className="contact-form-card card">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="form-input"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject of message"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea
                  name="message"
                  className="form-input"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your query or feedback here..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-secondary send-message-btn" disabled={submitting}>
                <FaPaperPlane /> {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right Column: Corporate Contacts */}
          <div className="contact-info-panel flex flex-column gap-md">
            {/* Info Card */}
            <div className="info-box-card card">
              <h3>Indiacart24 Support</h3>
              <div className="contact-info-list">
                <div className="info-item">
                  <FaPhoneAlt className="icon" />
                  <div>
                    <strong>Phone Support</strong>
                    <p>+91 1800 240 2424 (Toll-Free)</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaEnvelope className="icon" />
                  <div>
                    <strong>Email Address</strong>
                    <p>support@indiacart24.com</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt className="icon" />
                  <div>
                    <strong>Corporate Headquarters</strong>
                    <p>Bengaluru Corporate Tower, Outer Ring Road, Karnataka - 560103</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaClock className="icon" />
                  <div>
                    <strong>Operational Hours</strong>
                    <p>Monday - Saturday: 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="map-placeholder-card card flex align-center justify-between">
              <div>
                <h4>Interactive Location</h4>
                <p>Find us on Google Maps</p>
              </div>
              <div className="map-dummy-icon">🗺️</div>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="faqs-accordion-section card">
          <h2>Frequently Asked Questions</h2>
          <div className="faqs-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                <div className="faq-question flex justify-between align-center" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                  <span><FaQuestionCircle className="question-mark" /> {faq.q}</span>
                  <span className="expand-indicator">{activeFaq === index ? '−' : '+'}</span>
                </div>
                {activeFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="contact-recommendations animate-fade-in stagger-2">
            <h2 className="recommendations-title">You May Also Like</h2>
            <p className="recommendations-subtitle">Take a look at some of our most trending products today</p>
            <div className="grid grid-4 recommendations-grid">
              {recommendedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
