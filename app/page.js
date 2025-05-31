'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/Navbar/Sidebar';
import TopNavbar from './components/Navbar/TopNavbar';
import { useTheme } from './context/ThemeContext';

// Import Dashboard components as default imports
import Cards from './components/Dashboard/cards';
import Graphs from './components/Dashboard/graphs';
import Table from './components/Dashboard/table';

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const { theme } = useTheme();

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

  const isDark = theme === 'dark';
  const pageBg = isDark ? '#121212' : '#f0f7f5';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const textColor = isDark ? '#f8f9fa' : '#212529';

  return (
    <div
      className="d-flex"
      style={{
        backgroundColor: pageBg,
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Area */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: isSidebarOpen && isDesktop ? '250px' : '0',
          transition: 'margin-left 0.3s ease',
          color: textColor,
          minHeight: '100vh',
        }}
      >
        {/* Top Navbar */}
        <TopNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Content area */}
        <main
          className="flex-grow-1 p-4"
          style={{
            overflowY: 'auto',
            paddingTop: '70px',
          }}
        >
          <div className="container-lg">
            {/* Use your imported components */}
            <section className="mb-4" style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '8px', border: isDark ? '1px solid #2c2c2c' : '1px solid #d1e7dd' }}>
              <Cards />
            </section>

            <section className="mb-4" style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '8px', border: isDark ? '1px solid #2c2c2c' : '1px solid #d1e7dd' }}>
              <Graphs />
            </section>

            <section className="mb-4" style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '8px', border: isDark ? '1px solid #2c2c2c' : '1px solid #d1e7dd' }}>
              <Table />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
