'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // default styles

export default function Middle({ isDark }) {
  const [date, setDate] = useState(new Date());
  const [deliveries, setDeliveries] = useState([]);
  const [deliveryCount, setDeliveryCount] = useState(0);

  // Normalize date to "YYYY-MM-DD" (strip time)
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  };

  // Fetch deliveries on mount
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await fetch('/api/getDeliveries');
        const data = await res.json();
        if (res.ok) {
          setDeliveries(data);
        } else {
          console.error('Error fetching deliveries:', data.message);
        }
      } catch (error) {
        console.error('Error fetching deliveries:', error.message);
      }
    };
    fetchDeliveries();
  }, []);

  // Update delivery count when date or deliveries change
  useEffect(() => {
    const selectedDateStr = normalizeDate(date);

    // Filter deliveries on selected date that are NOT delivered yet
    const deliveriesOnDate = deliveries.filter(
      (d) =>
        normalizeDate(new Date(d.deliveryDate)) === selectedDateStr &&
        d.deliveryStatus !== 'Delivered'
    );

    // Sum totalQuantity for filtered deliveries
    const total = deliveriesOnDate.reduce((acc, d) => acc + d.totalQuantity, 0);

    setDeliveryCount(total);
  }, [date, deliveries]);

  // Show delivery count inside each calendar tile (only for month view)
  const tileContent = ({ date: tileDate, view }) => {
    if (view === 'month') {
      const tileDateStr = normalizeDate(tileDate);

      // Filter deliveries for this tile date that are NOT delivered
      const deliveriesOnTileDate = deliveries.filter(
        (d) =>
          normalizeDate(new Date(d.deliveryDate)) === tileDateStr &&
          d.deliveryStatus !== 'Delivered'
      );

      if (deliveriesOnTileDate.length > 0) {
        const total = deliveriesOnTileDate.reduce((acc, d) => acc + d.totalQuantity, 0);

        if (total > 0) {
          return (
            <div
              style={{
                marginTop: 4,
                fontSize: '0.75rem',
                fontWeight: '600',
                color: isDark ? '#a0d911' : '#389e0d',
              }}
            >
              {total} deliveries
            </div>
          );
        }
      }
    }
    return null;
  };

  return (
    <div
      className={`shadow-sm rounded p-5`}
      style={{
        minHeight: '520px',
        backgroundColor: isDark ? '#1f1f1f' : '#fff',
        border: isDark ? '1px solid #333' : '1px solid #ccc',
      }}
    >
      <h5
        className={`mb-4 ${isDark ? 'text-light' : 'text-dark'}`}
        style={{ textAlign: 'center', fontWeight: '600', fontSize: '1.5rem' }}
      >
        Calendar
      </h5>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
        className={isDark ? 'react-calendar-dark' : 'react-calendar-light'}
      />

      <div
        style={{
          marginTop: 20,
          textAlign: 'center',
          fontWeight: '600',
          color: isDark ? '#ddd' : '#222',
        }}
      >
        {deliveryCount > 0
          ? `Deliveries scheduled for ${normalizeDate(date)}: ${deliveryCount}`
          : `No deliveries scheduled for ${normalizeDate(date)}`}
      </div>

      <style jsx global>{`
        /* Base calendar styles override */
        .react-calendar {
          width: 100%;
          max-width: 100%;
          background: ${isDark ? '#1f1f1f' : '#fff'};
          color: ${isDark ? '#ddd' : '#222'};
          border: none;
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.25em;
          border-radius: 10px;
          padding: 12px 16px;
        }

        /* Navigation (month/year header) */
        .react-calendar__navigation {
          display: flex;
          height: 48px;
          margin-bottom: 1.25em;
          background-color: ${isDark ? '#292929' : '#f8f9fa'};
          border-radius: 10px;
          align-items: center;
          justify-content: center;
          gap: 15px;
          font-size: 1.1rem;
          font-weight: 600;
          color: ${isDark ? '#ddd' : '#333'};
        }
        .react-calendar__navigation button {
          min-width: 48px;
          background: none;
          border: none;
          cursor: pointer;
          outline: none;
          color: inherit;
          font-weight: 600;
          font-size: 1.2rem;
          border-radius: 10px;
          transition: background-color 0.3s ease;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: ${isDark ? '#3c3c3c' : '#e6e6e6'};
        }

        /* Weekdays (Mon, Tue, etc.) */
        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.85em;
          color: ${isDark ? '#aaa' : '#666'};
          padding-bottom: 10px;
          border-bottom: 1.5px solid ${isDark ? '#333' : '#ddd'};
          margin-bottom: 12px;
        }

        /* Days grid */
        .react-calendar__month-view__days {
          text-align: center;
          margin-top: 12px;
          gap: 10px;
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
        }

        /* Individual days */
        .react-calendar__tile {
          max-width: 100%;
          padding: 18px 10px;
          background: none;
          text-align: center;
          line-height: 18px;
          border-radius: 12px;
          cursor: pointer;
          color: ${isDark ? '#ddd' : '#222'};
          transition: background-color 0.3s ease;
          font-size: 1.1rem;
          font-weight: 500;
          user-select: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .react-calendar__tile:disabled {
          color: ${isDark ? '#555' : '#ccc'};
          cursor: default;
        }
        .react-calendar__tile:hover:not(:disabled),
        .react-calendar__tile:focus {
          background-color: ${isDark ? '#3c3c3c' : '#e6e6e6'};
          outline: none;
        }

        /* Today */
        .react-calendar__tile--now {
          background: ${isDark ? '#264d73' : '#e6f0fa'};
          color: ${isDark ? '#d0e8ff' : '#0078d7'};
          font-weight: 700;
          border-radius: 12px;
        }

        /* Active (selected day) */
        .react-calendar__tile--active {
          background: ${isDark ? '#006edc' : '#006edc'};
          color: white;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
