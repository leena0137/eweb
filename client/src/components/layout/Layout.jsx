import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="app-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main className="app-main-content" style={{ flexGrow: 1, padding: '20px 0' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
