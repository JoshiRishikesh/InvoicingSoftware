// app/api/send-whatsapp/route.js

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, clientName, fileUrl } = body;

    if (!to || !clientName || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const chatId = `${to}@c.us`;
    const messageText = `Hello ${clientName}, here is your invoice.\n\nView/Download PDF:\n${fileUrl}`;

    const waapiRes = await fetch(`https://waapi.app/api/v1/instances/65040/client/action/send-message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WAAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        message: messageText,
      }),
    });

    const resultData = await waapiRes.json();

    // Check for WAAPI error
    if (!waapiRes.ok) {
      console.error('WAAPI Error Response:', resultData);
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message', details: resultData },
        { status: waapiRes.status }
      );
    }

    return NextResponse.json(resultData, { status: 200 });

  } catch (error) {
    console.error("Unexpected Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
