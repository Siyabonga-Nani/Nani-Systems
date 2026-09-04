"use server";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { sendInternalNotification } from "@/lib/notifications";

export async function signContractAction(contractId: string, formData: FormData) {
  try {
    const signatureName = formData.get("signatureName") as string;
    const signatureEmail = formData.get("signatureEmail") as string;
    
    // Attempt to extract IP for audit
    const h = await headers();
    const ip = h.get("x-forwarded-for") || h.get("x-real-ip") || "Unknown IP";

    const c = await db.contract.update({
      where: { id: contractId },
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
    await db.client.upsert({
      where: { leadId: c.quotation.lead.id },
      create: { leadId: c.quotation.lead.id },
      update: {}
    });

    await sendInternalNotification("Contract Signed", `Contract ${contractId} was signed by ${signatureName}.`);
    return { success: true };
  } catch {
    return { success: false };
  }
}