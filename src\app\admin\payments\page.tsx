import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function PaymentsPage() {
  const payments = await db.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { invoice: { include: { client: { include: { lead: true } } } } }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Payments Ledger</h2>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Invoice Ref</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/10">
                  <td className="px-6 py-4">
                    <div className="font-medium">{p.invoice.client.lead.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/invoices/${p.invoice.id}`} className="text-primary hover:underline">
                      {p.invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {p.currency} {p.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{p.method}</Badge>
                    {p.reference && <div className="text-xs text-muted-foreground mt-1">Ref: {p.reference}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={p.status === "SUCCESS" ? "default" : "destructive"} className={p.status === "SUCCESS" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(p.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No payments recorded yet.
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