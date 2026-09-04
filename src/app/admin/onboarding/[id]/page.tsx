import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function OnboardingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const ob = await db.projectOnboarding.findUnique({
    where: { id },
    include: { client: { include: { lead: true } }, contract: true }
  });

  if (!ob) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/onboarding" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Project Onboarding</h2>
        <Badge variant={ob.status === "SUBMITTED" ? "default" : "outline"} className={ob.status === "SUBMITTED" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
          {ob.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg border-b border-border/50 pb-2">Client Link</h3>
            <p className="text-sm text-muted-foreground">Share this secure, one-time link with the client to collect their project requirements.</p>
            <div className="flex gap-2">
              <code className="flex-1 bg-secondary/30 p-2 rounded-md text-xs truncate select-all">
                {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/onboarding/{ob.token}
              </code>
            </div>
            {/* Note: In a real app we'd add a "Copy" button client-side component here */}
          </div>

          {ob.status === "SUBMITTED" ? (
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business Context</h3>
                <p className="text-base whitespace-pre-wrap leading-relaxed">{ob.businessContext || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Project Objectives</h3>
                <p className="text-base whitespace-pre-wrap leading-relaxed">{ob.projectObjectives || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Services & Features Required</h3>
                <p className="text-base whitespace-pre-wrap leading-relaxed">{ob.servicesRequired || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Target Audience</h3>
                  <p className="text-sm">{ob.targetAudience || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Competitors</h3>
                  <p className="text-sm">{ob.competitors || "N/A"}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Brand Guidelines & Resources</h3>
                <p className="text-base break-words text-primary hover:underline">
                  {ob.brandGuidelines ? <a href={ob.brandGuidelines} target="_blank" rel="noopener noreferrer">{ob.brandGuidelines}</a> : "N/A"}
                </p>
                <p className="text-base break-words text-primary hover:underline mt-2">
                  {ob.resourceLinks ? <a href={ob.resourceLinks} target="_blank" rel="noopener noreferrer">{ob.resourceLinks}</a> : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Existing Domain</h3>
                <p className="text-sm">{ob.existingDomain || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Design Direction</h3>
                <p className="text-base whitespace-pre-wrap">{ob.designDirection || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Technical / Integrations</h3>
                <p className="text-sm">{ob.technicalRequirements || "N/A"}</p>
                <p className="text-sm mt-2">{ob.importantIntegrations || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Content Readiness</h3>
                <p className="text-sm">{ob.contentReadiness || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Additional Notes</h3>
                <p className="text-base whitespace-pre-wrap">{ob.additionalNotes || "N/A"}</p>
              </div>
            </div>
          ) : (
            <div className="bg-secondary/10 border border-border/50 rounded-xl p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <p>Waiting for the client to submit their onboarding requirements.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/20 border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Client Info</h3>
            </div>
            <div>
              <div className="font-medium">{ob.client.lead.name}</div>
              <div className="text-sm text-muted-foreground">{ob.client.lead.email}</div>
              {ob.client.lead.company && <div className="text-sm text-muted-foreground">{ob.client.lead.company}</div>}
            </div>
            <Link href={`/admin/leads/${ob.client.leadId}`} className="text-sm font-medium text-primary hover:underline">
              View Full Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}