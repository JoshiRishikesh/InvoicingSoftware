'use client';

import React from 'react';

const Header = ({ invoice, onMarkDelivered, cardStyle, headingStyle }) => {
  return (
    <div style={cardStyle} className="d-flex justify-content-between align-items-center">
      <h3 style={headingStyle}>{invoice?.clientName || 'Client Name'}</h3>
      <button
        className="btn btn-sm btn-success"
        onClick={onMarkDelivered}
        disabled={invoice?.deliveryStatus === 'Delivered'}
      >
        {invoice?.deliveryStatus === 'Delivered' ? 'Delivered' : 'Mark as Delivered'}
      </button>
    </div>
  );
};

export default Header;
