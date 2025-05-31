'use client';

import React from 'react';

const ProductTable = ({ invoice, cardStyle, headingStyle, isDark }) => {
  return (
    <div style={cardStyle}>
      <h4 style={headingStyle}>Product Details</h4>
      {invoice?.products?.length ? (
        <div className="table-responsive">
          <table className={`table table-sm table-bordered text-center ${isDark ? 'table-dark' : ''}`}>
            <thead>
              <tr>
                <th className="text-nowrap">Name</th>
                <th className="text-nowrap">Quantity</th>
                <th className="text-nowrap">Price (KWD)</th>
                <th className="text-nowrap">Total (KWD)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.products.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>{p.quantity}</td>
                  <td>{p.price} KWD</td>
                  <td>{p.total} KWD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No products added.</p>
      )}
    </div>
  );
};

export default ProductTable;
