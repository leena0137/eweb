import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatPrice } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaImage } from 'react-icons/fa';
import './AdminProductsPage.css';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filtering
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Product Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    mrp: '',
    stock: '',
    category: '',
    imagesInput: '', // comma separated links
    specificationsInput: '', // Format: Color: Red, Size: XL
    highlightsInput: '', // comma separated highlights
    isFeatured: false,
  });

  useEffect(() => {
    fetchProducts();
  }, [keyword, selectedCategory, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', {
        params: {
          keyword,
          category: selectedCategory,
          page: currentPage,
          limit: 10,
        },
      });
      if (res.data.success) {
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      brand: '',
      price: '',
      mrp: '',
      stock: '',
      category: categories[0]?._id || '',
      imagesInput: '',
      specificationsInput: '',
      highlightsInput: '',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    
    // Parse specifications array back to input string
    const specsString = p.specifications
      ? p.specifications.map(s => `${s.key}: ${s.value}`).join(', ')
      : '';

    setFormData({
      name: p.name,
      description: p.description,
      brand: p.brand,
      price: p.price,
      mrp: p.mrp || p.price,
      stock: p.stock,
      category: p.category?._id || p.category,
      imagesInput: p.images ? p.images.join(', ') : '',
      specificationsInput: specsString,
      highlightsInput: p.highlights ? p.highlights.join(', ') : '',
      isFeatured: p.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (pId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await api.delete(`/products/${pId}`);
        if (res.data.success) {
          toast.success('Product deleted successfully');
          fetchProducts();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, description, brand, price, mrp, stock, category, imagesInput, specificationsInput, highlightsInput, isFeatured } = formData;
    
    if (!name || !description || !brand || !price || !stock || !category) {
      toast.error('Please enter all required fields.');
      return;
    }

    setFormSubmitting(true);

    // Process inputs
    const images = imagesInput
      ? imagesInput.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const highlights = highlightsInput
      ? highlightsInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const specifications = specificationsInput
      ? specificationsInput.split(',').map(item => {
          const parts = item.split(':');
          if (parts.length >= 2) {
            return { key: parts[0].trim(), value: parts.slice(1).join(':').trim() };
          }
          return null;
        }).filter(Boolean)
      : [];

    const payload = {
      name,
      description,
      brand,
      price: Number(price),
      mrp: Number(mrp || price),
      stock: Number(stock),
      category,
      images,
      highlights,
      specifications,
      isFeatured,
    };

    try {
      let res;
      if (editingProduct) {
        res = await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        res = await api.post('/products', payload);
      }

      if (res.data.success) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="admin-products-page">
      <div className="admin-products-header flex justify-between align-center">
        <h2>Products List</h2>
        <button className="btn btn-secondary" onClick={handleOpenAddModal}>
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* Filters Row */}
      <div className="admin-filters-card card flex justify-between align-center">
        <div className="admin-search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="admin-select-wrapper">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <Loader />
      ) : (
        <div className="admin-products-table-wrap card">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Brand & Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    No products found. Add new products or modify search keywords.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="admin-product-thumb">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} loading="lazy" />
                        ) : (
                          <FaImage />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="admin-product-ident">
                        <strong>{p.brand}</strong>
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.category?.name || 'Uncategorized'}</td>
                    <td className="admin-product-price-cell">
                      <strong>{formatPrice(p.price)}</strong>
                      {p.mrp && p.mrp > p.price && <del>{formatPrice(p.mrp)}</del>}
                    </td>
                    <td>
                      <span className={`admin-stock-badge ${p.stock > 0 ? 'in' : 'out'}`}>
                        {p.stock > 0 ? `${p.stock} Units` : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-product-actions flex">
                        <button className="admin-action-btn edit" onClick={() => handleOpenEditModal(p)}><FaEdit /></button>
                        <button className="admin-action-btn delete" onClick={() => handleDeleteProduct(p._id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="admin-pagination-row flex justify-between align-center">
              <span>Page {currentPage} of {totalPages}</span>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      )}

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal card">
            <div className="admin-modal-header flex justify-between align-center">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>

            <form className="admin-modal-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    className="form-input"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    className="form-input"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-three">
                <div className="form-group">
                  <label className="form-label">Price (Sale) *</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">MRP (Original) *</label>
                  <input
                    type="number"
                    name="mrp"
                    className="form-input"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Qty *</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-input"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  className="form-input"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Image URLs (comma separated links)</label>
                <input
                  type="text"
                  name="imagesInput"
                  className="form-input"
                  value={formData.imagesInput}
                  onChange={handleInputChange}
                  placeholder="https://link1.jpg, https://link2.jpg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specifications (comma separated Key:Value pairs)</label>
                <input
                  type="text"
                  name="specificationsInput"
                  className="form-input"
                  value={formData.specificationsInput}
                  onChange={handleInputChange}
                  placeholder="Color: Red, Size: XL, Battery: 5000 mAh"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Highlights (comma separated short bullet points)</label>
                <input
                  type="text"
                  name="highlightsInput"
                  className="form-input"
                  value={formData.highlightsInput}
                  onChange={handleInputChange}
                  placeholder="Super Fast Charging, Amoled Screen, 1 Year warranty"
                />
              </div>

              <div className="form-group-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <span>Mark as Featured Product (displays on home page banners)</span>
                </label>
              </div>

              <button type="submit" className="btn btn-secondary w-full" style={{ height: '46px' }} disabled={formSubmitting}>
                {formSubmitting ? 'Saving Product...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
