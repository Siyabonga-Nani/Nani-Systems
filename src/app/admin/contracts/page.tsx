import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

export default async function ContractsPage() {
  const contracts = await db.contract.findMany({
    orderBy: { createdAt: "desc" },
    include: { quotation: { include: { lead: true } }, invoices: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Contracts Ledger</h2>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4">Client / Lead</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Generated</th>
                <th className="px-6 py-4">Signed Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/10">
                  <td className="px-6 py-4">
                    <div className="font-medium">{c.clientName || c.quotation.lead.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.clientEmail || c.quotation.lead.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {c.quotation.currency} {c.quotation.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={c.status === "SIGNED" ? "default" : "outline"} className={c.status === "SIGNED" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.signedAt ? new Date(c.signedAt).toLocaleDateString() : "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/contracts/${c.id}`} className="text-sm font-medium text-primary hover:underline flex items-center justify-end gap-1">
                      View <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {contracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No contracts generated yet.
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