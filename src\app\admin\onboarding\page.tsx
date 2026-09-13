import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function OnboardingPage() {
  const onboardings = await db.projectOnboarding.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: { include: { lead: true } }, contract: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Project Onboarding</h2>
        <Link href="/admin/onboarding/new">
          <Button>Generate Onboarding Link</Button>
        </Link>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Contract Ref</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Generated</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {onboardings.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/10">
                  <td className="px-6 py-4 font-medium">{o.client.lead.name}</td>
                  <td className="px-6 py-4">{o.contractId || "N/A"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={o.status === "SUBMITTED" ? "default" : "outline"} className={o.status === "SUBMITTED" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/onboarding/${o.id}`} className="text-sm font-medium text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {onboardings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No onboarding processes initiated yet.
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