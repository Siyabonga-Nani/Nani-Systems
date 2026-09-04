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
    const { orderID, invoiceId, idempotencyKey } = await req.json();

    if (!orderID || !invoiceId || !idempotencyKey) {
      return NextResponse.json({ error: 'orderID, invoiceId, and idempotencyKey are required' }, { status: 400 });
    }

    const existingPayment = await prisma.payment.findUnique({ where: { idempotencyKey } });
    if (existingPayment) {
      return NextResponse.json({ success: true, paymentId: existingPayment.id, note: 'Idempotency key matched existing payment.' });
    }

    const accessToken = await generateAccessToken();

    const response = await fetch(PAYPAL_API_BASE + '/v2/checkout/orders/' + orderID + '/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
        'PayPal-Request-Id': 'capture_' + idempotencyKey,
      },
    });

    const data = await response.json();

    if (data.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment not completed successfully.', details: data }, { status: 400 });
    }

    const captureInfo = data.purchase_units?.[0]?.payments?.captures?.[0];
    const amountCapturedStr = captureInfo?.amount?.value || '0';
    const transactionId = captureInfo?.id;

    if (!transactionId) {
      return NextResponse.json({ error: 'No transaction ID found in capture.' }, { status: 500 });
    }

    const txExists = await prisma.payment.findUnique({ where: { reference: transactionId } });
    if (txExists) {
      return NextResponse.json({ success: true, paymentId: txExists.id, note: 'Transaction ID already processed.' });
    }

    const sanitizedProviderData = JSON.stringify({
      orderID: data.id,
      captureID: transactionId,
      payerID: data.payer?.payer_id,
      paymentSource: Object.keys(data.payment_source || {})[0] || 'paypal'
    });

    const result = await prisma.$transaction(async (tx) => {
      const currentInvoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
      if (!currentInvoice) throw new Error('Invoice not found.');

      const newPayment = await tx.payment.create({
        data: {
          invoiceId,
          amount: parseFloat(amountCapturedStr),
          currency: currentInvoice.currency,
          method: 'PAYPAL',
          reference: transactionId,
          idempotencyKey,
          providerData: sanitizedProviderData,
          status: 'SUCCESS',
        }
      });

      const newAmountPaid = currentInvoice.amountPaid.plus(newPayment.amount);
      const newAmountDue = currentInvoice.total.minus(newAmountPaid);
      let newStatus = 'PARTIALLY_PAID';
      if (newAmountDue.lte(0)) {
        newStatus = 'PAID';
      }

      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: newAmountPaid,
          amountDue: newAmountDue,
          status: newStatus
        }
      });

      return newPayment;
    });

    await logAudit({
      actorType: 'PROVIDER',
      actorId: 'PAYPAL',
      action: 'PAYMENT_CAPTURED',
      entityType: 'Payment',
      entityId: result.id,
      newState: { amount: result.amount, invoiceId, transactionId },
    });

    return NextResponse.json({ success: true, paymentId: result.id });
  } catch (error: any) {
    console.error("PayPal Capture Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
