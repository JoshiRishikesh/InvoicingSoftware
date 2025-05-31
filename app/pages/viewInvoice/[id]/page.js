'use client';

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import Sidebar from '../../../components/Navbar/Sidebar';
import TopNavbar from '../../../components/Navbar/TopNavbar';
import ViewInvoiceBody from '../../../components/Form/ViewInvoice/page';
import { useTheme } from '../../../context/ThemeContext';

export default function ViewInvoicePage({ params: asyncParams }) {
  const { id } = use(asyncParams);
  const { theme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle responsive sidebar
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

  // Fetch invoice
  useEffect(() => {
    if (!id) return;
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/getInvoice/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Invoice not found');
        }
        const data = await res.json();
        setInvoice(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const isDark = theme === 'dark';


const onMarkDelivered = async () => {
  if (!invoice?._id) return;

  const confirmed = window.confirm('Are you sure you want to mark this invoice as Delivered?');

  if (!confirmed) return;

  try {
    const res = await fetch(`/api/updateInvoice/${invoice._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deliveryStatus: 'Delivered' }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert('Failed to mark as delivered: ' + (errorData.message || 'Unknown error'));
      return;
    }

    const updatedInvoice = await res.json();
    setInvoice(updatedInvoice);
    alert('Marked as Delivered!');
  } catch (error) {
    alert('Error updating invoice: ' + error.message);
  }
};


  

  return (
    <div className={`d-flex ${isDark ? 'bg-black text-white' : 'bg-white text-dark'}`}>
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

        <main className={`p-4 ${isDark ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
          {loading && <div className="text-center">Loading...</div>}

          {error && <div className="text-danger text-center">Error: {error}</div>}

          {!loading && !error && invoice && (
            <div className="container">
              {/* Premium-Styled Heading */}
              <div className="mb-4 text-center">
                <h1 className={`display-5 fw-bold border-bottom pb-2 ${isDark ? 'text-info' : 'text-primary'}`}>
                  {invoice.serialNumber || 'Serial Number'}
                </h1>
              </div>

              {/* Body Component */}
              <ViewInvoiceBody
                invoice={invoice}
                isSidebarOpen={isSidebarOpen}
                isDesktop={isDesktop}
                theme={theme}
                onMarkDelivered={onMarkDelivered}
                setInvoice={setInvoice}
              />
            </div>
          )}

          {!loading && !error && !invoice && (
            <div className="text-center">Invoice not found</div>
          )}
        </main>
      </div>
    </div>
  );
}
