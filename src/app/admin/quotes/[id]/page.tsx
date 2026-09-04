/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function QuoteViewPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const quote = await db.quotation.findUnique({
    where: { id: params.id },
    include: { lead: true }
  });

  if (!quote) return notFound();

  const items = JSON.parse(quote.lineItems);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quotation Details</h2>
          <p className="text-muted-foreground">ID: {quote.id}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <Link href={`/proposal/${quote.token}`} target="_blank">View Client Link</Link>
          </Button>
          {quote.status === "ACCEPTED" && (
            <Button>
              <Link href={`/admin/contracts/new?quoteId=${quote.id}`}>Generate Contract</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-border/50 p-6 rounded-xl">
          <h3 className="font-semibold text-lg mb-4">Client Information</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {quote.lead.name}</p>
            <p><span className="text-muted-foreground">Email:</span> {quote.lead.email}</p>
            {quote.lead.company && <p><span className="text-muted-foreground">Company:</span> {quote.lead.company}</p>}
          </div>
        </div>

        <div className="bg-card border border-border/50 p-6 rounded-xl">
          <h3 className="font-semibold text-lg mb-4">Quote Meta</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Status:</span> <Badge>{quote.status}</Badge></p>
            <p><span className="text-muted-foreground">Created:</span> {new Date(quote.createdAt).toLocaleDateString()}</p>
            <p><span className="text-muted-foreground">Valid Until:</span> {new Date(quote.validUntil).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h3 className="font-semibold text-lg">Financials</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
            <tr>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Qty</th>
              <th className="px-6 py-3">Unit Price</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: Record<string, any>, i: number) => (
              <tr key={i} className="border-b border-border/50">
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">{quote.currency} {item.unitPrice.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">{quote.currency} {(item.quantity * item.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 bg-secondary/10 text-right space-y-2">
          <p className="text-muted-foreground">Subtotal: {quote.currency} {quote.subtotal.toLocaleString()}</p>
          <p className="text-muted-foreground">Tax: {quote.currency} {quote.taxAmount.toLocaleString()}</p>
          <p className="text-2xl font-bold text-foreground">Total: {quote.currency} {quote.total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}