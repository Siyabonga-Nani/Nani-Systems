import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminInvoiceView(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const invoice = await db.invoice.findUnique({
    where: { id: params.id },
    include: { client: { include: { lead: true } }, lineItems: true, payments: true }
  });

  if (!invoice) return notFound();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h2>
          <p className="text-muted-foreground">ID: {invoice.id}</p>
        </div>
        <div className="flex gap-4">
          <Link href={`/invoice/${invoice.token}`} target="_blank" className={buttonVariants({ variant: "outline" })}>View Client Link</Link>
          {invoice.amountDue.toNumber() > 0 && (
            <Link href={`/admin/payments/new?invoiceId=${invoice.id}`} className={buttonVariants({ variant: "outline" })}>Log Manual Payment</Link>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-border/50 p-6 rounded-xl">
          <h3 className="font-semibold text-lg mb-4">Client</h3>
          <div className="space-y-2 text-sm">
            <p>{invoice.client.lead.name}</p>
            <p>{invoice.client.lead.email}</p>
          </div>
        </div>

        <div className="bg-card border border-border/50 p-6 rounded-xl">
          <h3 className="font-semibold text-lg mb-4">Meta</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Status:</span> <Badge>{invoice.status}</Badge></p>
            <p><span className="text-muted-foreground">Amount Due:</span> {invoice.currency} {invoice.amountDue.toLocaleString()}</p>
            <p><span className="text-muted-foreground">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}