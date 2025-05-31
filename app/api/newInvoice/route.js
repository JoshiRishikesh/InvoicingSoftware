// app/api/newInvoice/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Invoice from '@/models/invoice';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      formData,
      products,
      totalAmount,
      finalAmount,
      pendingAmount,
    } = body;

    const invoiceData = {
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      clientName: formData.clientName,
      contactNumber: formData.contactNumber,
      address: formData.address,
      referenceNumber: formData.referenceNumber,
      serialNumber: formData.serialNumber,
      discount: formData.discount,
      advanceAmount: formData.advanceAmount,
      paymentMode: formData.paymentMode,
      deliveryDate: formData.deliveryDate,
      deliveryStatus: formData.deliveryStatus || 'Due',
      products,
      totalAmount,
      finalAmount,
      pendingAmount,
    };

    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();

    return NextResponse.json({ message: 'Invoice saved successfully!' }, { status: 201 });
  } catch (error) {
    console.error('❌ Error saving invoice:', error);
    return NextResponse.json({ message: 'Error saving invoice.', error: error.message }, { status: 500 });
  }
}
