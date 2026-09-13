import { calculateCommercialTotal } from '../src/lib/commercial';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function runTests() {
  console.log('--- COMMERCIAL INTEGRITY TESTS ---');

  // Test 1: VAT EXCLUDED
  const t1 = calculateCommercialTotal({
    subtotal: 10000,
    taxRate: 15,
    taxTreatment: 'EXCLUDED',
  });
  console.log(t1.finalTotal.toString() === '11500.00' ? '? EXCLUDED VAT' : '? EXCLUDED VAT', t1);

  // Test 2: VAT INCLUDED
  const t2 = calculateCommercialTotal({
    subtotal: 11500,
    taxRate: 15,
    taxTreatment: 'INCLUDED',
  });
  console.log(t2.taxAmount.toString() === '1500.00' && t2.finalTotal.toString() === '11500.00' ? '? INCLUDED VAT' : '? INCLUDED VAT', t2);

  // Test 3: ZERO VAT
  const t3 = calculateCommercialTotal({
    subtotal: 5000,
    taxRate: 0,
    taxTreatment: 'ZERO',
  });
  console.log(t3.taxAmount.toString() === '0.00' && t3.finalTotal.toString() === '5000.00' ? '? ZERO VAT' : '? ZERO VAT', t3);

  // Test 4: Discounts and Additions
  const t4 = calculateCommercialTotal({
    subtotal: 20000,
    discountAmount: 2000,
    additionalCharges: 500,
    taxRate: 15,
    taxTreatment: 'EXCLUDED',
  });
  // base = 20000 - 2000 + 500 = 18500
  // tax = 18500 * 0.15 = 2775
  // final = 18500 + 2775 = 21275
  console.log(t4.finalTotal.toString() === '21275.00' ? '? DISCOUNT/ADDITION VAT' : '? DISCOUNT/ADDITION VAT', t4);

  console.log('\n--- IDEMPOTENCY / DATABASE TESTS ---');
  
  // Clean db
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.client.deleteMany();
  await prisma.lead.deleteMany();

  const lead = await prisma.lead.create({ data: { name: 'Test', email: 'test@example.com' } });
  const client = await prisma.client.create({ data: { leadId: lead.id } });

  const inv = await prisma.invoice.create({
    data: {
      clientId: client.id,
      invoiceNumber: 'INV-TEST-01',
      issueDate: new Date(),
      dueDate: new Date(),
      subtotal: new Decimal(10000),
      taxRate: new Decimal(15),
      taxTreatment: 'EXCLUDED',
      taxAmount: new Decimal(1500),
      total: new Decimal(11500),
      amountDue: new Decimal(11500),
      amountPaid: new Decimal(0),
    }
  });

  console.log('? INVOICE CREATED');

  // Simulate Payment Idempotency
  const payment1 = await prisma.payment.create({
    data: {
      invoiceId: inv.id,
      amount: new Decimal(11500),
      method: 'PAYPAL',
      reference: 'PAYPAL_TX_123',
      idempotencyKey: 'IDEMP_KEY_ABC',
    }
  });
  
  try {
    await prisma.payment.create({
      data: {
        invoiceId: inv.id,
        amount: new Decimal(11500),
        method: 'PAYPAL',
        reference: 'PAYPAL_TX_123',
        idempotencyKey: 'IDEMP_KEY_ABC',
      }
    });
    console.log('? IDEMPOTENCY FAILED: Allowed duplicate');
  } catch (e) {
    console.log('? IDEMPOTENCY PASSED: Rejected duplicate key');
  }

  console.log('\nAll tests executed successfully.');
  await prisma.$disconnect();
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});
