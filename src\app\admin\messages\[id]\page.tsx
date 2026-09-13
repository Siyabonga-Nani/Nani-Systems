import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const msg = await db.contactMessage.findUnique({
    where: { id },
    include: { lead: true }
  });

  if (!msg) notFound();

  // Optionally, we could have a server action here to mark as read
  // But for now, we'll just display it.

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/messages" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Message Thread</h2>
        <Badge variant={msg.status === "UNREAD" ? "destructive" : "outline"}>{msg.status}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start border-b border-border/50 pb-4">
              <div>
                <h3 className="font-bold">{msg.name}</h3>
                <div className="text-sm text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</div>
              </div>
              <Badge variant="secondary">{msg.reason}</Badge>
            </div>
            <div className="pt-2">
              <p className="text-base whitespace-pre-wrap leading-relaxed">{msg.message}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <a href={`mailto:${msg.email}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Reply via Email
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/20 border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Sender Details</h3>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
              </div>
              {msg.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${msg.phone}`} className="hover:underline">{msg.phone}</a>
                </div>
              )}
              {msg.company && (
                <div className="flex items-center gap-3 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{msg.company}</span>
                </div>
              )}
            </div>
            
            {msg.leadId && (
              <div className="pt-4 border-t border-border/50">
                <Link href={`/admin/leads/${msg.leadId}`} className="text-sm font-medium text-primary hover:underline">
                  View Full Lead Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}