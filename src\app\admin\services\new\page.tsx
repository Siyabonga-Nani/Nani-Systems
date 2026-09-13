import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { getSession } from "@/lib/auth";

export default async function NewOngoingServicePage(props: { searchParams: Promise<{ clientId?: string }> }) {
  const searchParams = await props.searchParams;
  const clientId = searchParams.clientId;
  if (!clientId) return notFound();

  const client = await db.client.findUnique({
    where: { id: clientId },
    include: { lead: true }
  });

  if (!client) return notFound();

  async function createService(formData: FormData) {
    "use server";
    const session = await getSession();
    if (!session || session.role !== "admin") throw new Error("Unauthorized");
    const serviceType = formData.get("serviceType") as string;
    const status = formData.get("status") as string;
    const notes = formData.get("notes") as string;

    const svc = await db.ongoingService.create({
      data: {
        clientId: client!.id,
        serviceType,
        status,
        notes,
        startDate: new Date()
      }
    });

    redirect(`/admin/leads/${client!.leadId}`);
  }

  return (
    <div className="space-y-8 max-w-lg mx-auto mt-20 bg-card p-8 rounded-2xl border border-border/50">
      <h2 className="text-2xl font-bold tracking-tight">Add Managed Service</h2>
      <p className="text-muted-foreground text-sm">
        Record a new ongoing service for {client.lead.name}.
      </p>
      
      <form action={createService} className="space-y-4">
        <div className="space-y-2">
          <Label>Service Type</Label>
          <select name="serviceType" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="Hosting">Hosting</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Support">Support</option>
            <option value="Ongoing Development">Ongoing Development</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label>Initial Status</Label>
          <select name="status" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="PROPOSED">Proposed</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Notes & Commercial Details (Optional)</Label>
          <Textarea name="notes" placeholder="e.g. R500/month hosting via existing server..." />
        </div>

        <Button size="lg" className="w-full">Create Service</Button>
      </form>
    </div>
  );
}
