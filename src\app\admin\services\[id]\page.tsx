import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Settings, Calendar, FileText } from "lucide-react";

import { getSession } from "@/lib/auth";

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const svc = await db.ongoingService.findUnique({
    where: { id },
    include: { client: { include: { lead: true } }, project: true }
  });

  if (!svc) notFound();

  async function updateStatus(formData: FormData) {
    "use server";
    const session = await getSession();
    if (!session || session.role !== "admin") throw new Error("Unauthorized");
    const status = formData.get("status") as string;
    await db.ongoingService.update({
      where: { id },
      data: { status }
    });

    const { sendClientConfirmation, sendInternalNotification } = await import("@/lib/notifications");
    
    const updatedSvc = await db.ongoingService.findUnique({
      where: { id },
      include: { client: { include: { lead: true } } }
    });

    if (updatedSvc) {
      let subject = "Service Update";
      let message = `Your service "${updatedSvc.serviceType}" status has been updated to ${status}.`;

      if (status === "ACTIVE") {
        subject = "Service Activated";
        message = `Your ${updatedSvc.serviceType} service has been activated.`;
      } else if (status === "PAUSED") {
        subject = "Service Paused";
        message = `Your ${updatedSvc.serviceType} service has been temporarily paused.`;
      } else if (status === "CANCELLED") {
        subject = "Service Cancelled";
        message = `Your ${updatedSvc.serviceType} service has been cancelled.`;
      }

      await sendClientConfirmation(
        updatedSvc.client.lead.email,
        `${subject} - Nani Systems`,
        `Hello ${updatedSvc.client.lead.name},\n\n${message}\n\nThank you,\nNani Systems`,
        "OngoingService",
        updatedSvc.id,
        `service_${updatedSvc.id}_status_${status}`
      );

      await sendInternalNotification(
        `Service ${updatedSvc.serviceType} -> ${status}`,
        `Service ${updatedSvc.id} for ${updatedSvc.client.lead.name} was updated to ${status}.`,
        `admin_service_${updatedSvc.id}_status_${status}`
      );
    }

    redirect(`/admin/services/${id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/leads/${svc.client.leadId}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Managed Service</h2>
        <Badge variant={svc.status === 'ACTIVE' ? 'default' : 'outline'} className="uppercase">
          {svc.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-4 mb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{svc.serviceType}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Start Date</p>
                <p>{svc.startDate ? new Date(svc.startDate).toLocaleDateString() : 'Pending'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Created</p>
                <p>{new Date(svc.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Service Notes</p>
              <div className="bg-secondary/10 p-4 rounded-lg whitespace-pre-wrap text-sm border border-border/50 min-h-[100px]">
                {svc.notes || "No notes provided."}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="font-semibold text-lg border-b border-border/50 pb-2">Client Info</h3>
            <div>
              <p className="font-medium">{svc.client.lead.name}</p>
              <p className="text-sm text-muted-foreground">{svc.client.lead.email}</p>
            </div>
            <Link href={`/admin/leads/${svc.client.leadId}`} className="text-sm text-primary hover:underline font-medium">
              View Client Profile
            </Link>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg border-b border-border/50 pb-2">Service Status</h3>
            <form action={updateStatus} className="space-y-4">
              <select name="status" defaultValue={svc.status} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="PROPOSED">Proposed</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <Button type="submit" size="sm" className="w-full">Update Status</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
