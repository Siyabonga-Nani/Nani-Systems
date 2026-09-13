const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPostgresWorkflow() {
  console.log("Starting PostgreSQL Workflow Verification...");

  // 1. Create Lead
  const lead = await prisma.lead.create({
    data: {
      name: 'PostgreSQL Test Client',
      email: 'test@postgres.local',
      phone: '555-1234',
      company: 'Test Corp',
      message: 'Testing PostgreSQL migration foundation.'
    }
  });
  console.log(`? Lead Created: ${lead.id}`);

  // 2. Create Quote Request
  const quoteReq = await prisma.quoteRequest.create({
    data: {
      leadId: lead.id,
      serviceId: 'custom-software',
      projectType: 'Web Application',
      requirements: 'Postgres compatibility testing',
    }
  });
  console.log(`? QuoteRequest Created: ${quoteReq.id}`);

  // 3. Create Quotation
  const quotation = await prisma.quotation.create({
    data: {
      leadId: lead.id,
      quoteRequestId: quoteReq.id,
      lineItems: JSON.stringify([{ description: 'Test', quantity: 1, unitPrice: 1000, total: 1000 }]),
      subtotal: 1000,
      taxAmount: 0,
      total: 1000,
      validUntil: new Date(Date.now() + 86400000),
      status: 'ACCEPTED'
    }
  });
  console.log(`? Quotation Created: ${quotation.id}`);

  // 4. Create Contract
  const contract = await prisma.contract.create({
    data: {
      quotationId: quotation.id,
      terms: 'Standard Terms',
      clientName: 'Test Client',
      clientEmail: 'test@postgres.local',
      signedAt: new Date(),
      status: 'SIGNED'
    }
  });
  console.log(`? Contract Created: ${contract.id}`);

  // 5. Create Client Identity
  const client = await prisma.client.create({
    data: {
      leadId: lead.id,
      companyDetails: 'Test Corp',
    }
  });
  console.log(`? Client Identity Created: ${client.id}`);

  // 6. Create Invoice & Line Item
  const invoice = await prisma.invoice.create({
    data: {
      contractId: contract.id,
      clientId: client.id,
      invoiceNumber: 'INV-TEST-001',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 86400000),
      subtotal: 1000,
      taxAmount: 0,
      total: 1000,
      amountDue: 1000,
      lineItems: {
        create: [{ description: 'Test', quantity: 1, unitPrice: 1000, total: 1000 }]
      }
    }
  });
  console.log(`? Invoice Created: ${invoice.id}`);

  // 7. Process Payment
  const payment = await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      amount: 1000,
      status: 'SUCCESS'
    }
  });
  console.log(`? Payment Created: ${payment.id}`);
  
  // 8. Create Project Onboarding
  const onboarding = await prisma.projectOnboarding.create({
    data: {
      clientId: client.id,
      contractId: contract.id,
      businessContext: 'Test Context'
    }
  });
  console.log(`? Onboarding Created: ${onboarding.id}`);
  
  console.log("\n?? PostgreSQL Migration Foundation Verification PASSED!");
}

testPostgresWorkflow()
  .catch(e => {
    console.error("? Verification Failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
