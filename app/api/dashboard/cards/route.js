// app/api/dashboard/cards/route.js

import dbConnect from '@/utils/dbConnect';
import Invoice from '@/models/invoice';

export async function GET() {
  await dbConnect();

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const [
      totalOrdersAgg,
      todaysDeliveriesAgg,
      upcomingDeliveriesAgg,
      totalSalesAgg,
      todaysRevenueAgg,
    ] = await Promise.all([
      Invoice.aggregate([
        { $unwind: '$products' },
        {
          $match: {
            'products.name': { $in: ['Fabric + Stitching', 'Stitching'] },
            'products.quantity': { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$products.quantity' },
          },
        },
        {
          $project: { _id: 0, totalQuantity: 1 },
        },
      ]),

      Invoice.aggregate([
        { $unwind: '$products' },
        {
          $match: {
            deliveryStatus: { $ne: 'Delivered' },
            deliveryDate: { $gte: today, $lt: tomorrow },
            'products.name': { $in: ['Fabric + Stitching', 'Stitching'] },
            'products.quantity': { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$products.quantity' },
          },
        },
        {
          $project: { _id: 0, totalQuantity: 1 },
        },
      ]),

      Invoice.aggregate([
        { $unwind: '$products' },
        {
          $match: {
            deliveryStatus: { $ne: 'Delivered' },
            deliveryDate: { $gte: today, $lt: nextWeek },
            'products.name': { $in: ['Fabric + Stitching', 'Stitching'] },
            'products.quantity': { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$products.quantity' },
          },
        },
        {
          $project: { _id: 0, totalQuantity: 1 },
        },
      ]),

      Invoice.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$finalAmount' },
          },
        },
        { $project: { _id: 0, totalSales: 1 } },
      ]),

      Invoice.aggregate([
        { $unwind: '$paymentHistory' },
        {
          $match: {
            'paymentHistory.date': { $gte: today, $lt: tomorrow },
          },
        },
        {
          $group: {
            _id: null,
            todaysRevenue: { $sum: '$paymentHistory.amount' },
          },
        },
        { $project: { _id: 0, todaysRevenue: 1 } },
      ]),
    ]);

    return new Response(
      JSON.stringify({
        totalOrders: totalOrdersAgg[0]?.totalQuantity || 0,
        todaysDeliveries: todaysDeliveriesAgg[0]?.totalQuantity || 0,
        upcomingDeliveries: upcomingDeliveriesAgg[0]?.totalQuantity || 0,
        totalSales: totalSalesAgg[0]?.totalSales || 0,
        todaysRevenue: todaysRevenueAgg[0]?.todaysRevenue || 0,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching dashboard cards:', error);
    return new Response(
      JSON.stringify({ message: 'Error fetching dashboard cards' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
