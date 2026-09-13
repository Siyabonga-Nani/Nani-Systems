import { db } from "@/lib/db";
import { getClientSession } from "@/lib/clientAuth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard, Activity, CheckCircle, Package } from "lucide-react";

export default async function ClientPortalDashboard() {
  const session = await getClientSession();
  if (!session) redirect("/login");

  const client = await db.client.findUnique({
    where: { id: session.clientId },
    include: {
      lead: { include: { quotations: true } },
      invoices: { orderBy: { createdAt: "desc" } },
      onboardings: true,
      ongoingServices: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!client) redirect("/login");

  const quotes = client.lead.quotations;
  const pendingQuotes = quotes.filter((q: any) => q.status === "SENT");
  const unpaidInvoices = client.invoices.filter((i: any) => i.status === "PENDING" || i.status === "PARTIALLY_PAID");
  
  // To get contracts, we need them from quotes
  const quoteIds = quotes.map((q: any) => q.id);
  const contracts = await db.contract.findMany({
    where: { quotationId: { in: quoteIds } },
    include: { quotation: true }
  });
  const pendingContracts = contracts.filter((c: any) => c.status === "SENT");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {client.lead.name}</h1>
        <p className="text-muted-foreground mt-1">Manage your active projects, view invoices, and track services.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pendingQuotes.length > 0 && (
          <div className="p-6 bg-card rounded-2xl border border-primary/20 space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <FileText className="w-5 h-5" />
              <h2 className="font-semibold">Quotes Awaiting Review</h2>
            </div>
            <p className="text-sm text-muted-foreground">You have {pendingQuotes.length} quotation(s) awaiting your approval.</p>
            <div className="space-y-2">
              {pendingQuotes.map((q: any) => (
                <Link key={q.id} href={`/proposal/${q.token}`} className="block">
                  <Button variant="outline" className="w-full justify-start">View Quote</Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {pendingContracts.length > 0 && (
          <div className="p-6 bg-card rounded-2xl border border-primary/20 space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <FileText className="w-5 h-5" />
              <h2 className="font-semibold">Contracts Awaiting Signature</h2>
            </div>
            <p className="text-sm text-muted-foreground">You have {pendingContracts.length} contract(s) awaiting your signature.</p>
            <div className="space-y-2">
              {pendingContracts.map((c: any) => (
                <Link key={c.id} href={`/contract/${c.token}`} className="block">
                  <Button variant="outline" className="w-full justify-start">Sign Contract</Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {unpaidInvoices.length > 0 && (
          <div className="p-6 bg-card rounded-2xl border border-destructive/20 space-y-4">
            <div className="flex items-center space-x-2 text-destructive">
              <CreditCard className="w-5 h-5" />
              <h2 className="font-semibold">Outstanding Invoices</h2>
            </div>
            <p className="text-sm text-muted-foreground">You have {unpaidInvoices.length} unpaid invoice(s).</p>
            <div className="space-y-2">
              {unpaidInvoices.map((i: any) => (
                <div key={i.id} className="flex flex-col space-y-2 border border-border/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{i.invoiceNumber}</span>
                    <span className="font-bold">{i.currency} {i.amountDue.toString()}</span>
                  </div>
                  <Link href={`/invoice/${i.token}`} className="block">
                    <Button variant="destructive" size="sm" className="w-full">Pay Now</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {client.onboardings.length > 0 && (
          <div className="p-6 bg-card rounded-2xl border border-border/50 space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-semibold">Active Projects</h2>
            </div>
            <div className="space-y-3">
              {client.onboardings.map((o: any) => (
                <div key={o.id} className="p-4 bg-secondary/10 rounded-lg border border-border/50 flex flex-col space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Project Onboarding</div>
                      <div className="text-xs text-muted-foreground mt-1">Started: {o.createdAt.toLocaleDateString()}</div>
                    </div>
                    {o.status === "PENDING" ? (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/20">Pending Intake</Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-500 border-green-500/20">Intake Received</Badge>
                    )}
                  </div>
                  {o.status === "PENDING" && (
                    <Link href={`/onboarding/${o.token}`} className="block mt-2">
                      <Button size="sm" variant="secondary" className="w-full">Complete Intake Form</Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 bg-card rounded-2xl border border-border/50 space-y-4 md:col-span-2 lg:col-span-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold">Ongoing Services</h2>
          </div>
          {client.ongoingServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">You have no active ongoing services.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {client.ongoingServices.map((s: any) => (
                <div key={s.id} className="p-4 bg-secondary/10 rounded-lg border border-border/50 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{s.serviceType}</div>
                    <div className="text-xs text-muted-foreground mt-1">Started: {s.startDate ? s.startDate.toLocaleDateString() : "Pending"}</div>
                  </div>
                  <Badge variant={s.status === "ACTIVE" ? "default" : "secondary"}>{s.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
