'use client';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

export default function PrintPreview({ headerData, products, midData, summary }) {
  const handleDownloadPDF = async () => {
    const { InvoicePDF } = await import('./invoice');
    const blob = await pdf(
      <InvoicePDF
        headerData={headerData}
        products={products}
        midData={midData}
        summary={summary}
      />
    ).toBlob();

    saveAs(blob, `Invoice_${headerData.invoiceNumber || 'Print'}.pdf`);
  };

const handleSendInvoice = async () => {
  const { InvoicePDF } = await import('./invoice');
  const pdfBlob = await pdf(
    <InvoicePDF
      headerData={headerData}
      products={products}
      midData={midData}
      summary={summary}
    />
  ).toBlob();

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${yyyy}${mm}${dd}`;

  const clientName = headerData.clientName || 'Client';
  const fileName = `Invoice_${clientName}_${formattedDate}.pdf`;

  const formData = new FormData();
  formData.append('file', new File([pdfBlob], fileName, { type: 'application/pdf' }));
  formData.append('upload_preset', 'invoice_upload');
  formData.append('public_id', `invoices/${fileName.replace('.pdf', '')}`);

  const cloudRes = await fetch('https://api.cloudinary.com/v1_1/dcgp1fm83/raw/upload', {
    method: 'POST',
    body: formData,
  });

  const cloudData = await cloudRes.json();

  if (!cloudRes.ok) {
    console.error('Cloudinary upload failed', cloudData);
    alert('Error uploading PDF to Cloudinary.');
    return;
  }

  const fileUrl = cloudData.secure_url;

  const response = await fetch('/api/send-whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: `91${headerData.contactNumber}`,
      clientName,
      fileUrl,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    alert('Failed to send WhatsApp message: ' + (data.message || 'Unknown error'));
  } else {
    alert('Invoice sent via WhatsApp!');
  }
};



  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
        <h3 className="fw-bold text-primary m-0">Print Preview</h3>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={handleSendInvoice}>
            Send Invoice
          </button>
          <button className="btn btn-outline-primary" onClick={handleDownloadPDF}>
            Download Invoice
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div id="printableArea" className="bg-white p-4 border rounded shadow-sm">
        <div className="row mb-3 align-items-center">
          <div className="col-4">
            <img src="/logo.png" alt="Logo" style={{ maxWidth: '90px', maxHeight: '70px' }} />
          </div>
          <div className="col-8 text-end" style={{ direction: 'rtl' }}>
            <h5 className="fw-bold mb-1">خياط زهرة الفردوس</h5>
            <small className="d-block">مكان خاص للدشداشة</small>
            <small className="d-block">احدث انواع الاقمشة والخياطة الرجالية والجاهزة</small>
            <small className="d-block">
              الفحيحيل - شارع مكة - بناية قيس الغانم - الطابق الأرضي محل رقم ٦٢
            </small>
            <small className="d-block">رقم تيلفون :- 66396881 / 51235130</small>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-6">
            <h6 className="fw-bold text-secondary mb-2">تفاصيل العميل</h6>
            <small>
              <strong>Name:</strong> {headerData.clientName}
            </small>
            <br />
            <small>
              <strong>Phone:</strong> {headerData.contactNumber}
            </small>
            <br />
            {midData.address && (
              <small>
                <strong>Address:</strong> {midData.address}
              </small>
            )}
            <hr className="my-2" />
            <h6 className="fw-bold text-secondary mb-2">تفاصيل الفاتورة</h6>
            {headerData.referenceNumber && (
              <small>
                <strong>Reference:</strong> {headerData.referenceNumber}
              </small>
            )}
            <br />
            {headerData.serialNumber && (
              <small>
                <strong>Serial No:</strong> {headerData.serialNumber}
              </small>
            )}
            <br />
            {midData.paymentMode && (
              <small>
                <strong>Payment Mode:</strong> {midData.paymentMode}
              </small>
            )}
          </div>

          <div className="col-6 text-end">
            <h6 className="fw-bold text-secondary mb-2">الفاتورة</h6>
            <small>
              <strong>Invoice No:</strong> {headerData.invoiceNumber}
            </small>
            <br />
            <small>
              <strong>Date:</strong> {headerData.invoiceDate}
            </small>
            <br />
            <small>
              <strong>Delivery:</strong> {midData.deliveryDate}
            </small>
          </div>
        </div>

        <div className="table-responsive mb-3">
          <table className="table table-bordered table-sm text-center align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th>Product</th>
                <th style={{ width: '10%' }}>Qty</th>
                <th style={{ width: '15%' }}>Rate (KWD)</th>
                <th style={{ width: '15%' }}>Amount (KWD)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td className="text-start">{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{parseFloat(item.rate).toFixed(2)}</td>
                  <td>{parseFloat(item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-start">
            <div className="p-2">
              <img src="/stamp.png" alt="Stamp" style={{ width: '100px', opacity: 0.7 }} />
            </div>
            <div className="p-2" style={{ width: '60%' }}>
              <table className="table table-sm border">
                <tbody>
                  <tr>
                    <td>
                      <strong>Subtotal</strong>
                    </td>
                    <td className="text-end">KWD{summary.total.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Discount</strong>
                    </td>
                    <td className="text-end text-success">- KWD{summary.discount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Advance Paid</strong>
                    </td>
                    <td className="text-end">KWD{summary.advance.toFixed(2)}</td>
                  </tr>
                  <tr className="table-light border-top">
                    <td>
                      <strong>Total Payable</strong>
                    </td>
                    <td className="text-end fw-bold">KWD{summary.final.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Pending</strong>
                    </td>
                    <td className="text-end text-danger fw-bold">KWD{summary.pending.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="text-center mt-3">
          <hr />
          <small className="fw-semibold text-muted">Thank you for your business!</small>
        </div>
      </div>
    </div>
  );
}
