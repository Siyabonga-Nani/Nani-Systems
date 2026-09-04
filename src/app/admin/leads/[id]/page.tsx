import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Phone, Building, Calendar, FileText, MessageSquare } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function LeadProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      quotes: { orderBy: { createdAt: "desc" } },
      consultations: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "desc" } },
      quotations: { orderBy: { createdAt: "desc" } },
      client: true,
    }
  });

  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/leads" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Lead Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Details */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{lead.name}</h3>
              <Badge variant="outline">{lead.status}</Badge>
            </div>
            {lead.client && (
              <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">Client</Badge>
            )}
          </div>
          
          <div className="space-y-4 pt-4 border-t border-border/50 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-4 w-4" /> <a href={`mailto:${lead.email}`} className="hover:text-foreground">{lead.email}</a>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4" /> <a href={`tel:${lead.phone}`} className="hover:text-foreground">{lead.phone}</a>
              </div>
            )}
            {lead.company && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Building className="h-4 w-4" /> <span>{lead.company}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-muted-foreground">
              <User className="h-4 w-4" /> <span>Source: {lead.source}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4 w-4" /> <span>Created: {new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Quote Requests */}
          {lead.quotes.length > 0 && (
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border/50 bg-secondary/10 flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4" /> Quote Requests
              </div>
              <div className="divide-y divide-border/50">
                {lead.quotes.map(req => (
                  <div key={req.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Service ID: {req.serviceId}</div>
                      <div className="text-xs text-muted-foreground mt-1">Project Type: {req.projectType} • {new Date(req.createdAt).toLocaleDateString()}</div>
                    </div>
                    <Link href={`/admin/requests/${req.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      View Request
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultations */}
          {lead.consultations.length > 0 && (
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border/50 bg-secondary/10 flex items-center gap-2 font-semibold">
                <Calendar className="h-4 w-4" /> Consultations
              </div>
              <div className="divide-y divide-border/50">
                {lead.consultations.map(cons => (
                  <div key={cons.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{cons.meetingType.replace('_', ' ').toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground mt-1">Requested: {cons.requestedDate || "Anytime"}</div>
                    </div>
                    <Link href={`/admin/consultations/${cons.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {lead.messages.length > 0 && (
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border/50 bg-secondary/10 flex items-center gap-2 font-semibold">
                <MessageSquare className="h-4 w-4" /> Contact Messages
              </div>
              <div className="divide-y divide-border/50">
                {lead.messages.map(msg => (
                  <div key={msg.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Reason: {msg.reason}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-md">{msg.message}</div>
                    </div>
                    <Link href={`/admin/messages/${msg.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      Read Message
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}