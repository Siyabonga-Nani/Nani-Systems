import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ClientInvoicePage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const invoice = await db.invoice.findUnique({
    where: { token: params.token },
    include: { client: { include: { lead: true } }, lineItems: true }
  });

  if (!invoice) return notFound();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Nani Systems</h1>
          <p className="text-muted-foreground">Invoice {invoice.invoiceNumber}</p>
        </div>
        
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border/50 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Billed To</p>
              <p className="font-semibold">{invoice.client.lead.name}</p>
              <p className="text-sm">{invoice.client.lead.email}</p>
            </div>
            <div className="md:text-right">
              <p className="font-semibold text-lg">{invoice.title}</p>
              <p className="text-sm text-muted-foreground">Issued: {new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p className="text-sm font-medium">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              <Badge variant={invoice.status === "PAID" ? "default" : "outline"} className="mt-2">{invoice.status}</Badge>
            </div>
          </div>
          
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-8 py-4">Description</th>
                <th className="px-8 py-4">Qty</th>
                <th className="px-8 py-4">Unit Price</th>
                <th className="px-8 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-8 py-6">{item.description}</td>
                  <td className="px-8 py-6">{item.quantity}</td>
                  <td className="px-8 py-6">{invoice.currency} {item.unitPrice.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right">{invoice.currency} {item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="p-8 bg-secondary/10 flex flex-col items-end gap-2">
            <p className="text-muted-foreground">Subtotal: {invoice.currency} {invoice.subtotal.toLocaleString()}</p>
            <p className="text-muted-foreground">Tax: {invoice.currency} {invoice.taxAmount.toLocaleString()}</p>
            <div className="h-px w-48 bg-border my-2"></div>
            <p className="text-lg">Total: {invoice.currency} {invoice.total.toLocaleString()}</p>
            <p className="text-muted-foreground">Amount Paid: {invoice.currency} {invoice.amountPaid.toLocaleString()}</p>
            <p className="text-3xl font-bold mt-2">Amount Due: {invoice.currency} {invoice.amountDue.toLocaleString()}</p>
          </div>
        </div>

        {invoice.amountDue.toNumber() > 0 && (
          <div className="bg-card p-6 border border-border/50 rounded-2xl text-center space-y-4">
            <h3 className="font-semibold text-lg">Payment Options</h3>
            <p className="text-sm text-muted-foreground">Please perform a manual EFT to the account provided in your service agreement, using {invoice.invoiceNumber} as the reference.</p>
            <Button size="lg" className="w-full sm:w-auto" disabled>Online Payment (Coming Soon)</Button>
          </div>
        )}
      </div>
    </div>
  );
}