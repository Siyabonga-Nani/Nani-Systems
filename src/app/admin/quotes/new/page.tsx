import { db } from "@/lib/db";
import QuoteForm from "./QuoteForm";

export default async function NewQuotePage({ searchParams }: { searchParams: Promise<{ leadId?: string, requestId?: string }> }) {
  const params = await searchParams;
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Quotation</h2>
        <p className="text-muted-foreground">Draft a new quote for a lead.</p>
      </div>
      
      <QuoteForm leads={leads} defaultLeadId={params.leadId} defaultRequestId={params.requestId} />
    </div>
  );
}