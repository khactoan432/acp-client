import React from 'react';
import Header from './Header';  // Header của user
import { Outlet } from 'react-router-dom';  // Điều này sẽ render các trang con

const Layout: React.FC = () => {
  return (
    <div>
      <Header />
      {/* Outlet sẽ là nơi hiển thị các route con */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;