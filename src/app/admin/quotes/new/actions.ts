"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function createQuoteAction(data: {
  leadId: string;
  requestId?: string;
  lineItems: Record<string, unknown>[];
  subtotal: number;
  taxAmount: number;
  total: number;
}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 14);

    const q = await db.quotation.create({
      data: {
        leadId: data.leadId,
        quoteRequestId: data.requestId || null,
        lineItems: JSON.stringify(data.lineItems),
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        total: data.total,
        validUntil,
      }
    });

    return { success: true, id: q.id };
  } catch (error) {
    return { success: false, message: "Failed to create quotation" };
  }
}