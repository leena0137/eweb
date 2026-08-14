import React from 'react';
import './AboutPage.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container about-container">
        <div className="about-header text-center">
          <h1>About Us</h1>
          <p>India Cart 24 is an online shopping platform owned and operated by PAISAMAKER. We are committed to providing quality products, secure payments, and reliable customer service across India.</p>
        </div>

        <div className="about-content">
          <div className="about-card card">
            <h2>Our Details</h2>
            <div className="about-info-list">
              <div className="info-item">
                <FaCheckCircle className="icon" />
                <div>
                  <strong>Legal Business Name</strong>
                  <p>PAISAMAKER</p>
                </div>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt className="icon" />
                <div>
                  <strong>Registered Address</strong>
                  <p>C/O MEDA RAM, KODKA, RANIWARA, Jalore, Rajasthan – 343040</p>
                </div>
              </div>
              <div className="info-item">
                <FaEnvelope className="icon" />
                <div>
                  <strong>Email</strong>
                  <p>paisamaker.in@gmail.com</p>
                </div>
              </div>
              <div className="info-item">
                <FaPhoneAlt className="icon" />
                <div>
                  <strong>Customer Support</strong>
                  <p>+91 9996848979</p>
                </div>
              </div>
              <div className="info-item">
                <FaClock className="icon" />
                <div>
                  <strong>Support Hours</strong>
                  <p>Monday – Saturday, 10:00 AM – 05:00 PM (IST)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
