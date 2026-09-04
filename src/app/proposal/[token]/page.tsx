/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AcceptQuoteButton from "./AcceptQuoteButton";

export default async function ClientProposalPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const quote = await db.quotation.findUnique({
    where: { token: params.token },
    include: { lead: true }
  });

  if (!quote) return notFound();

  const items = JSON.parse(quote.lineItems);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Nani Systems</h1>
          <p className="text-muted-foreground">Official Proposal & Quotation</p>
        </div>
        
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border/50 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Prepared For</p>
              <p className="font-semibold">{quote.lead.name}</p>
              {quote.lead.company && <p className="text-sm">{quote.lead.company}</p>}
            </div>
            <div className="md:text-right">
              <p className="text-sm text-muted-foreground mb-1">Details</p>
              <p className="font-semibold">{quote.title}</p>
              <p className="text-sm">Valid Until: {new Date(quote.validUntil).toLocaleDateString()}</p>
              <Badge variant="outline" className="mt-2">{quote.status}</Badge>
            </div>
          </div>
          
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-8 py-4">Description</th>
                <th className="px-8 py-4">Qty</th>
                <th className="px-8 py-4">Unit Price</th>
                <th className="px-8 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: Record<string, any>, i: number) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-8 py-6">{item.description}</td>
                  <td className="px-8 py-6">{item.quantity}</td>
                  <td className="px-8 py-6">{quote.currency} {item.unitPrice.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right">{quote.currency} {(item.quantity * item.unitPrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="p-8 bg-secondary/10 flex flex-col items-end gap-2">
            <p className="text-muted-foreground">Subtotal: {quote.currency} {quote.subtotal.toLocaleString()}</p>
            <p className="text-muted-foreground">Tax: {quote.currency} {quote.taxAmount.toLocaleString()}</p>
            <p className="text-3xl font-bold mt-2">Total: {quote.currency} {quote.total.toLocaleString()}</p>
          </div>
        </div>

        {quote.status === "DRAFT" || quote.status === "SENT" ? (
          <div className="text-center pt-8">
            <AcceptQuoteButton quoteId={quote.id} />
            <p className="text-xs text-muted-foreground mt-4">
              By accepting this quote, you agree to proceed to the contracting phase.
            </p>
          </div>
        ) : (
          <div className="text-center pt-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              This quote has been {quote.status.toLowerCase()}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}