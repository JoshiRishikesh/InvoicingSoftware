'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Navbar/Sidebar';
import TopNavbar from '../../components/Navbar/TopNavbar';
import { useTheme } from '../../context/ThemeContext';
import NewInvoice from '../../components/Form/NewInvoice/newInvoice';

export default function NewInvoicePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false); // Track screen size
  const { theme } = useTheme();

  useEffect(() => {
    // Client-only code to check screen size
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const isDark = theme === 'dark';

  const bgColor = isDark ? '#121212' : '#f0f4f8';
  const textColor = isDark ? 'text-light' : 'text-dark';

  return (
    <div className="d-flex" style={{ backgroundColor: bgColor }}>
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className="flex-grow-1 w-100"
        style={{
          marginLeft: isSidebarOpen && isDesktop ? '250px' : '0',
          transition: 'margin-left 0.3s',
          backgroundColor: bgColor,
          color: isDark ? '#ddd' : '#222',
          minHeight: '100vh',
        }}
      >
        <TopNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={`py-4 px-3 ${textColor}`}>
          <div className="container">
            <NewInvoice />
          </div>
        </main>
      </div>
    </div>
  );
}
