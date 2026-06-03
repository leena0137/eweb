import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTag, FaStar, FaBolt } from 'react-icons/fa';
import './HeroBanner.css';

const slides = [
  {
    title: 'Super Value Days',
    subtitle: 'Electronics & Gadgets Sale',
    description: 'Explore standout prices on phones, wireless audio, smart TVs, laptops, and daily tech accessories.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&auto=format&fit=crop',
    imagePosition: 'center right',
    overlay: 'linear-gradient(90deg, rgba(12, 22, 38, 0.96) 0%, rgba(12, 22, 38, 0.82) 44%, rgba(12, 22, 38, 0.28) 100%)',
    actionText: 'Shop Electronics',
    link: '/products?category=electronics',
    badge: 'Up to 60% off',
    badgeIcon: <FaBolt />,
    proof: ['Fast delivery', 'Top brands', 'Easy returns'],
  },
  {
    title: 'Fashion Forward',
    subtitle: 'The Great India Fashion Sale',
    description: 'Refresh everyday looks with premium casual wear, active shoes, watches, bags, and accessories.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&auto=format&fit=crop',
    imagePosition: 'center',
    overlay: 'linear-gradient(90deg, rgba(32, 20, 38, 0.95) 0%, rgba(32, 20, 38, 0.78) 44%, rgba(32, 20, 38, 0.22) 100%)',
    actionText: 'Explore Fashion',
    link: '/products?category=fashion',
    badge: 'Up to 70% off',
    badgeIcon: <FaTag />,
    proof: ['Fresh arrivals', 'Smart prices', 'Style picks'],
  },
  {
    title: 'Smart Home Living',
    subtitle: 'Elegant Kitchen & Home Essentials',
    description: 'Bring home appliances, cookware, decor, and furniture that make busy spaces feel calmer.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&auto=format&fit=crop',
    imagePosition: 'center',
    overlay: 'linear-gradient(90deg, rgba(18, 35, 31, 0.96) 0%, rgba(18, 35, 31, 0.78) 46%, rgba(18, 35, 31, 0.22) 100%)',
    actionText: 'View Kitchenware',
    link: '/products?category=home-kitchen',
    badge: 'New picks',
    badgeIcon: <FaStar />,
    proof: ['Modern homes', 'Daily utility', 'Curated deals'],
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 6000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  const goToSlide = (idx) => {
    if (isAnimating || idx === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(idx);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handlePrev = () => {
    goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  const goToNext = () => {
    goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const handleNext = () => goToNext();

  return (
    <div className="hero-banner">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{
            backgroundImage: `${slide.overlay}, url(${slide.image})`,
            backgroundPosition: slide.imagePosition,
          }}
        >
          <div className="container slide-content-wrapper">
            <div className="slide-body">
              <div className="slide-badge">
                <span className="slide-badge-icon">{slide.badgeIcon}</span>
                {slide.badge}
              </div>

              <span className="slide-subtitle">{slide.subtitle}</span>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-desc">{slide.description}</p>

              <div className="slide-actions">
                <button
                  onClick={() => navigate(slide.link)}
                  className="btn btn-primary btn-slide-action"
                >
                  {slide.actionText}
                </button>
                <span className="slide-hint">Free delivery on first order</span>
              </div>

              <div className="hero-proof-row">
                {slide.proof.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Control Buttons */}
      <button className="slider-control prev-control" onClick={handlePrev} aria-label="Previous slide">
        <FaChevronLeft />
      </button>
      <button className="slider-control next-control" onClick={handleNext} aria-label="Next slide">
        <FaChevronRight />
      </button>

      {/* Navigation Indicators */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            type="button"
            key={index}
            className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="slide-counter">
        {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  );
};

export default HeroBanner;
