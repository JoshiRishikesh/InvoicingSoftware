'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Navbar/Sidebar';
import TopNavbar from '../../components/Navbar/TopNavbar';
import { useTheme } from '../../context/ThemeContext';
import Upper from '../../components/Calendar/upper';
import Middle from '../../components/Calendar/middle';

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bgColor = isDark ? '#121212' : '#f8f9fa';
  const textColor = isDark ? 'text-light' : 'text-dark';

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="d-flex" style={{ backgroundColor: bgColor }}>
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className="flex-grow-1 w-100"
        style={{
          marginLeft: isSidebarOpen && isDesktop ? '250px' : '0',
          transition: 'margin-left 0.3s',
          backgroundColor: bgColor,
          color: isDark ? '#fff' : '#000',
          minHeight: '100vh',
        }}
      >
        <TopNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className="container-fluid py-4">
          <Upper isDark={isDark} />

          <Middle isDark={isDark} />

          {/* Lower div reserved for future content */}
          <div className="pb-4" />
        </main>
      </div>
    </div>
  );
}
