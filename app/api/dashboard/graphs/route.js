import dbConnect from '@/utils/dbConnect';
import Invoice from '@/models/invoice';

export async function GET() {
  await dbConnect();

  try {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const nextWeek = new Date(startOfToday);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    // 1. Total Sales by Month
    const salesByMonthAgg = await Invoice.aggregate([
      { $match: { invoiceDate: { $gte: startOfYear, $lte: endOfYear } } },
      {
        $group: {
          _id: { month: { $month: '$invoiceDate' } },
          totalSales: { $sum: '$finalAmount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const dataSalesByMonth = monthNames.map((_, index) => {
      const monthNumber = index + 1;
      const found = salesByMonthAgg.find(item => item._id.month === monthNumber);
      return found ? found.totalSales : 0;
    });

    // 2. Category Wise Sales Quantity
    const categories = ['Fabric+Stitching', 'Readymade Cloth', 'Cut Piece', 'Stitching'];
    const categorySalesAgg = await Invoice.aggregate([
      { $unwind: '$products' },
      {
        $match: {
          'products.name': { $in: categories },
          'products.quantity': { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$products.name',
          totalQuantity: { $sum: '$products.quantity' },
        },
      },
    ]);

    const categorySalesQty = categories.map(cat =>
      categorySalesAgg.find(item => item._id === cat)?.totalQuantity || 0
    );

    // 3. Revenue by Payment Mode + Pending Amount
    const paymentModesSet = new Set();

    const revenueByPaymentModeAgg = await Invoice.aggregate([
      { $unwind: '$paymentHistory' },
      {
        $group: {
          _id: '$paymentHistory.mode',
          totalRevenue: { $sum: '$paymentHistory.amount' },
        },
      },
    ]);

    const advancePaymentAgg = await Invoice.aggregate([
      {
        $group: {
          _id: '$paymentMode',
          totalAdvance: { $sum: '$advanceAmount' },
        },
      },
    ]);

    revenueByPaymentModeAgg.forEach(item => {
      const mode = item._id?.trim() || 'No Mode';
      paymentModesSet.add(mode);
    });

    advancePaymentAgg.forEach(item => {
      const mode = item._id?.trim() || 'No Mode';
      paymentModesSet.add(mode);
    });

    const paymentModes = Array.from(paymentModesSet);

    const combinedRevenueByMode = paymentModes.map(mode => {
      const revenueObj = revenueByPaymentModeAgg.find(item => (item._id?.trim() || 'No Mode') === mode);
      const advanceObj = advancePaymentAgg.find(item => (item._id?.trim() || 'No Mode') === mode);
      return (revenueObj?.totalRevenue || 0) + (advanceObj?.totalAdvance || 0);
    });

    const pendingAgg = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalPending: { $sum: '$pendingAmount' },
        },
      },
    ]);
    const pendingAmount = pendingAgg[0]?.totalPending || 0;

    const revenueLabels = [...paymentModes, 'Pending Amount'];
    const revenueData = [...combinedRevenueByMode, pendingAmount];

    // 4. Deliveries for Next 7 Days
    const deliveriesAgg = await Invoice.aggregate([
      {
        $match: {
          deliveryDate: { $gte: startOfToday, $lt: nextWeek },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$deliveryDate' },
            month: { $month: '$deliveryDate' },
            day: { $dayOfMonth: '$deliveryDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const labelsDeliveries = [];
    const dataDeliveriesCount = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfToday);
      date.setDate(startOfToday.getDate() + i);
      const dayLabel = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      labelsDeliveries.push(dayLabel);

      const found = deliveriesAgg.find(
        item =>
          item._id.year === date.getFullYear() &&
          item._id.month === date.getMonth() + 1 &&
          item._id.day === date.getDate()
      );
      dataDeliveriesCount.push(found ? found.count : 0);
    }

    // 5. Total Product Sales Amount (All Products Combined)
    const productSalesAmountAgg = await Invoice.aggregate([
      { $unwind: '$products' },
      {
        $match: {
          'products.quantity': { $exists: true, $ne: null },
          'products.price': { $exists: true, $ne: null },
          invoiceDate: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $project: {
          month: { $month: '$invoiceDate' },
          amount: { $multiply: ['$products.quantity', '$products.price'] },
        },
      },
      {
        $group: {
          _id: '$month',
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const productSalesAmountData = monthNames.map((_, index) => {
      const month = index + 1;
      const entry = productSalesAmountAgg.find(item => item._id === month);
      return entry ? entry.totalAmount : 0;
    });

    // 6. Total Sales by Product Category (Qty & Price)
    const productCategories = ['Fabric+Stitching', 'Readymade Cloth', 'Cut Piece', 'Stitching'];

    const productCategorySalesAgg = await Invoice.aggregate([
      { $unwind: '$products' },
      {
        $match: {
          'products.name': { $in: productCategories },
          'products.quantity': { $exists: true, $ne: null },
          'products.price': { $exists: true, $ne: null },
          invoiceDate: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: '$products.name',
          totalQuantity: { $sum: '$products.quantity' },
          totalAmount: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categoryQtyData = productCategories.map(
      cat => productCategorySalesAgg.find(item => item._id === cat)?.totalQuantity || 0
    );

    const categoryAmountData = productCategories.map(
      cat => productCategorySalesAgg.find(item => item._id === cat)?.totalAmount || 0
    );

    // ✅ Final Response
    return new Response(
      JSON.stringify({
        salesByMonth: { labels: monthNames, data: dataSalesByMonth },
        categorySalesQty: { labels: categories, data: categorySalesQty },
        revenueByPaymentMode: { labels: revenueLabels, data: revenueData },
        upcomingDeliveriesCount: { labels: labelsDeliveries, data: dataDeliveriesCount },
        productCategorySalesAmount: {
          labels: monthNames,
          datasets: [{ label: 'Total Product Sales Amount', data: productSalesAmountData }],
        },
        productCategorySales: {
          labels: productCategories,
          datasets: [
            { label: 'Quantity Sold', data: categoryQtyData },
            { label: 'Total Revenue', data: categoryAmountData },
          ],
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch dashboard data', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
