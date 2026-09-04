import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function NewInvoicePage(props: { searchParams: Promise<{ contractId?: string }> }) {
  const searchParams = await props.searchParams;
  const contractId = searchParams.contractId;
  if (!contractId) return notFound();

  const contract = await db.contract.findUnique({
    where: { id: contractId },
    include: { quotation: { include: { lead: { include: { client: true } } } } }
  });

  if (!contract || !contract.quotation.lead.client) return notFound();

  async function generateInvoice() {
    "use server";
    if (!contract || !contract.quotation.lead.client) return;
    
    // Auto generate based on quotation for 100% of the quote for this demo.
    // In a full implementation, you would select milestone percentages.
    
    const count = await db.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const inv = await db.invoice.create({
      data: {
        contractId: contract.id,
        clientId: contract.quotation.lead.client.id,
        invoiceNumber,
        issueDate,
        dueDate,
        subtotal: contract.quotation.subtotal,
        taxAmount: contract.quotation.taxAmount,
        total: contract.quotation.total,
        amountDue: contract.quotation.total,
        amountPaid: 0,
        currency: contract.quotation.currency,
      }
    });

    const items = JSON.parse(contract.quotation.lineItems);
    for (const item of items) {
      await db.invoiceLineItem.create({
        data: {
          invoiceId: inv.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice
        }
      });
    }

    redirect(`/admin/invoices/${inv.id}`);
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-center mt-20">
      <h2 className="text-3xl font-bold tracking-tight">Generate Invoice</h2>
      <p className="text-muted-foreground">
        Generate an invoice for {contract.quotation.lead.name} based on Contract {contract.id}.
      </p>
      
      <form action={generateInvoice}>
        <Button size="lg">Create Invoice</Button>
      </form>
    </div>
  );
}