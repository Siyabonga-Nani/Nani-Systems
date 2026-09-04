import { db } from "@/lib/db";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function InvoicesPage() {
  const invoices = await db.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: { include: { lead: true } } }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">Manage client billing.</p>
        </div>
        <Link href="/admin/invoices/new" className={buttonVariants({ variant: "default" })}>Create Invoice</Link>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-3">Invoice #</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Amount Due</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id} className="border-b border-border/50 hover:bg-secondary/10">
                  <td className="px-6 py-4 font-medium">{i.invoiceNumber}</td>
                  <td className="px-6 py-4">{i.client.lead.name}</td>
                  <td className="px-6 py-4">{i.currency} {i.amountDue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{i.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/invoices/${i.id}`} className="text-primary hover:underline font-medium">View</Link>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}