import dbConnect from '@/utils/dbConnect';
import Invoice from '@/models/invoice';

export async function GET(req, context) {
  // Await params first
  const params = await context.params;
  const { id } = params;

  await dbConnect();

  try {
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return new Response(JSON.stringify({ message: 'Invoice not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(invoice), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return new Response(JSON.stringify({ message: 'Server error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
