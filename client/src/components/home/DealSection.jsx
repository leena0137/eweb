import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaRegClock } from 'react-icons/fa';
import ProductCard from '../common/ProductCard';
import './DealSection.css';

const DealSection = ({ products }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 45, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="deal-section-wrapper">
      <div className="container deal-section-container">
        {/* Deal Section Header */}
        <div className="deal-header animate-fade-in stagger-1">
          <div className="deal-header-left">
            <h2 className="deal-title"><FaBolt /> Deals of the Day</h2>
            <div className="countdown-timer">
              <span className="timer-icon"><FaRegClock /></span>
              <div className="timer-unit">
                <span className="timer-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="timer-lbl">h</span>
              </div>
              <span className="timer-colon">:</span>
              <div className="timer-unit">
                <span className="timer-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="timer-lbl">m</span>
              </div>
              <span className="timer-colon">:</span>
              <div className="timer-unit">
                <span className="timer-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="timer-lbl">s</span>
              </div>
              <span className="timer-suffix">Left</span>
            </div>
          </div>
          <Link to="/products" className="btn btn-secondary view-all-btn">
            View All
          </Link>
        </div>

        {/* Deal Products Grid */}
        <div className="deal-products-grid">
          {products && products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealSection;
