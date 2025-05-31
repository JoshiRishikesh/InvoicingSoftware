'use client';

import { useState, useEffect } from 'react';

export default function Cards({ isDark }) {
  const lightBgClasses = [
    'bg-primary',
    'bg-success',
    'bg-info',
    'bg-warning',
    'bg-danger',
    'bg-secondary',
  ];

  const lightTextColors = [
    'text-white',
    'text-white',
    'text-dark',
    'text-dark',
    'text-white',
    'text-white',
  ];

  const darkBgColors = [
    '#0d6efd',
    '#198754',
    '#0dcaf0',
    '#ffc107',
    '#dc3545',
    '#6c757d',
  ];

  const headings = [
    { title: 'Total Orders', desc: 'Till Date', key: 'totalOrders', type: 'int' },
    { title: "Today's Deliveries", desc: 'Pending', key: 'todaysDeliveries', type: 'int' },
    { title: 'Upcoming Deliveries', desc: 'Next 7 Days', key: 'upcomingDeliveries', type: 'int' },
    { title: 'Total Sales', desc: 'In KWD', key: 'totalSales', type: 'currency' },
    { title: "Today's Revenue", desc: 'In KWD', key: 'todaysRevenue', type: 'currency' },
    { title: 'Total Refunds', desc: 'In KWD', key: 'totalRefunds', type: 'currency' },
  ];

  const [data, setData] = useState({
    totalOrders: null,
    todaysDeliveries: null,
    upcomingDeliveries: null,
    totalSales: null,
    todaysRevenue: null,
    totalRefunds: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/dashboard/cards');
        if (!res.ok) throw new Error('Failed to fetch dashboard cards');
        const json = await res.json();

        setData({
          totalOrders: json.totalOrders ?? 0,
          todaysDeliveries: json.todaysDeliveries ?? 0,
          upcomingDeliveries: json.upcomingDeliveries ?? 0,
          totalSales: json.totalSales ?? 0,
          todaysRevenue: json.todaysRevenue ?? 0,
          totalRefunds: 0, // Placeholder until implemented in API
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setData({
          totalOrders: 0,
          todaysDeliveries: 0,
          upcomingDeliveries: 0,
          totalSales: 0,
          todaysRevenue: 0,
          totalRefunds: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-KW', {
      style: 'currency',
      currency: 'KWD',
    }).format(val);
  };

  return (
    <div className="row g-3">
      {headings.map(({ title, desc, key, type }, index) => {
        const textClass = isDark ? 'text-white' : lightTextColors[index];
        const bgClass = isDark ? '' : lightBgClasses[index];
        const bgColor = isDark ? darkBgColors[index] : '';

        let displayValue = loading
          ? 'Loading...'
          : data[key] != null
          ? type === 'currency'
            ? formatCurrency(data[key])
            : data[key]
          : '—';

        return (
          <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-2">
            <div
              className={`card shadow-sm rounded-3 ${bgClass} ${textClass} py-3 min-vh-25`}
              style={{
                backgroundColor: bgColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'transform 0.15s ease-in-out',
                cursor: 'default',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="card-body text-center d-flex flex-column justify-content-center p-2">
                <h5
                  className="fw-bold mb-1"
                  style={{
                    fontSize: '1rem',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    userSelect: 'none',
                  }}
                >
                  {title}
                </h5>
                <small
                  className="d-block mb-2"
                  style={{
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                    userSelect: 'none',
                  }}
                >
                  ({desc})
                </small>
                <div
                  className="fs-5 fw-semibold"
                  style={{
                    userSelect: 'none',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  {displayValue}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
