'use client';

import React from 'react';

const PaymentHistory = ({
  isDark,
  invoice,
  cardStyle,
  headingStyle,

  // Existing payment input states
  showPaymentInput,
  showPaymentMode,
  addPaymentMode,
  setAddPaymentMode,
  customPaymentAmount,
  setCustomPaymentAmount,
  onMakePayment,
  onPayCustomAmount,

  // New for full payment
  showFullPaymentMode,
  setShowFullPaymentMode,
  fullPaymentMode,
  setFullPaymentMode,
  onConfirmFullPayment,

  // Delete handler
  onDeletePayment,
}) => {
  return (
    <div style={cardStyle}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={headingStyle}>Payment History</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-success" onClick={() => setShowFullPaymentMode(true)}>
            Make Full Payment
          </button>
          <button className="btn btn-sm btn-primary" onClick={onMakePayment}>
            Make Payment
          </button>
        </div>
      </div>

      {/* Full Payment Mode Selector + Confirm Button */}
      {showFullPaymentMode && (
        <div className="mb-3 d-flex gap-2 align-items-center">
          <select
            className="form-select form-select-sm"
            value={fullPaymentMode}
            onChange={(e) => setFullPaymentMode(e.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          <button className="btn btn-sm btn-success" onClick={onConfirmFullPayment}>
            Confirm Full Payment
          </button>
        </div>
      )}

      {/* Custom Payment Input */}
      {showPaymentInput && (
        <>
          {showPaymentMode && (
            <select
              className="form-select form-select-sm mb-2"
              value={addPaymentMode}
              onChange={(e) => setAddPaymentMode(e.target.value)}
              style={{ maxWidth: '150px' }}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          )}

          <div className="mb-3 d-flex gap-2 align-items-center">
            <input
              type="number"
              min="1"
              value={customPaymentAmount}
              onChange={(e) => setCustomPaymentAmount(e.target.value)}
              className="form-control form-control-sm"
              style={{ maxWidth: '150px' }}
              placeholder="Enter amount"
            />
            <button className="btn btn-sm btn-success" onClick={onPayCustomAmount}>
              Pay
            </button>
          </div>
        </>
      )}

      {/* Payment Table */}
      {invoice?.paymentHistory?.length ? (
        <div className="table-responsive">
          <table className={`table table-sm table-bordered text-center ${isDark ? 'table-dark' : ''}`}>
            <thead>
              <tr>
                <th className="text-nowrap">Amount (KWD)</th>
                <th className="text-nowrap">Date</th>
                <th className="text-nowrap">Mode</th>
                <th className="text-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoice.paymentHistory.map((p, i) => (
                <tr key={i}>
                  <td>{p.amount} KWD</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>{p.mode || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => onDeletePayment(i)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={isDark ? 'text-secondary' : 'text-muted'}>No payment history available.</p>
      )}
    </div>
  );
};

export default PaymentHistory;
