// app/components/Form/NewInvoice/newInvoice.js

'use client';
import React, { useState } from 'react';
import Header from './Parts/Header';
import Table from './Parts/Table';
import Mid from './Parts/Mid';
import Footer from './Parts/Footer';
import PrintPreview from './Parts/print-preview';


export default function NewInvoice() {
  const [invoiceSubmitted, setInvoiceSubmitted] = useState(false);
  const containerBg = '#f9f9fb';
  const containerTextColor = '#333';

  const [headerData, setHeaderData] = useState({
    invoiceNumber: '',
    customerName: '',
    phone: '',
    date: '',
  });

  const [products, setProducts] = useState([
    { name: '', quantity: 1, rate: 0, amount: 0 },
  ]);

  const [midData, setMidData] = useState({
    discount: 0,
    advance: 0,
    paymentMode: '',
    deliveryDate: '',
    address: '',
  });

  const total = products.reduce(
    (sum, product) => sum + product.quantity * product.rate,
    0
  );
  const discount = Number(midData.discount);
  const advance = Number(midData.advance);
  const final = total - discount;
  const pending = final - advance;

  const handleHeaderChange = (e) => {
    setHeaderData({ ...headerData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = field === 'name' ? value : Number(value);
    newProducts[index].amount =
      newProducts[index].quantity * newProducts[index].rate;
    setProducts(newProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { name: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleMidChange = (e) => {
    setMidData({ ...midData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    invoiceNumber: headerData.invoiceNumber,
    invoiceDate: headerData.invoiceDate,
    clientName: headerData.clientName,
    contactNumber: headerData.contactNumber,
    address: midData.address,
    referenceNumber: headerData.referenceNumber,
    serialNumber: headerData.serialNumber,
    discount: discount,
    advanceAmount: advance,
    paymentMode: midData.paymentMode,
    deliveryDate: midData.deliveryDate,
    deliveryStatus: 'Due',
  };

  const formattedProducts = products.map((product) => ({
    name: product.name,
    quantity: product.quantity,
    price: product.rate,
    total: product.amount,
  }));

  const payload = {
    formData,
    products: formattedProducts,
    totalAmount: total,
    finalAmount: final,
    pendingAmount: pending,
  };

  try {
    const response = await fetch('/api/newInvoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      alert('✅ Invoice submitted successfully!');
      return true; // ✅ Submission success
    } else {
      alert(`❌ Failed to submit invoice: ${result.message}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Submit Error:', error);
    alert('❌ An error occurred while submitting the invoice.');
    return false;
  }
};


  const handleCheckDeliveryDate = () => {
    if (midData.deliveryDate) {
      alert(`Delivery Date is set to: ${midData.deliveryDate}`);
    } else {
      alert('Please select a delivery date first.');
    }
  };

  const [showPreview, setShowPreview] = useState(false);


  const resetInvoiceForm = () => {
  setHeaderData({
    invoiceNumber: '',
    clientName: '',
    contactNumber: '',
    referenceNumber: '',
    invoiceDate: '',
    serialNumber: '',
  });

  setProducts([{ name: '', quantity: 1, rate: 0, amount: 0 }]);

  setMidData({
    discount: 0,
    advance: 0,
    paymentMode: '',
    deliveryDate: '',
    address: '',
  });

  setInvoiceSubmitted(false); // Reset flag too
};


  return (
    <div className="container my-5">
      <div
        className="card border-0 shadow-lg"
        style={{
          backgroundColor: containerBg,
          color: containerTextColor,
          borderRadius: '1rem',
        }}
      >
        <div className="card-body p-4 p-md-5">
          <h2 className="mb-4 fw-bold text-primary border-bottom pb-2">
            <i className="bi bi-receipt-cutoff me-2"></i> Create New Invoice
          </h2>

          <form onSubmit={handleSubmit}>
            <section className="mb-5">
              <h5 className="mb-3 text-secondary">🧾 Invoice Details</h5>
              <Header headerData={headerData} onChange={handleHeaderChange} />
            </section>

            <section className="mb-5">
              <h5 className="mb-3 text-secondary">📦 Product List</h5>
              <Table
                products={products}
                onChangeProduct={handleProductChange}
                onAddRow={handleAddProduct}
                onRemoveRow={handleRemoveProduct}
              />
            </section>

            <section className="mb-5">
              <h5 className="mb-3 text-secondary">📋 Payment & Delivery</h5>
              <Mid
                midData={midData}
                onChange={handleMidChange}
                onCheckDeliveryDate={handleCheckDeliveryDate}
                isDark={true} // or false
              />
            </section>

            <section>
              <Footer summary={{ total, discount, final, advance, pending }} />
              <div className="mt-4 d-flex justify-content-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline-primary px-4"
                  onClick={() => setShowPreview(true)}
                >
                  Preview Invoice
                </button>
              </div>
            </section>
          </form>
            {showPreview && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-light overflow-auto p-4"
                style={{ zIndex: 1050 }}
              >
                <div className="bg-white shadow rounded p-4 mx-auto" style={{ maxWidth: '900px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Invoice Preview</h4>
{invoiceSubmitted ? (
  <button
    className="btn btn-outline-primary btn-sm"
    onClick={() => {
      resetInvoiceForm();
      setShowPreview(false);
    }}
  >
    New Invoice
  </button>
) : (
  <button
    className="btn btn-outline-danger btn-sm"
    onClick={() => setShowPreview(false)}
  >
    Close
  </button>
)}

                  </div>
                  <PrintPreview
                    headerData={headerData}
                    products={products}
                    midData={midData}
                    summary={{ total, discount, advance, final, pending }}
                  />
{/* ✅ Show Submit Button only if invoice is NOT submitted */}
{!invoiceSubmitted && (
  <div className="mt-4 text-end">
    <button
      className="btn btn-success px-4"
      onClick={async (e) => {
        const success = await handleSubmit(e);
        if (success) {
          setInvoiceSubmitted(true);
        }
      }}
    >
      Submit Invoice
    </button>
  </div>
)}
                </div>
              </div>
            )}


        </div>
      </div>
    </div>
  );
}
