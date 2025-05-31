
// app/api/allinvoices/route.js

import dbConnect from '@/utils/dbConnect';
import Invoice from '@/models/invoice';

export async function GET(request) {
  try {
    await dbConnect();
    const invoices = await Invoice.find({}).sort({ invoiceDate: -1 }).lean();

    const safeInvoices = invoices.map(inv => ({
      ...inv,
      _id: inv._id.toString(),
      invoiceDate: inv.invoiceDate.toISOString(),
      deliveryDate: inv.deliveryDate.toISOString(),
      createdAt: inv.createdAt.toISOString(),
      updatedAt: inv.updatedAt.toISOString(),
    }));

    return new Response(JSON.stringify(safeInvoices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch invoices', { status: 500 });
  }
}
