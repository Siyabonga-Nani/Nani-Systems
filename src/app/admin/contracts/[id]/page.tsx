import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminContractView(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const contract = await db.contract.findUnique({
    where: { id: params.id },
    include: { quotation: { include: { lead: true } } }
  });

  if (!contract) return notFound();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contract Document</h2>
          <p className="text-muted-foreground">ID: {contract.id}</p>
        </div>
        <div className="flex gap-4">
          <Link href={`/contract/${contract.token}`} target="_blank" className={buttonVariants({ variant: "outline" })}>View Client Link</Link>
          {contract.status === "SIGNED" && (
            <Link href={`/admin/invoices/new?contractId=${contract.id}`} className={buttonVariants({ variant: "default" })}>Generate Invoice</Link>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-border/50 p-6 rounded-xl">
          <h3 className="font-semibold text-lg mb-4">Meta</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Status:</span> <Badge>{contract.status}</Badge></p>
            <p><span className="text-muted-foreground">Client:</span> {contract.quotation.lead.name}</p>
          </div>
        </div>

        <div className="bg-card border border-border/50 p-6 rounded-xl">
          <h3 className="font-semibold text-lg mb-4">Audit Log</h3>
          <div className="space-y-2 text-sm">
            {contract.signedAt ? (
              <>
                <p><span className="text-muted-foreground">Signed By:</span> {contract.clientName}</p>
                <p><span className="text-muted-foreground">Email:</span> {contract.clientEmail}</p>
                <p><span className="text-muted-foreground">Timestamp:</span> {new Date(contract.signedAt).toLocaleString()}</p>
                <p><span className="text-muted-foreground">IP Address:</span> {contract.clientIp}</p>
              </>
            ) : (
              <p className="text-muted-foreground">Not signed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}