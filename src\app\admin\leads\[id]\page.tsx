import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Phone, Building, Calendar, FileText, MessageSquare, CreditCard, Box, Settings } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

import { LeadStatusSelect } from "./LeadStatusSelect";
import { ClientPortalInvite } from "./ClientPortalInvite";

export default async function LeadProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      quotes: { orderBy: { createdAt: "desc" } },
      consultations: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "desc" } },
      quotations: { orderBy: { createdAt: "desc" } },
      client: {
        include: {
          invoices: { orderBy: { createdAt: "desc" } },
          onboardings: { orderBy: { createdAt: "desc" }, include: { contract: true } },
          ongoingServices: { orderBy: { createdAt: "desc" } }
        }
      },
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
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{lead.name}</h3>
              <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
            </div>
            {lead.client && (
              <div className="flex flex-col items-end gap-2">
                <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">Client</Badge>
                <ClientPortalInvite clientId={lead.client.id} hasPassword={!!lead.client.passwordHash} portalToken={lead.client.portalToken} />
              </div>
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

          {/* Formal Quotations */}
          {lead.quotations.length > 0 && (
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border/50 bg-secondary/10 flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4" /> Formal Quotations
              </div>
              <div className="divide-y divide-border/50">
                {lead.quotations.map(quote => (
                  <div key={quote.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{quote.title} - {quote.currency} {quote.total.toString()}</div>
                      <div className="text-xs text-muted-foreground mt-1">Status: {quote.status} • {new Date(quote.createdAt).toLocaleDateString()}</div>
                    </div>
                    <Link href={`/admin/quotes/${quote.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      View Quote
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ongoing Services */}
          {lead.client && (
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm border-primary/20">
              <div className="p-4 border-b border-border/50 bg-primary/5 flex items-center justify-between font-semibold text-primary">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Ongoing Managed Services
                </div>
                <Link href={`/admin/services/new?clientId=${lead.client.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "h-7 text-xs" })}>
                  Add Service
                </Link>
              </div>
              <div className="divide-y divide-border/50">
                {lead.client.ongoingServices && lead.client.ongoingServices.length > 0 ? (
                  lead.client.ongoingServices.map(svc => (
                    <div key={svc.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{svc.serviceType}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <Badge variant="outline" className="mr-2 text-[10px] uppercase tracking-wider">{svc.status}</Badge>
                          Since {svc.startDate ? new Date(svc.startDate).toLocaleDateString() : 'Pending'}
                        </div>
                      </div>
                      <Link href={`/admin/services/${svc.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        View
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No active managed services.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Projects / Onboardings */}
          {lead.client && lead.client.onboardings && lead.client.onboardings.length > 0 && (
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border/50 bg-secondary/10 flex items-center gap-2 font-semibold">
                <Box className="h-4 w-4" /> Projects & Onboarding
              </div>
              <div className="divide-y divide-border/50">
                {lead.client.onboardings.map(proj => (
                  <div key={proj.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Project Onboarding</div>
                      <div className="text-xs text-muted-foreground mt-1">Status: {proj.status} • {new Date(proj.createdAt).toLocaleDateString()}</div>
                    </div>
                    <Link href={`/admin/onboarding/${proj.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      View Project
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {lead.client && lead.client.invoices && lead.client.invoices.length > 0 && (
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border/50 bg-secondary/10 flex items-center gap-2 font-semibold">
                <CreditCard className="h-4 w-4" /> Commercial Invoices
              </div>
              <div className="divide-y divide-border/50">
                {lead.client.invoices.map(inv => (
                  <div key={inv.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{inv.invoiceNumber} - {inv.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {inv.currency} {inv.total.toString()} • Status: <Badge variant="outline" className="text-[10px] leading-none uppercase">{inv.status}</Badge>
                      </div>
                    </div>
                    <Link href={`/admin/invoices/${inv.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                      View Invoice
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