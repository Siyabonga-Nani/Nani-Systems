"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendSecureClientLink } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function sendInvoiceToClientAction(invoiceId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: { client: { include: { lead: true } } }
  });

  if (!invoice) throw new Error("Invoice not found");

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.token}`;

  await sendSecureClientLink(invoice.client.lead.email, "Invoice", link, invoice.id);

  if (invoice.status === "DRAFT") {
    await db.invoice.update({
      where: { id: invoice.id },
      data: { status: "SENT" }
    });
  }

  revalidatePath(`/admin/invoices/${invoice.id}`);
  return { success: true };
}
