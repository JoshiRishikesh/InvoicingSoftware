'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Navbar/Sidebar';
import TopNavbar from '../../components/Navbar/TopNavbar';
import { useTheme } from '../../context/ThemeContext';
import DeliveryTable from '../../components/Table/delivery'; // ✅ Import your table

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

   const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(''); // '' means all
  


  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch('/api/allInvoices');
        if (!res.ok) throw new Error('Failed to fetch invoices');
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);






  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const bgColor = isDark ? '#121212' : '#f8f9fa';
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

        <main className={`p-4 ${textColor}`}>
          <div className="container">
            {/* Heading Section */}
            <div className="heading-div mb-3 d-flex align-items-center justify-content-between flex-wrap">
              <h1 className={`mb-2 mb-md-0 ${textColor}`}>Delivery Status</h1>


              <select
                  className={`form-select w-auto ${isDark ? 'bg-dark text-light border-secondary' : 'bg-white text-dark border'}`}
                  style={{ minWidth: '120px' }}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                <option value="">All</option>
                <option value="Due">Due</option>
                <option value="Due Today">Due Today</option>
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                </select>


              
            </div>

            {/* Body Section with Table */}
            <div className="body-div">
              <DeliveryTable 
              isDark={isDark}
              invoices={invoices}
              loading={loading}
              setInvoices={setInvoices}
              selectedStatus={selectedStatus}
              
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
