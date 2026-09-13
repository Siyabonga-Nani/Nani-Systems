"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendSecureClientLink } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function sendQuoteToClientAction(quoteId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const quote = await db.quotation.findUnique({
    where: { id: quoteId },
    include: { lead: true }
  });

  if (!quote) throw new Error("Quote not found");

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/proposal/${quote.token}`;

  await sendSecureClientLink(quote.lead.email, "Proposal", link, quote.id);

  if (quote.status === "DRAFT") {
    await db.quotation.update({
      where: { id: quote.id },
      data: { status: "SENT" }
    });
  }

  revalidatePath(`/admin/quotes/${quote.id}`);
  return { success: true };
}
