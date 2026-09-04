"use server";
import { db } from "@/lib/db";
import { sendInternalNotification } from "@/lib/notifications";

export async function acceptQuoteAction(quoteId: string) {
  try {
    await db.quotation.update({
      where: { id: quoteId },
      data: { status: "ACCEPTED" }
    });
    await sendInternalNotification("Quote Accepted", `Quote ${quoteId} was accepted by the client.`);
    return { success: true };
  } catch {
    return { success: false };
  }
}