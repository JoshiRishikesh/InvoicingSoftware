import React from 'react';

export default function FormBody({
  invoice,
  renderEditableField,
  renderStaticField,
  cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#fff',
  },
  headingStyle = {
    marginBottom: '1rem',
  },
}) {
  const cardClass = "p-3 h-100 shadow-sm"; // equal height, padding, and light shadow
  const rowGap = "gy-3"; // vertical spacing on mobile screens

  return (
    <div className="container-fluid px-0">
      {/* Invoice & Customer Details */}
      <div className={`row ${rowGap} mb-3`}>
        <div className="col-12 col-md-6">
          <div style={cardStyle} className={cardClass}>
            <h4 style={headingStyle}>Invoice Details</h4>
            {renderEditableField('Invoice Number', invoice?.invoiceNumber, 'invoiceNumber')}
            {renderEditableField('Invoice Date', invoice?.invoiceDate, 'invoiceDate')}
            {renderEditableField('Reference Number', invoice?.referenceNumber, 'referenceNumber')}
            {renderEditableField('Serial Number', invoice?.serialNumber, 'serialNumber')}
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div style={cardStyle} className={cardClass}>
            <h4 style={headingStyle}>Customer Details</h4>
            {renderEditableField('Client Name', invoice?.clientName, 'clientName')}
            {renderEditableField('Contact Number', invoice?.contactNumber, 'contactNumber')}
            {renderEditableField('Address', invoice?.address, 'address')}
          </div>
        </div>
      </div>

      {/* Payment & Delivery Details */}
      <div className={`row ${rowGap} mb-3`}>
        <div className="col-12 col-md-6">
          <div style={cardStyle} className={cardClass}>
            <h4 style={headingStyle}>Payment Details</h4>
            <div className="d-flex flex-column">
              {renderStaticField('Total Amount', invoice?.totalAmount + ' KWD')}
              {renderStaticField('Discount', invoice?.discount + ' KWD')}
              {renderStaticField('Final Amount', invoice?.finalAmount + ' KWD')}
              {renderStaticField('Advance Amount', invoice?.advanceAmount + ' KWD')}
              {renderStaticField('Pending Amount', invoice?.pendingAmount + ' KWD')}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div style={cardStyle} className={cardClass}>
            <h4 style={headingStyle}>Delivery Details</h4>
            {renderEditableField('Delivery Date', invoice?.deliveryDate, 'deliveryDate')}
            {renderEditableField('Delivery Status', invoice?.deliveryStatus, 'deliveryStatus')}
          </div>
        </div>
      </div>
    </div>
  );
}
