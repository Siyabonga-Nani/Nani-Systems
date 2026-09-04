import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'sandbox_client_id';
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || 'sandbox_secret';
const PAYPAL_API_BASE = process.env.PAYPAL_ENVIRONMENT === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

async function generateAccessToken() {
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET).toString('base64');
  const response = await fetch(PAYPAL_API_BASE + '/v1/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: 'Basic ' + auth,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (!response.ok) throw new Error('Failed to generate PayPal access token');
  const data = await response.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { invoiceId, idempotencyKey } = await req.json();

    if (!invoiceId) {
      return NextResponse.json({ error: 'invoiceId is required' }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    if (invoice.amountDue.lte(0)) {
      return NextResponse.json({ error: 'Invoice is already fully paid.' }, { status: 400 });
    }

    const accessToken = await generateAccessToken();
    const requestId = idempotencyKey || crypto.randomUUID();

    const response = await fetch(PAYPAL_API_BASE + '/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'PayPal-Request-Id': requestId,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: invoice.id,
            amount: {
              currency_code: invoice.currency,
              value: invoice.amountDue.toFixed(2),
            },
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("PayPal Create Order Error:", data);
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }

    await logAudit({
      actorType: 'SYSTEM',
      action: 'PAYPAL_ORDER_CREATED',
      entityType: 'Invoice',
      entityId: invoice.id,
      newState: { orderId: data.id, amountDue: invoice.amountDue.toFixed(2), requestId },
    });

    return NextResponse.json({ orderID: data.id });
  } catch (error: any) {
    console.error("PayPal Create Order Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
