"use server";
import { db } from "@/lib/db";
import { sendInternalNotification, sendClientConfirmation } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function acceptQuoteAction(token: string) {
  try {
    const quote = await db.quotation.update({
      where: { token },
      data: { status: "ACCEPTED" },
      include: { lead: true }
    });
    
    if (quote) {
      await sendInternalNotification("Quote Accepted", `Quote ${quote.id} was accepted by the client.`, `quote_accepted_${quote.id}`);
      await sendClientConfirmation(
        quote.lead.email,
        "Quote Accepted",
        `Thank you for accepting the quote.\n\nWe will prepare your contract shortly.`,
        "Quotation",
        quote.id,
        `quote_accepted_client_${quote.id}`
      );
    }
    
    revalidatePath(`/proposal/${quote.token}`);
    return { success: true };
  } catch {
    return { success: false };
  }
}