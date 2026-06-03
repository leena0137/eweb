import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from 'react-icons/fa';
import './AdminCategoriesPage.css';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    icon: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      icon: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      icon: cat.icon || '',
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Are you sure you want to delete this category? Deleting this could cause products in this category to show up as uncategorized.')) {
      try {
        const res = await api.delete(`/categories/${catId}`);
        if (res.data.success) {
          toast.success('Category deleted successfully');
          fetchCategories();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, description, image, icon, isActive } = formData;
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setFormSubmitting(true);
    const payload = {
      name,
      description,
      image: image || 'https://via.placeholder.com/150x150?text=Category',
      icon: icon || 'FaBox',
      isActive,
    };

    try {
      let res;
      if (editingCategory) {
        res = await api.put(`/categories/${editingCategory._id}`, payload);
      } else {
        res = await api.post('/categories', payload);
      }

      if (res.data.success) {
        toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save category failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="admin-categories-page">
      <div className="admin-categories-header flex justify-between align-center">
        <h2>Store Categories</h2>
        <button className="btn btn-secondary" onClick={handleOpenAddModal}>
          <FaPlus /> Add New Category
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="admin-categories-grid">
          {categories.length === 0 ? (
            <div className="card text-center" style={{ padding: '40px', gridColumn: '1 / -1' }}>
              No categories found. Start by creating one.
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="admin-category-card card flex align-center justify-between">
                <div className="cat-left flex align-center">
                  <div className="cat-image-circle">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} loading="lazy" />
                    ) : (
                      <FaImage />
                    )}
                  </div>
                  <div className="cat-details">
                    <h3>{cat.name}</h3>
                    <p>{cat.description || 'No description provided.'}</p>
                    <span className={`admin-status-badge ${cat.isActive ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: '6px' }}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="cat-actions flex">
                  <button className="admin-action-btn edit" onClick={() => handleOpenEditModal(cat)}><FaEdit /></button>
                  <button className="admin-action-btn delete" onClick={() => handleDeleteCategory(cat._id)}><FaTrash /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Category Edit Modal Dialog */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal card" style={{ maxWidth: '500px' }}>
            <div className="admin-modal-header flex justify-between align-center">
              <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-input"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short description of items in this category"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  name="image"
                  className="form-input"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://link-to-category-image.jpg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon Tag (e.g. FaLaptop, FaTshirt)</label>
                <input
                  type="text"
                  name="icon"
                  className="form-input"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="FaLaptop"
                />
              </div>

              <div className="form-group-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span>Category is Active & Visible</span>
                </label>
              </div>

              <button type="submit" className="btn btn-secondary w-full" disabled={formSubmitting}>
                {formSubmitting ? 'Saving Category...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
