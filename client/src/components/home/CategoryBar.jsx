import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLaptop, FaMobileAlt, FaTshirt, FaHome, FaTv, FaBook, FaRunning, FaMagic } from 'react-icons/fa';
import './CategoryBar.css';

const categories = [
  { id: '1', name: 'Mobiles', slug: 'mobiles', icon: <FaMobileAlt /> },
  { id: '2', name: 'Electronics', slug: 'electronics', icon: <FaLaptop /> },
  { id: '3', name: 'Fashion', slug: 'fashion', icon: <FaTshirt /> },
  { id: '4', name: 'Home & Kitchen', slug: 'home-kitchen', icon: <FaHome /> },
  { id: '5', name: 'Appliances', slug: 'appliances', icon: <FaTv /> },
  { id: '6', name: 'Books', slug: 'books', icon: <FaBook /> },
  { id: '7', name: 'Sports', slug: 'sports', icon: <FaRunning /> },
  { id: '8', name: 'Beauty', slug: 'beauty', icon: <FaMagic /> },
];

const CategoryBar = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/products?category=${slug}`);
  };

  return (
    <div className="category-bar-wrapper">
      <div className="container category-bar-container">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat.id}
            className="category-circle-item"
            onClick={() => handleCategoryClick(cat.slug)}
          >
            <div className="category-icon-bubble">
              {cat.icon}
            </div>
            <span className="category-item-label">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
