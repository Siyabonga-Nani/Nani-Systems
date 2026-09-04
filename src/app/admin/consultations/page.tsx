import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function ConsultationsPage() {
  const consultations = await db.consultation.findMany({
    orderBy: { createdAt: "desc" },
    include: { lead: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Consultations Log</h2>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4">Lead</th>
                <th className="px-6 py-4">Meeting Type</th>
                <th className="px-6 py-4">Requested Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((cons) => (
                <tr key={cons.id} className="border-b border-border/50 hover:bg-secondary/10">
                  <td className="px-6 py-4 font-medium">{cons.lead.name}</td>
                  <td className="px-6 py-4">{cons.meetingType.replace('_', ' ').toUpperCase()}</td>
                  <td className="px-6 py-4">{cons.requestedDate || "Flexible"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={cons.status === "REQUESTED" ? "default" : "outline"}>{cons.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(cons.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/consultations/${cons.id}`} className="text-sm font-medium text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {consultations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No consultations found.
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