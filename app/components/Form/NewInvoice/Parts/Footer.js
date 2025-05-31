// app/components/Form/NewInvoice/Footer.js
export default function Footer({ summary }) {
  return (
    <div className="mt-4 border-top pt-3">
      <div className="row g-3">
        <div className="col-md-6 offset-md-6">
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              <span>Subtotal:</span>
              <strong>KWD {summary.total.toFixed(2)}</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Discount:</span>
              <strong>KWD {summary.discount.toFixed(2)}</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between text-primary fw-bold">
              <span>Total Payable:</span>
              <strong>KWD {summary.final.toFixed(2)}</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Advance Paid:</span>
              <strong>KWD {summary.advance.toFixed(2)}</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between text-danger fw-bold">
              <span>Pending Amount:</span>
              <strong>KWD {summary.pending.toFixed(2)}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
