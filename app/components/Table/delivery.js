'use client';

import { useState } from 'react';

export default function DeliveryTable({ isDark, invoices, loading, setInvoices, selectedStatus }) {
  const [editingRowId, setEditingRowId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

    const handleStatusSave = async (id) => {
        const confirmUpdate = window.confirm(`Are you sure you want to change the delivery status to "${updatedStatus}"?`);
        if (!confirmUpdate) return;

        try {
            const res = await fetch(`/api/updateInvoice/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deliveryStatus: updatedStatus }),
            });

            if (!res.ok) {
            throw new Error('Failed to update delivery status');
            }

            const updated = await res.json();

            // Update the invoice in state
            setInvoices((prev) =>
            prev.map((inv) => (inv._id === id ? { ...inv, deliveryStatus: updated.deliveryStatus } : inv))
            );

            setEditingRowId(null);
            setUpdatedStatus('');
            alert('Delivery status updated successfully');
        } catch (err) {
            console.error(err);
            alert('Error updating delivery status');
        }
    };

    function getDeliveryStatus(inv) {
        if (inv.deliveryStatus === 'Delivered') return 'Delivered';

        const today = new Date();
        const delDate = new Date(inv.deliveryDate);
        today.setHours(0, 0, 0, 0);
        delDate.setHours(0, 0, 0, 0);

        if (delDate < today) return 'Due';
        if (delDate.getTime() === today.getTime()) return 'Due Today';
        return 'Pending';
    };

    // ✅ Filter based on selected status
  const filteredInvoices = invoices.filter((inv) => {
    const status = getDeliveryStatus(inv);
    return selectedStatus === '' || selectedStatus === status;
  });
    



  return (
    <div
      className={`p-3 rounded shadow-sm ${isDark ? 'bg-dark text-light' : 'bg-white'} table-sm-font`}
      style={{ border: isDark ? '1px solid #333' : '1px solid #ccc' }}
    >
      {loading ? (
        <div className="text-center">Loading invoices...</div>
      ) : (
        <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className={`table ${isDark ? 'table-dark' : 'table-striped'} table-hover align-middle mb-0`}>
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Client Name</th>
                <th>Delivery Date</th>
                <th>Pending Amount (KWD)</th>
                <th>Delivery Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No invoices found.</td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv._id}>
                    <td>{inv.serialNumber}</td>
                    <td>{inv.clientName}</td>
                    <td>{new Date(inv.deliveryDate).toLocaleDateString()}</td>
                    <td>{inv.pendingAmount} KWD</td>
                    <td>
                      <span className={
                        inv.deliveryStatus === 'Due'
                          ? 'badge bg-warning text-dark'
                          : inv.deliveryStatus === 'Due Today'
                          ? 'badge bg-danger'
                          : inv.deliveryStatus === 'Delivered'
                          ? 'badge bg-success'
                          : 'badge bg-info text-dark'
                      }>
                        {getDeliveryStatus(inv)}
                      </span>
                    </td>
                    <td>
                      {editingRowId === inv._id ? (
                        <div className="d-flex align-items-center gap-2">
                          <select
                            className="form-select form-select-sm"
                            value={updatedStatus}
                            onChange={(e) => setUpdatedStatus(e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="Due">Due</option>
                            <option value="Due Today">Due Today</option>
                            <option value="Pending">Pending</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          <button className="btn btn-success btn-sm" onClick={() => handleStatusSave(inv._id)}>
                            Save
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-outline-primary btn-sm" onClick={() => {
                          setEditingRowId(inv._id);
                          setUpdatedStatus(inv.deliveryStatus);
                        }}>
                          Edit Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
