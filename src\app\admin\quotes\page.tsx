import { db } from "@/lib/db";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function QuotesPage() {
  const quotes = await db.quotation.findMany({
    orderBy: { createdAt: "desc" },
    include: { lead: true }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quotations</h2>
          <p className="text-muted-foreground">Manage quotes and proposals.</p>
        </div>
        <Link href="/admin/quotes/new" className={buttonVariants({ variant: "default" })}>Create Quote</Link>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Valid Until</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-border/50 hover:bg-secondary/10">
                  <td className="px-6 py-4 font-medium">{q.lead.name}</td>
                  <td className="px-6 py-4">{q.currency} {q.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{q.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(q.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/quotes/${q.id}`} className="text-primary hover:underline font-medium">View</Link>
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No quotations found.
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