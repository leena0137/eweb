import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaBox,
  FaUsers,
  FaShoppingBag,
  FaChartLine,
  FaTags,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import './AdminLayout.css';

const navItems = [
  {
    section: 'Main',
    links: [
      { to: '/admin', label: 'Dashboard', icon: <FaChartLine />, end: true },
      { to: '/admin/products', label: 'Products', icon: <FaBox /> },
      { to: '/admin/orders', label: 'Orders', icon: <FaShoppingBag /> },
    ],
  },
  {
    section: 'Management',
    links: [
      { to: '/admin/customers', label: 'Customers', icon: <FaUsers /> },
      { to: '/admin/categories', label: 'Categories', icon: <FaTags /> },
    ],
  },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      <div
        className={`admin-sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={closeMobile}
      />

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">IC</div>
          <span className="admin-sidebar-logo-text">
            India<span>cart24</span>
          </span>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section}>
              <div className="admin-sidebar-section-title">{section.section}</div>
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMobile}
                >
                  <span className="admin-nav-link-icon">{link.icon}</span>
                  <span className="admin-nav-link-text">{link.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className={`admin-main ${collapsed ? 'expanded' : ''}`}>
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div>
              <h1 className="admin-topbar-title">Admin Panel</h1>
              <p className="admin-topbar-breadcrumb">Manage your store</p>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-topbar-user">
              <div className="admin-topbar-avatar">
                {getInitials(user?.name)}
              </div>
              <div>
                <div className="admin-topbar-username">{user?.name || 'Admin'}</div>
                <div className="admin-topbar-role">Administrator</div>
              </div>
            </div>
            <button className="admin-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
