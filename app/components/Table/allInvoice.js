import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Add at the top inside the component



export default function AllInvoiceTable({ invoices = [], loading, isDark, onDelete }) {
  const handleDelete = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this invoice?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/deleteInvoice?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to delete');

      alert('Invoice deleted successfully');
      onDelete(id); // notify parent
    } catch (err) {
      console.error(err);
      alert('Error deleting invoice');
    }
  };

  const router = useRouter(); // Inside the component

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
                <th>Sr No.</th>
                <th>Client Name</th>
                <th>Invoice Date</th>
                <th>Total (KWD)</th>
                <th>Pending (KWD)</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No invoices found.</td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const isPending = inv.pendingAmount > 0;
                  return (
                    <tr key={inv._id}>
                      <td>{inv.serialNumber}</td>
                      <td>{inv.clientName}</td>
                      <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                      <td>{inv.totalAmount} KWD</td>
                      <td>{inv.pendingAmount} KWD</td>
                      <td>
                        {isPending ? (
                          <span className="badge bg-warning text-dark">Pending</span>
                        ) : (
                          <span className="badge bg-success">Cleared</span>
                        )}
                      </td>
                        <td>


                        <Link href={`/pages/viewInvoice/${inv._id}`} passHref>
                            <button 
                                className="btn btn-sm btn-outline-primary w-100 w-md-auto btn-sm-mobile"
                                type="button"
                                >
                                    View
                            </button>
                        </Link>



                        </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger w-100 w-md-auto btn-sm-mobile"
                          onClick={() => handleDelete(inv._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
