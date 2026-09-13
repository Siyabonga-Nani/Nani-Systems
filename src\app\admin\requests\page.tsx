import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

export default async function QuoteRequestsPage() {
  const requests = await db.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { lead: true, quotation: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quote Requests</h2>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4">Lead</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-border/50 hover:bg-secondary/10">
                  <td className="px-6 py-4">
                    <div className="font-medium">{req.lead.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(req.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{req.serviceId}</td>
                  <td className="px-6 py-4">{req.desiredTimeline?.replace('_', ' ') || "N/A"}</td>
                  <td className="px-6 py-4">{req.budgetRange?.replace('_', ' ') || "N/A"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={req.quotation ? "default" : "outline"} className={req.quotation ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                      {req.quotation ? "QUOTED" : req.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/requests/${req.id}`} className="text-sm font-medium text-primary hover:underline flex items-center justify-end gap-1">
                      Review <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No quote requests found.
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