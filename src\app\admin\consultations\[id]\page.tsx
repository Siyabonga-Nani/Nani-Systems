import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, Video, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function ConsultationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const cons = await db.consultation.findUnique({
    where: { id },
    include: { lead: true }
  });

  if (!cons) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/consultations" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Consultation Details</h2>
        <Badge variant={cons.status === "REQUESTED" ? "default" : "outline"}>{cons.status}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Meeting Type</h3>
                <div className="flex items-center gap-2 text-lg font-medium">
                  {cons.meetingType.includes('meet') || cons.meetingType.includes('zoom') ? <Video className="h-5 w-5 text-primary" /> : <Phone className="h-5 w-5 text-primary" />}
                  {cons.meetingType.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Requested Time</h3>
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Calendar className="h-5 w-5 text-primary" />
                  {cons.requestedDate || "Flexible / Unspecified"}
                </div>
              </div>
            </div>
            
            {cons.notes && (
              <div className="pt-6 border-t border-border/50">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Meeting Notes</h3>
                <p className="text-base whitespace-pre-wrap leading-relaxed">{cons.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/20 border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Lead Information</h3>
            </div>
            <div>
              <div className="font-medium">{cons.lead.name}</div>
              <div className="text-sm text-muted-foreground">{cons.lead.email}</div>
              {cons.lead.phone && <div className="text-sm text-muted-foreground">{cons.lead.phone}</div>}
              {cons.lead.company && <div className="text-sm text-muted-foreground">{cons.lead.company}</div>}
            </div>
            <Link href={`/admin/leads/${cons.leadId}`} className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}>
              View Full Profile
            </Link>
            
            <a href={`mailto:${cons.lead.email}?subject=Regarding Your Consultation Request`} className={buttonVariants({ variant: "default", size: "sm", className: "w-full" })}>
              Email Lead
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}