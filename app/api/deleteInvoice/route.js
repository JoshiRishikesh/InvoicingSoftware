// /app/api/deleteInvoice/route.js

import dbConnect from '@/utils/dbConnect';
import Invoice from '@/models/invoice';

export async function DELETE(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ message: 'Missing invoice ID' }), { status: 400 });
    }

    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return new Response(JSON.stringify({ message: 'Invoice not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Invoice deleted successfully' }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Error deleting invoice' }), { status: 500 });
  }
}
