import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import SignContractForm from "./SignContractForm";

export default async function ClientContractPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const contract = await db.contract.findUnique({
    where: { token: params.token },
    include: { quotation: { include: { lead: true } } }
  });

  if (!contract) return notFound();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Nani Systems</h1>
          <p className="text-muted-foreground">Digital Service Agreement</p>
        </div>
        
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border/50">
            <h3 className="font-semibold text-lg mb-4">Terms & Conditions</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {contract.terms}
            </div>
          </div>
          
          <div className="p-8 bg-secondary/10">
            {contract.status === "PENDING" ? (
              <SignContractForm contractId={contract.id} expectedName={contract.quotation.lead.name} />
            ) : (
              <div className="text-center space-y-2">
                <Badge variant="default" className="bg-green-600">Electronically Signed</Badge>
                <p className="text-sm text-muted-foreground">
                  Signed by {contract.clientName} on {contract.signedAt ? new Date(contract.signedAt).toLocaleString() : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}