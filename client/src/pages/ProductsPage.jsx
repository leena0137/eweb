import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import Pagination from '../components/common/Pagination';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaFilter, FaStar, FaTimes, FaThLarge, FaThList } from 'react-icons/fa';
import './ProductsPage.css';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Pagination details
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Selected filters local state (synced with URL search params)
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const ratingParam = searchParams.get('rating') || '';
  const keywordParam = searchParams.get('keyword') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = searchParams.get('page') || '1';

  // Load filter catalogs (Categories, Brands)
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/brands'),
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (brandRes.data.success) setBrands(brandRes.data.data);
      } catch (err) {
        console.error('Failed to load filter choices:', err);
      }
    };
    fetchCatalogs();
  }, []);

  // Fetch products when URL parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams).toString();
        const res = await api.get(`/products?${queryParams}`);
        if (res.data.success) {
          setProducts(res.data.data);
          setTotalPages(res.data.totalPages);
          setCurrentPage(res.data.currentPage);
          setTotalProducts(res.data.totalProducts);
        }
      } catch (err) {
        console.error('Failed to fetch filtered products:', err);
        toast.error('Failed to load products. Try refreshing.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchParams]);

  // Handler to update specific query param
  const updateQueryParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1'); // Reset page to 1 on filter changes

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams);
  };

  const handlePageChange = (pageNumber) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(pageNumber));
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams({ sort: 'newest' }));
  };

  return (
    <div className="container products-page-container">
      {/* Mobile Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="filter-sidebar-overlay" onClick={() => setMobileFilterOpen(false)} />
      )}

      {/* 1. Filter Sidebar */}
      <aside className={`filter-sidebar ${mobileFilterOpen ? 'open' : ''}`}>
        <div className="filter-sidebar-header">
          <h3><FaFilter /> Filters</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={clearAllFilters} className="clear-filters-btn">
              Clear All
            </button>
            <button className="mobile-close-filters" onClick={() => setMobileFilterOpen(false)}>
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Categories Block */}
        <div className="filter-block">
          <h4>Category</h4>
          <div className="filter-options-list">
            <label className="filter-radio-label">
              <input
                type="radio"
                name="category"
                checked={!categoryParam}
                onChange={() => updateQueryParam('category', '')}
              />
              <span>All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat._id} className="filter-radio-label">
                <input
                  type="radio"
                  name="category"
                  checked={categoryParam === cat.slug}
                  onChange={() => updateQueryParam('category', cat.slug)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands Block */}
        <div className="filter-block">
          <h4>Brand</h4>
          <div className="filter-options-list">
            <label className="filter-radio-label">
              <input
                type="radio"
                name="brand"
                checked={!brandParam}
                onChange={() => updateQueryParam('brand', '')}
              />
              <span>All Brands</span>
            </label>
            {brands.map((b) => (
              <label key={b} className="filter-radio-label">
                <input
                  type="radio"
                  name="brand"
                  checked={brandParam === b}
                  onChange={() => updateQueryParam('brand', b)}
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Presets Block */}
        <div className="filter-block">
          <h4>Price</h4>
          <div className="filter-options-list">
            <label className="filter-radio-label">
              <input
                type="radio"
                name="pricePreset"
                checked={!minPriceParam && !maxPriceParam}
                onChange={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('minPrice');
                  newParams.delete('maxPrice');
                  newParams.set('page', '1');
                  setSearchParams(newParams);
                }}
              />
              <span>Any Price</span>
            </label>
            <label className="filter-radio-label">
              <input
                type="radio"
                name="pricePreset"
                checked={maxPriceParam === '1000'}
                onChange={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('minPrice');
                  newParams.set('maxPrice', '1000');
                  newParams.set('page', '1');
                  setSearchParams(newParams);
                }}
              />
              <span>Under ₹1,000</span>
            </label>
            <label className="filter-radio-label">
              <input
                type="radio"
                name="pricePreset"
                checked={minPriceParam === '1000' && maxPriceParam === '5000'}
                onChange={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('minPrice', '1000');
                  newParams.set('maxPrice', '5000');
                  newParams.set('page', '1');
                  setSearchParams(newParams);
                }}
              />
              <span>₹1,000 - ₹5,000</span>
            </label>
            <label className="filter-radio-label">
              <input
                type="radio"
                name="pricePreset"
                checked={minPriceParam === '5000' && maxPriceParam === '20000'}
                onChange={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('minPrice', '5000');
                  newParams.set('maxPrice', '20000');
                  newParams.set('page', '1');
                  setSearchParams(newParams);
                }}
              />
              <span>₹5,000 - ₹20,000</span>
            </label>
            <label className="filter-radio-label">
              <input
                type="radio"
                name="pricePreset"
                checked={minPriceParam === '20000'}
                onChange={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('minPrice', '20000');
                  newParams.delete('maxPrice');
                  newParams.set('page', '1');
                  setSearchParams(newParams);
                }}
              />
              <span>Over ₹20,000</span>
            </label>
          </div>
        </div>

        {/* Ratings Block */}
        <div className="filter-block">
          <h4>Customer Rating</h4>
          <div className="filter-options-list">
            <label className="filter-radio-label">
              <input
                type="radio"
                name="rating"
                checked={!ratingParam}
                onChange={() => updateQueryParam('rating', '')}
              />
              <span>Any Rating</span>
            </label>
            {[4, 3, 2].map((stars) => (
              <label key={stars} className="filter-radio-label">
                <input
                  type="radio"
                  name="rating"
                  checked={ratingParam === String(stars)}
                  onChange={() => updateQueryParam('rating', String(stars))}
                />
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {stars}★ & above
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. Main Products Catalog */}
      <main className="products-main animate-fade-in stagger-1">
        {/* Top bar search info & sort */}
        <div className="catalog-top-bar shadow-premium">
          <div className="search-stats">
            {keywordParam && (
              <span className="search-keyword-display">
                Showing results for "<span>{keywordParam}</span>"
              </span>
            )}
            <p className="results-count-text">
              ({totalProducts} {totalProducts === 1 ? 'product' : 'products'} found)
            </p>
          </div>

          <div className="catalog-controls-row">
            {/* Mobile Filter Button */}
            <button className="mobile-filter-trigger-btn" onClick={() => setMobileFilterOpen(true)}>
              <FaFilter /> Filters
            </button>

            {/* Grid/List View Toggle */}
            <div className="layout-toggle-buttons">
              <button
                className={`layout-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <FaThLarge />
              </button>
              <button
                className={`layout-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FaThList />
              </button>
            </div>

            <div className="sort-selector-wrapper">
              <label htmlFor="sort-dropdown">Sort By:</label>
              <select
                id="sort-dropdown"
                value={sortParam}
                onChange={(e) => updateQueryParam('sort', e.target.value)}
                className="sort-dropdown"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Biggest Discounts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog grid */}
        {loading ? (
          <Loader type="skeleton-grid" />
        ) : products.length === 0 ? (
          <div className="no-products-found shadow-premium">
            <span className="no-products-icon">🔍</span>
            <h3>No Products Found</h3>
            <p>We couldn't find any products matching your selected filters.</p>
            <button onClick={clearAllFilters} className="btn btn-secondary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className={`grid grid-3 product-listing-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {/* Pagination controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
