"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { sendInternalNotification, sendClientConfirmation } from "@/lib/notifications";

export async function signContractAction(token: string, formData: FormData) {
  try {
    const signatureName = formData.get("signatureName") as string;
    const signatureEmail = formData.get("signatureEmail") as string;
    
    // Attempt to extract IP for audit
    const h = await headers();
    const ip = h.get("x-forwarded-for") || h.get("x-real-ip") || "Unknown IP";

    const c = await db.contract.update({
      where: { token },
      data: { 
        status: "SIGNED",
        clientName: signatureName,
        clientEmail: signatureEmail,
        clientIp: ip,
        signedAt: new Date()
      },
      include: { quotation: { include: { lead: true } } }
    });

    // Also upgrade the Lead to a Client
    const client = await db.client.upsert({
      where: { leadId: c.quotation.lead.id },
      create: { leadId: c.quotation.lead.id },
      update: {}
    });

    // Link Account if they already registered
    await db.account.updateMany({
      where: { email: c.quotation.lead.email },
      data: { clientId: client.id }
    });

    revalidatePath(`/contract/${token}`);
    await sendInternalNotification("Contract Signed", `Contract ${c.id} was signed by ${signatureName}.`, `contract_signed_${c.id}`);
    
    await sendClientConfirmation(
      c.clientEmail || c.quotation.lead.email,
      "Contract Signed - Nani Systems",
      `Hello ${signatureName},\n\nThank you for signing the contract. Your digital signature has been securely recorded.\n\nWe will send your invoice shortly.\n\nThank you,\nNani Systems`,
      "Contract",
      c.id,
      `contract_signed_client_${c.id}`
    );

    return { success: true };
  } catch {
    return { success: false };
  }
}