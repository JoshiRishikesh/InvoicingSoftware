
import dbConnect from '../../../../utils/dbConnect';
import Invoice from '../../../../models/invoice';

export async function PATCH(req, context) {
  const params = await context.params; // await params first
  const { id } = params;

  try {
    await dbConnect();

    const data = await req.json(); // { paymentHistory: [...] }

    // Find invoice by ID
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If paymentHistory is sent, recalc pendingAmount
    if (data.paymentHistory) {
      // Update paymentHistory locally first
      invoice.paymentHistory = data.paymentHistory;

      // Recalculate total payments
      const totalPayments = invoice.paymentHistory.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      // Recalculate pendingAmount
      invoice.pendingAmount = invoice.finalAmount - invoice.advanceAmount - totalPayments;
    }

    // You can update other fields as needed
    // For any other fields in `data`, merge them here if required:
    // e.g. if you want to allow updating other fields:
    for (const key in data) {
      if (key !== 'paymentHistory') {
        invoice[key] = data[key];
      }
    }

    // Save updated invoice
    const updatedInvoice = await invoice.save();

    return new Response(JSON.stringify(updatedInvoice), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
