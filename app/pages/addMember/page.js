'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Navbar/Sidebar';
import TopNavbar from '../../components/Navbar/TopNavbar';

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className="flex-grow-1 w-100"
        style={{
          marginLeft: isSidebarOpen && isDesktop ? '250px' : '0',
          transition: 'margin-left 0.3s',
          minHeight: '100vh',
        }}
      >
        <TopNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className="p-4">
          <h1>Welcome to the add Members</h1>
          <p>This is a sample page with both the sidebar and the top navbar.</p>
        </main>
      </div>
    </div>
  );
}
