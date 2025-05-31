'use client';
import { useEffect } from 'react';

export default function Header({ headerData, onChange }) {
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const hh = String(today.getHours()).padStart(2, '0');
    const min = String(today.getMinutes()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const invoiceNumber = `INV-${yyyy}${mm}${dd}-${hh}${min}`;

    if (!headerData.invoiceNumber) {
      onChange({
        target: {
          name: 'invoiceNumber',
          value: invoiceNumber,
        },
      });
    }

    if (!headerData.invoiceDate) {
      onChange({
        target: {
          name: 'invoiceDate',
          value: formattedDate,
        },
      });
    }
  }, [headerData.invoiceNumber, headerData.invoiceDate, onChange]);

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label">Invoice Number</label>
        <input
          type="text"
          className="form-control"
          name="invoiceNumber"
          value={headerData.invoiceNumber || ''}
          readOnly
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Customer Name</label>
        <input
          type="text"
          className="form-control"
          name="clientName"
          placeholder="e.g., Ramesh Singh"
          value={headerData.clientName || ''}
          onChange={onChange}
          required
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          className="form-control"
          name="contactNumber"
          placeholder="Enter a 10-digit phone number without country code"
          value={headerData.contactNumber || ''}
          onChange={onChange}
          required
          pattern="[0-9]{10}"
          title="Enter a 10-digit phone number without country code"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Reference Number</label>
        <input
          type="text"
          className="form-control"
          name="referenceNumber"
          placeholder="Optional reference number"
          value={headerData.referenceNumber || ''}
          onChange={onChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Date</label>
        <input
          type="date"
          className="form-control"
          name="invoiceDate"
          value={headerData.invoiceDate || ''}
          readOnly
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Serial Number</label>
        <input
          type="text"
          className="form-control"
          name="serialNumber"
          placeholder="serial number"
          value={headerData.serialNumber || ''}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
