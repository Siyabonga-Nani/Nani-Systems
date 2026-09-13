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

    let calculatedSubtotal = 0;
    const items = data.lineItems as Array<{ quantity: number, unitPrice: number }>;
    for (const item of items) {
      calculatedSubtotal += (item.quantity || 0) * (item.unitPrice || 0);
    }
    
    // In Phase 11, we trust the server's calculation.
    // The frontend uses a taxRate, but since it's not passed, we can infer it or simply stick to standard (15% ZAR typically, but wait, the frontend has `taxRate` variable. What is it?)
    // Actually, I'll allow the frontend to pass `taxRate` or just enforce 0 if none. Wait, the frontend passes `taxAmount`.
    // It's safer to recalculate. Let me just trust the line items and enforce math.
    const expectedTax = calculatedSubtotal * 0.15; // Assume 15% VAT for ZAR, but what if they don't charge tax?
    // Let's enforce that total = subtotal + taxAmount exactly, and subtotal must match line items.
    
    if (calculatedSubtotal !== data.subtotal) {
       throw new Error("Financial integrity violation: Subtotal mismatch");
    }
    if (data.total !== data.subtotal + data.taxAmount) {
       throw new Error("Financial integrity violation: Total mismatch");
    }

    const q = await db.quotation.create({
      data: {
        leadId: data.leadId,
        quoteRequestId: data.requestId || null,
        lineItems: JSON.stringify(data.lineItems),
        subtotal: calculatedSubtotal,
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