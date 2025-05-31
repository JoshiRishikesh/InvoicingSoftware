'use client';

import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import Header from './parts/header';
import FormBody from './parts/body';
import ProductTable from './parts/ProductTable';
import PaymentHistory from './parts/PaymentHistory';

const ViewInvoiceBody = ({
  isSidebarOpen,
  isDesktop,
  invoice,
  setInvoice,
  onMarkDelivered,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [customPaymentAmount, setCustomPaymentAmount] = useState('');
  const [addPaymentMode, setAddPaymentMode] = useState('Cash');
  const [showPaymentMode, setShowPaymentMode] = useState(false);
  const [showFullPaymentMode, setShowFullPaymentMode] = useState(false);
  const [fullPaymentMode, setFullPaymentMode] = useState('Cash');

  const containerStyle = {
    backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa',
    color: isDark ? '#ffffff' : '#000000',
    borderRadius: '8px',
    padding: '1rem',
    transition: 'all 0.3s ease',
  };

  const cardStyle = {
    backgroundColor: isDark ? '#2c2c2c' : '#ffffff',
    color: isDark ? '#f1f1f1' : '#333333',
    border: isDark ? '1px solid #444' : '1px solid #dee2e6',
    borderRadius: '10px',
    boxShadow: isDark ? 'none' : '0 0 10px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  };

  const headingStyle = {
    color: isDark ? '#e0e0e0' : '#0d6efd',
    marginBottom: '1rem',
  };

  const labelStyle = {
    fontWeight: '600',
    minWidth: '160px',
  };

  const startEditing = (fieldKey, currentValue) => {
    setEditingField(fieldKey);
    setNewValue(currentValue || '');
  };

  const cancelEditing = () => {
    setEditingField(null);
    setNewValue('');
  };

  const saveEdit = async (fieldKey) => {
    if (newValue.trim() === '') {
      alert('Value cannot be empty.');
      return;
    }

    try {
      const res = await fetch(`/api/updateInvoice/${invoice._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldKey]: newValue }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Update failed: ' + (errorData.error || 'Unknown error'));
        return;
      }

      const updatedInvoice = await res.json();
      alert('Updated successfully!');
      setInvoice(updatedInvoice);
    } catch (error) {
      alert('Update error: ' + error.message);
    } finally {
      cancelEditing();
    }
  };

  const onDeletePayment = async (indexToDelete) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this payment?');
    if (!confirmDelete) return;

    try {
      const updatedPaymentHistory = [...invoice.paymentHistory];
      updatedPaymentHistory.splice(indexToDelete, 1);

      const res = await fetch(`/api/updateInvoice/${invoice._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentHistory: updatedPaymentHistory }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Failed to delete payment: ' + errorData.error);
        return;
      }

      const updatedInvoice = await res.json();
      setInvoice(updatedInvoice);
      alert('Payment deleted successfully');
    } catch (err) {
      alert('Error deleting payment: ' + err.message);
    }
  };

const onMakeFullPayment = async () => {
  const confirmFullPayment = window.confirm('Are you sure you want to make full payment?');
  if (!confirmFullPayment) return;

  const pendingAmount = invoice.pendingAmount;
  if (pendingAmount <= 0) {
    alert('No pending amount left to pay.');
    return;
  }

  setShowPaymentMode(true); // ✅ Show the dropdown before submitting

  try {
    const updatedPaymentHistory = [
      ...invoice.paymentHistory,
      {
        amount: pendingAmount,
        date: new Date().toISOString(),
        mode: fullPaymentMode, // 👈 this is selected by the user
      },
    ];

    const res = await fetch(`/api/updateInvoice/${invoice._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentHistory: updatedPaymentHistory }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert('Failed to make full payment: ' + errorData.error);
      return;
    }

    const updatedInvoice = await res.json();
    setInvoice(updatedInvoice);
    alert('Full payment made successfully!');
  } catch (err) {
    alert('Error making full payment: ' + err.message);
  }
};


    const onMakePayment = () => {
    const newState = !showPaymentInput;
    setShowPaymentInput(newState);
    setShowPaymentMode(newState);
    setCustomPaymentAmount('');
    setAddPaymentMode('Cash'); // 👈 reset the mode selector
    };
  const onPayCustomAmount = async () => {
    const amount = parseFloat(customPaymentAmount);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    if (amount > invoice.pendingAmount) {
      alert(`Amount exceeds pending balance of ${invoice.pendingAmount} KWD.`);
      return;
    }

    try {
      const updatedPaymentHistory = [
        ...invoice.paymentHistory,
        {
          amount,
          date: new Date().toISOString(),
          mode: addPaymentMode, // include mode here as well for consistency
        },
      ];

      const res = await fetch(`/api/updateInvoice/${invoice._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentHistory: updatedPaymentHistory }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Failed to record payment: ' + errorData.error);
        return;
      }

      const updatedInvoice = await res.json();
      setInvoice(updatedInvoice);
      setShowPaymentInput(false);
      setCustomPaymentAmount('');
      setAddPaymentMode('Cash');
      alert('Payment recorded successfully!');
    } catch (err) {
      alert('Error recording payment: ' + err.message);
    }
  };

  const renderEditableField = (label, value, fieldKey) => (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <div className="d-flex align-items-center">
        <span style={labelStyle}>{label}:</span>
        {editingField === fieldKey ? (
          fieldKey === 'deliveryStatus' ? (
            <select
              className="form-select form-select-sm ms-2"
              style={{ maxWidth: '200px' }}
              value={newValue}
              autoFocus
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit(fieldKey);
                if (e.key === 'Escape') cancelEditing();
              }}
            >
              <option value="Due">Due</option>
              <option value="Delivered">Delivered</option>
            </select>
          ) : (
            <input
              className="form-control form-control-sm ms-2"
              style={{ maxWidth: '200px' }}
              value={newValue}
              autoFocus
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit(fieldKey);
                if (e.key === 'Escape') cancelEditing();
              }}
            />
          )
        ) : (
          <span className="ms-2">{value || '-'}</span>
        )}
      </div>
      <div className="d-flex align-items-center">
        {editingField === fieldKey ? (
          <>
            <button className="btn btn-sm btn-success me-2" onClick={() => saveEdit(fieldKey)}>
              Save
            </button>
            <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>
              Cancel
            </button>
          </>
        ) : (
          <button
            className={`btn btn-sm btn-outline-${isDark ? 'light' : 'primary'}`}
            onClick={() => startEditing(fieldKey, value)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );

  const renderStaticField = (label, value) => (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <span style={labelStyle}>{label}:</span>
      <span>{value || '-'}</span>
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Header */}
      <Header invoice={invoice} onMarkDelivered={onMarkDelivered} cardStyle={cardStyle} headingStyle={headingStyle} />

      {/* Invoice & Customer Details / Payment & Delivery */}
      <FormBody
        invoice={invoice}
        renderEditableField={renderEditableField}
        renderStaticField={renderStaticField}
        cardStyle={cardStyle}
        headingStyle={headingStyle}
      />

      {/* Product Table */}
      <ProductTable invoice={invoice} cardStyle={cardStyle} headingStyle={headingStyle} isDark={isDark} />

      {/* Payment History */}
        <PaymentHistory
        isDark={isDark}
        invoice={invoice}
        cardStyle={cardStyle}
        headingStyle={headingStyle}

        showPaymentInput={showPaymentInput}
        showPaymentMode={showPaymentMode}
        addPaymentMode={addPaymentMode}
        setAddPaymentMode={setAddPaymentMode}
        customPaymentAmount={customPaymentAmount}
        setCustomPaymentAmount={setCustomPaymentAmount}
        onMakePayment={onMakePayment}
        onPayCustomAmount={onPayCustomAmount}

        showFullPaymentMode={showFullPaymentMode}
        setShowFullPaymentMode={setShowFullPaymentMode}
        fullPaymentMode={fullPaymentMode}
        setFullPaymentMode={setFullPaymentMode}
        onConfirmFullPayment={onMakeFullPayment} // ✅ THIS LINE — fix the prop
        onDeletePayment={onDeletePayment}
        />

    </div>
  );
};

export default ViewInvoiceBody;
