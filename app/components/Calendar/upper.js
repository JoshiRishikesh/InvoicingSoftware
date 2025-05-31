'use client';

import React, { useState, useEffect } from 'react';

export default function Upper({ isDark }) {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    upcoming: 0,
  });

  // Normalize date to "YYYY-MM-DD"
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await fetch('/api/getDeliveries');
        const data = await res.json();

        if (res.ok) {
          const today = new Date();
          const todayStr = normalizeDate(today);

          const upcomingLimit = new Date(today);
          upcomingLimit.setDate(upcomingLimit.getDate() + 3);
          normalizeDate(upcomingLimit);

          let total = 0;
          let todayCount = 0;
          let pendingCount = 0;
          let upcomingCount = 0;

          data.forEach((d) => {
            const deliveryDate = new Date(d.deliveryDate);
            const deliveryDateStr = normalizeDate(deliveryDate);
            const qty = d.totalQuantity || 0;

            total += qty;

            const isDelivered = d.deliveryStatus === 'Delivered';

            if (deliveryDateStr === todayStr) {
              todayCount += qty;
            }

            if (deliveryDate < today && !isDelivered) {
              pendingCount += qty;
            }

            if (deliveryDate >= today && deliveryDate <= upcomingLimit && !isDelivered) {
              upcomingCount += qty;
            }
          });

          setStats({
            total,
            today: todayCount,
            pending: pendingCount,
            upcoming: upcomingCount,
          });
        } else {
          console.error('Error fetching deliveries:', data.message);
        }
      } catch (error) {
        console.error('Error fetching deliveries:', error.message);
      }
    };

    fetchDeliveries();
  }, []);

  const cardData = [
    { title: 'Total Deliveries', value: stats.total, bg: 'bg-primary', text: 'text-white' },
    { title: "Today's Deliveries", value: stats.today, bg: 'bg-danger', text: 'text-white' },
    { title: 'Pending Deliveries', value: stats.pending, bg: 'bg-info', text: isDark ? 'text-white' : 'text-dark' },
    { title: 'Upcoming (3 Days)', value: stats.upcoming, bg: 'bg-warning', text: isDark ? 'text-dark' : 'text-dark' },
  ];

  return (
    <>
      <div className="row g-3 mb-4">
        {cardData.map((item, idx) => (
          <div className="col-3" key={idx}>
            <div
              className={`card ${item.bg} ${item.text} text-center shadow rounded card-responsive`}
            >
              <div className="py-3 d-flex flex-column justify-content-center align-items-center">
                <div className="fw-semibold card-title-responsive">
                  {item.title}
                </div>
                <div className="fw-bold mt-1 card-number-responsive">
                  {item.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .card-responsive {
            min-height: 80px;
            padding: 10px;
          }
          .card-title-responsive {
            font-size: 0.7rem;
          }
          .card-number-responsive {
            font-size: 1.2rem;
          }
        }

        .card-responsive {
          min-height: 90px;
        }

        .card-title-responsive {
          font-size: 0.95rem;
        }

        .card-number-responsive {
          font-size: 1.6rem;
        }
      `}</style>
    </>
  );
}
