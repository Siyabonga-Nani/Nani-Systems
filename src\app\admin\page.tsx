import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, FileText, Calendar, MessageSquare, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const [leadCount, quoteCount, consultCount, messageCount] = await Promise.all([
    db.lead.count(),
    db.quoteRequest.count(),
    db.consultation.count(),
    db.contactMessage.count(),
  ]);

  const recentLeads = await db.lead.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { quotes: true, consultations: true, messages: true }
  });

  const unpaidInvoices = await db.invoice.findMany({
    where: { status: { in: ["PENDING", "PARTIALLY_PAID"] } },
    include: { client: { include: { lead: true } } },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const pendingContracts = await db.contract.findMany({
    where: { status: "SENT" },
    include: { quotation: { include: { lead: true } } },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">What needs your attention right now?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/leads">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadCount}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/requests">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quote Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quoteCount}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/consultations">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultCount}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/messages">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messageCount}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {unpaidInvoices.length > 0 && (
          <div className="bg-card border border-destructive/20 rounded-xl p-6">
            <h3 className="font-semibold text-destructive mb-4">Unpaid Invoices</h3>
            <div className="space-y-3">
              {unpaidInvoices.map(inv => (
                <div key={inv.id} className="flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium">{inv.invoiceNumber}</div>
                    <div className="text-muted-foreground">{inv.client.lead.name}</div>
                  </div>
                  <Link href={`/admin/invoices/${inv.id}`} className="text-primary hover:underline">View</Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingContracts.length > 0 && (
          <div className="bg-card border border-primary/20 rounded-xl p-6">
            <h3 className="font-semibold text-primary mb-4">Contracts Awaiting Signature</h3>
            <div className="space-y-3">
              {pendingContracts.map(c => (
                <div key={c.id} className="flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium">Contract for {c.quotation.lead.name}</div>
                    <div className="text-muted-foreground">Sent {new Date(c.createdAt).toLocaleDateString()}</div>
                  </div>
                  <Link href={`/admin/contracts/${c.id}`} className="text-primary hover:underline">View</Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Recent Leads</h3>
          <Link href="/admin/leads" className="text-sm font-medium text-primary hover:underline flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-border/50 hover:bg-secondary/10">
                  <td className="px-6 py-4 font-medium">
                    <Link href={`/admin/leads/${lead.id}`} className="hover:underline hover:text-primary">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {lead.email}
                  </td>
                  <td className="px-6 py-4">{lead.source}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{lead.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No leads found yet.
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