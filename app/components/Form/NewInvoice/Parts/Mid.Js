'use client';
import { useState } from 'react';
import Middle from '../../../Calendar/middle';
import { useTheme } from '../../../../context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Mid({ midData, onChange, onCheckDeliveryDate }) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  function handleNumericInput(value) {
    let cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    return cleaned;
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    if (name === 'discount' || name === 'advance') {
      onChange({ target: { name, value: handleNumericInput(value) } });
    } else {
      onChange(e);
    }
  }

  return (
    <>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Discount (KWD)</label>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            className="form-control"
            name="discount"
            value={midData.discount}
            onChange={handleInputChange}
            placeholder="0.00"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Advance Paid (KWD)</label>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            className="form-control"
            name="advance"
            value={midData.advance}
            onChange={handleInputChange}
            placeholder="0.00"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Payment Mode</label>
          <select
            className="form-select"
            name="paymentMode"
            value={midData.paymentMode}
            onChange={onChange}
          >
            <option value="">Select</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bankTransfer">Bank Transfer</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Delivery Date</label>
          <input
            type="date"
            className="form-control mb-2"
            name="deliveryDate"
            value={midData.deliveryDate}
            onChange={onChange}
          />
          <button
            type="button"
            className="btn btn-outline-primary w-100"
            onClick={() => setShowCalendarModal(true)}
          >
            Check Delivery Date
          </button>
        </div>

        <div className="col-md-6">
          <label className="form-label">Delivery Address</label>
          <textarea
            rows="2"
            className="form-control"
            name="address"
            placeholder="Complete address here"
            value={midData.address}
            onChange={onChange}
          ></textarea>
        </div>
      </div>

      {/* Delivery Calendar Modal */}
      {showCalendarModal && (
        <div
          className="modal fade show"
          style={{
            display: 'block',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              maxWidth: '95%',
              margin: 'auto',
            }}
          >
            <div
              className={`modal-content ${isDark ? 'bg-dark text-light' : 'bg-white text-dark'}`}
              style={{
                borderRadius: '10px',
                fontSize: '0.85rem',
                padding: '0.5rem',
                maxHeight: '85vh',
                overflowY: 'auto',
              }}
            >
              <div className="modal-header p-2">
                <h6 className="modal-title">Delivery Calendar</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCalendarModal(false)}
                ></button>
              </div>
              <div className="modal-body p-2">
                <Middle isDark={isDark} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
