const productOptions = [
  'Fabric+Stitching',
  'Readymade Cloth',
  'Cut Piece',
  'Stitching',
];

export default function Table({ products, onChangeProduct, onAddRow, onRemoveRow }) {
  function handleNumericInput(value) {
    let cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    return cleaned;
  }

  return (
    <>
      {/* ✅ Desktop Table */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered table-hover table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Product Name</th>
              <th style={{ width: '120px' }}>Qty</th>
              <th style={{ width: '120px' }}>Rate</th>
              <th style={{ width: '150px' }}>Amount</th>
              <th style={{ width: '100px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx}>
                <td>
                  <select
                    className="form-select"
                    value={product. name|| ""}
                    onChange={(e) => onChangeProduct(idx, 'name', e.target.value)}
                  >
                    <option value="" disabled>Select Product</option>
                    {productOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control"
                    value={product.quantity || ""}
                    onChange={(e) =>
                      onChangeProduct(idx, 'quantity', handleNumericInput(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    className="form-control"
                    value={product.rate || ""}
                    onChange={(e) =>
                      onChangeProduct(idx, 'rate', handleNumericInput(e.target.value))
                    }
                  />
                </td>
                <td>KWD {!isNaN(product.amount) ? Number(product.amount).toFixed(2) : '0.00'}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => onRemoveRow(idx)}
                  >
                    <i className="bi bi-trash-fill text-danger" style={{ fontSize: '1.2rem' }}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-end">
          <button type="button" className="btn btn-outline-primary" onClick={onAddRow}>
            <i className="bi bi-plus-circle"></i> Add Product
          </button>
        </div>
      </div>

      {/* ✅ Mobile View */}
      <div className="d-block d-md-none">
        {products.map((product, idx) => (
          <div key={idx} className="card mb-3 shadow-sm">
            <div className="card-body p-3">
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <select
                  className="form-select"
                  value={product.name}
                  onChange={(e) => onChangeProduct(idx, 'name', e.target.value)}
                >
                  <option value="" disabled>Select Product</option>
                  {productOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="form-control"
                  value={product.quantity}
                  onChange={(e) =>
                    onChangeProduct(idx, 'quantity', handleNumericInput(e.target.value))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rate</label>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  className="form-control"
                  value={product.rate}
                  onChange={(e) =>
                    onChangeProduct(idx, 'rate', handleNumericInput(e.target.value))
                  }
                />
              </div>
              <div className="mb-3">
                <strong>Amount:</strong> KWD {!isNaN(product.amount) && product.amount !== undefined ? Number(product.amount).toFixed(2) : '0.00'}
              </div>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onRemoveRow(idx)}
                >
                  <i className="bi bi-trash-fill"></i> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="text-end">
          <button type="button" className="btn btn-outline-primary" onClick={onAddRow}>
            <i className="bi bi-plus-circle"></i> Add Product
          </button>
        </div>
      </div>
    </>
  );
}
