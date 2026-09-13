import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { getSession } from "@/lib/auth";

export default async function NewInvoicePage(props: { searchParams: Promise<{ contractId?: string }> }) {
  const searchParams = await props.searchParams;
  const contractId = searchParams.contractId;
  if (!contractId) return notFound();

  const contract = await db.contract.findUnique({
    where: { id: contractId },
    include: { quotation: { include: { lead: { include: { client: true } } } } }
  });

  if (!contract || !contract.quotation.lead.client) return notFound();

  async function generateInvoice(formData: FormData) {
    "use server";
    const session = await getSession();
    if (!session || session.role !== "admin") throw new Error("Unauthorized");
    
    if (!contract || !contract.quotation.lead.client) return;
    
    const percentageStr = formData.get("percentage") as string;
    const percentage = parseInt(percentageStr) || 100;
    const mult = percentage / 100;
    
    const count = await db.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const subtotal = Number(contract.quotation.subtotal) * mult;
    const taxAmount = Number(contract.quotation.taxAmount) * mult;
    const total = Number(contract.quotation.total) * mult;

    const inv = await db.invoice.create({
      data: {
        contractId: contract.id,
        clientId: contract.quotation.lead.client.id,
        invoiceNumber,
        issueDate,
        dueDate,
        subtotal,
        taxAmount,
        total,
        amountDue: total,
        amountPaid: 0,
        currency: contract.quotation.currency,
        title: percentage === 20 ? "20% Project Commitment Deposit" : percentage === 100 ? "100% Full Project Payment" : `${percentage}% Project Milestone`,
      }
    });

    const items = JSON.parse(contract.quotation.lineItems);
    for (const item of items) {
      const itemTotal = (item.quantity * item.unitPrice) * mult;
      await db.invoiceLineItem.create({
        data: {
          invoiceId: inv.id,
          description: `${item.description} (${percentage}%)`,
          quantity: item.quantity,
          unitPrice: item.unitPrice * mult,
          total: itemTotal
        }
      });
    }

    redirect(`/admin/invoices/${inv.id}`);
  }

  const quoteTotal = Number(contract.quotation.total);

  return (
    <div className="space-y-8 max-w-2xl mx-auto mt-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Generate Invoice</h2>
        <p className="text-muted-foreground mt-2">
          Contract {contract.id} • {contract.quotation.lead.name}
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
        <div className="mb-6 flex justify-between items-center pb-6 border-b border-border/50">
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Agreed Project Total</p>
            <p className="text-2xl font-bold">{contract.quotation.currency} {quoteTotal.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Required Minimum Commitment</p>
            <p className="text-xl font-bold text-primary">{contract.quotation.currency} {(quoteTotal * 0.2).toLocaleString()}</p>
          </div>
        </div>

        <form action={generateInvoice} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Select Payment Milestone</h3>
            <div className="grid gap-4">
              <label className="flex items-center space-x-3 bg-secondary/10 p-4 rounded-lg border border-border/50 cursor-pointer hover:bg-secondary/20 transition-colors">
                <input type="radio" name="percentage" value="20" defaultChecked className="h-4 w-4 accent-primary" />
                <div className="flex-1">
                  <div className="font-bold">20% Minimum Commitment Deposit</div>
                  <div className="text-sm text-muted-foreground mt-1">Required to formally activate the project.</div>
                </div>
                <div className="font-bold">{contract.quotation.currency} {(quoteTotal * 0.2).toLocaleString()}</div>
              </label>
              
              <label className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 cursor-pointer hover:bg-secondary/10 transition-colors">
                <input type="radio" name="percentage" value="50" className="h-4 w-4 accent-primary" />
                <div className="flex-1">
                  <div className="font-bold">50% Project Milestone</div>
                  <div className="text-sm text-muted-foreground mt-1">Standard two-part split.</div>
                </div>
                <div className="font-bold">{contract.quotation.currency} {(quoteTotal * 0.5).toLocaleString()}</div>
              </label>
              
              <label className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 cursor-pointer hover:bg-secondary/10 transition-colors">
                <input type="radio" name="percentage" value="100" className="h-4 w-4 accent-primary" />
                <div className="flex-1">
                  <div className="font-bold">100% Full Payment</div>
                  <div className="text-sm text-muted-foreground mt-1">Customer pays entirely upfront.</div>
                </div>
                <div className="font-bold">{contract.quotation.currency} {quoteTotal.toLocaleString()}</div>
              </label>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button size="lg" type="submit">Generate Invoice</Button>
          </div>
        </form>
      </div>
    </div>
  );
}