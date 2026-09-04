import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const req = await db.quoteRequest.findUnique({
    where: { id },
    include: { lead: true, quotation: true }
  });

  if (!req) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/requests" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Review Quote Request</h2>
        </div>
        
        {!req.quotation ? (
          <Link href={`/admin/quotes/new?leadId=${req.leadId}&requestId=${req.id}`} className={buttonVariants({ variant: "default" })}>
            Generate Formal Quotation
          </Link>
        ) : (
          <Link href={`/admin/quotes/${req.quotation.id}`} className={buttonVariants({ variant: "outline" })}>
            View Linked Quotation
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Core Requirements</h3>
              <p className="text-base whitespace-pre-wrap leading-relaxed">{req.requirements}</p>
            </div>
            
            {req.additionalInformation && (
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Additional Info / Links</h3>
                <p className="text-base break-words">{req.additionalInformation}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-2">Project Metadata</h3>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Service Requested</div>
              <Badge variant="secondary">{req.serviceId}</Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Project Type</div>
              <div className="font-medium text-sm">{req.projectType}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Timeline</div>
              <div className="font-medium text-sm">{req.desiredTimeline?.replace('_', ' ') || "Not specified"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Budget</div>
              <div className="font-medium text-sm">{req.budgetRange?.replace('_', ' ') || "Not specified"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <Badge variant={req.quotation ? "default" : "outline"}>{req.quotation ? "QUOTED" : req.status}</Badge>
            </div>
          </div>

          <div className="bg-secondary/20 border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Lead Information</h3>
            </div>
            <div>
              <div className="font-medium">{req.lead.name}</div>
              <div className="text-sm text-muted-foreground">{req.lead.email}</div>
              {req.lead.company && <div className="text-sm text-muted-foreground">{req.lead.company}</div>}
            </div>
            <Link href={`/admin/leads/${req.leadId}`} className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}>
              View Full Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}