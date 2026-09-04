import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logAudit } from "@/lib/audit";

export default async function NewPaymentPage(props: { searchParams: Promise<{ invoiceId?: string }> }) {
  const searchParams = await props.searchParams;
  const invoiceId = searchParams.invoiceId;
  if (!invoiceId) return notFound();

  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) return notFound();

  async function logPayment(formData: FormData) {
    "use server";
    const amountStr = formData.get("amount") as string;
    const reference = formData.get("reference") as string;
    
    const currentInvoice = await db.invoice.findUnique({ where: { id: invoice!.id } });
    if (!currentInvoice) throw new Error("Invoice not found");

    const amount = parseFloat(amountStr);
    const amountDueVal = currentInvoice.amountDue.toNumber();
    if (amount <= 0 || amount > amountDueVal) {
      throw new Error("Invalid amount");
    }

    const result = await db.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          invoiceId: currentInvoice.id,
          amount,
          currency: currentInvoice.currency,
          method: "EFT",
          reference,
          status: "SUCCESS"
        }
      });

      const newAmountPaid = currentInvoice.amountPaid.plus(newPayment.amount);
      const newAmountDue = currentInvoice.total.minus(newAmountPaid);
      const newStatus = newAmountDue.lte(0) ? "PAID" : "PARTIALLY_PAID";

      await tx.invoice.update({
        where: { id: currentInvoice.id },
        data: {
          amountPaid: newAmountPaid,
          amountDue: newAmountDue,
          status: newStatus
        }
      });

      return newPayment;
    });

    await logAudit({
      actorType: 'ADMIN',
      action: 'MANUAL_PAYMENT_LOGGED',
      entityType: 'Payment',
      entityId: result.id,
      newState: { amount: result.amount, reference, invoiceId: currentInvoice.id }
    });

    redirect('/admin/invoices/' + currentInvoice.id);
  }

  return (
    <div className="space-y-8 max-w-lg mx-auto mt-20 bg-card p-8 rounded-2xl border border-border/50">
      <h2 className="text-2xl font-bold tracking-tight">Log Manual EFT Payment</h2>
      <p className="text-muted-foreground text-sm">
        Record a payment received via bank transfer for Invoice {invoice.invoiceNumber}.
      </p>
      
      <form action={logPayment} className="space-y-4">
        <div className="space-y-2">
          <Label>Amount Received ({invoice.currency})</Label>
          <Input name="amount" type="number" step="0.01" max={invoice.amountDue.toString()} required defaultValue={invoice.amountDue.toString()} />
        </div>
        <div className="space-y-2">
          <Label>Bank Reference / Memo</Label>
          <Input name="reference" required placeholder="e.g. EFT 2026-08-31" />
        </div>
        <Button size="lg" className="w-full">Record Payment</Button>
      </form>
    </div>
  );
}
