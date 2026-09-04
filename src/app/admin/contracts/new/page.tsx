import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function NewContractPage(props: { searchParams: Promise<{ quoteId?: string }> }) {
  const searchParams = await props.searchParams;
  const quoteId = searchParams.quoteId;
  if (!quoteId) return notFound();

  const quote = await db.quotation.findUnique({
    where: { id: quoteId },
    include: { lead: true, contract: true }
  });

  if (!quote || quote.status !== "ACCEPTED") return notFound();
  
  if (quote.contract) {
    redirect(`/admin/contracts/${quote.contract.id}`);
  }

  async function generateContract() {
    "use server";
    const c = await db.contract.create({
      data: {
        quotationId: quoteId!,
        terms: "1. The services will be provided as outlined in the quotation.\n2. Payment is due according to the milestones.\n3. Intellectual property transfers upon full payment.",
      }
    });
    redirect(`/admin/contracts/${c.id}`);
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-center mt-20">
      <h2 className="text-3xl font-bold tracking-tight">Generate Contract</h2>
      <p className="text-muted-foreground">
        This will generate a standard Nani Systems contract based on Quotation {quote.id} for {quote.lead.name}.
      </p>
      
      <form action={generateContract}>
        <Button size="lg">Create Contract Document</Button>
      </form>
    </div>
  );
}