// app/api/getDeliveries/route.js
import dbConnect from '@/utils/dbConnect';
import Invoice from '@/models/invoice';

export async function GET() {
  await dbConnect();

  try {
  const deliveries = await Invoice.aggregate([
    { $unwind: "$products" },
    {
      $match: {
        deliveryStatus: { $ne: "Delivered" },      // Add this line to filter only delivered invoices
        "products.name": { $in: ["Fabric + Stitching", "Stitching"] },
        "products.quantity": { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$deliveryDate",
        totalQuantity: { $sum: "$products.quantity" },
      },
    },
    {
      $project: {
        _id: 0,
        deliveryDate: "$_id",
        totalQuantity: 1,
      },
    },
    { $sort: { deliveryDate: 1 } },
  ]);


    if (!deliveries || deliveries.length === 0) {
      return new Response(
        JSON.stringify({ message: "No deliveries found" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(deliveries), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching deliveries" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
