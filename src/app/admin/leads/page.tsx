import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function LeadsPage() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      quotes: true,
      consultations: true,
      messages: true,
      quotations: true,
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Leads Manager</h2>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-border/50 hover:bg-secondary/10">
                  <td className="px-6 py-4 font-medium">{lead.name}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{lead.email}</div>
                    {lead.phone && <div className="text-xs text-muted-foreground mt-1">{lead.phone}</div>}
                    {lead.company && <div className="text-xs text-muted-foreground mt-1">{lead.company}</div>}
                  </td>
                  <td className="px-6 py-4">{lead.source}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{lead.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {lead.quotes.length > 0 && <Badge variant="secondary" className="text-[10px]">Req ({lead.quotes.length})</Badge>}
                      {lead.consultations.length > 0 && <Badge variant="secondary" className="text-[10px]">Cons ({lead.consultations.length})</Badge>}
                      {lead.messages.length > 0 && <Badge variant="secondary" className="text-[10px]">Msg ({lead.messages.length})</Badge>}
                      {lead.quotations.length > 0 && <Badge variant="default" className="text-[10px] bg-primary/20 text-primary">Quote ({lead.quotations.length})</Badge>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/leads/${lead.id}`} className="text-sm font-medium text-primary hover:underline">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No leads found.
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