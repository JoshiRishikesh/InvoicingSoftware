'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Navbar/Sidebar';
import TopNavbar from '../../components/Navbar/TopNavbar';
import { useTheme } from '../../context/ThemeContext';
import AllInvoiceTable from '../../components/Table/allInvoice';

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

  // ✅ Updated Filter Logic
  const filteredInvoices = invoices.filter((inv) => {
    const matchesContact = inv.contactNumber
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const isPending = inv.pendingAmount > 0;
    const computedStatus = isPending ? 'Pending' : 'Cleared';

    const matchesStatus =
      selectedStatus === '' || selectedStatus === computedStatus;

    return matchesContact && matchesStatus;
  });

  return (
    <div className="d-flex">
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
          {/* Heading */}
          <h3 className={`mb-4 fw-bold ${textColor} text-center text-md-start`}>
            All Invoices
          </h3>

          {/* Filter Bar */}
          <div
            className={`mb-4 p-3 rounded shadow-sm ${isDark ? 'bg-dark text-light' : 'bg-white'}`}
            style={{ border: isDark ? '1px solid #333' : '1px solid #ccc' }}
          >
            <div className="row gy-2 gx-2 align-items-center">
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className={`form-control ${isDark ? 'bg-dark text-light border-secondary input-dark' : 'input-light'}`}
                  placeholder="Search by Contact Number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-6 col-md-3">
                <select
                  className={`form-select ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Cleared">Cleared</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <AllInvoiceTable 
          invoices={filteredInvoices} 
          loading={loading} 
          isDark={isDark} 
          onDelete={(deletedId) =>
            setInvoices((prev) => prev.filter((inv) => inv._id !== deletedId))
            }
            />
        </main>
      </div>

      <style jsx>{`
        @media (max-width: 767.98px) {
          .table-sm-font td,
          .table-sm-font th {
            font-size: 0.75rem;
          }

          .btn-sm-mobile {
            font-size: 0.75rem !important;
            padding: 0.25rem 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
