"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateLeadStatus(leadId: string, newStatus: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const validStatuses = ["NEW", "CONTACTED", "QUALIFIED", "LOST"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  await db.lead.update({
    where: { id: leadId },
    data: { status: newStatus }
  });

  revalidatePath(`/admin/leads`);
  revalidatePath(`/admin/leads/${leadId}`);
  
  return { success: true };
}

import { sendInternalNotification } from "@/lib/notifications"; // Fallback to send the link if not fully configured

export async function sendPortalInviteAction(clientId: string, prevState: string | null, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") return "Unauthorized";

  try {
    const client = await db.client.findUnique({
      where: { id: clientId },
      include: { lead: true }
    });
    if (!client) return "Client not found";

    // Generate token
    const portalToken = crypto.randomUUID();

    await db.client.update({
      where: { id: clientId },
      data: { portalToken }
    });

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/portal/activate/${portalToken}`;
    
    // Use the existing email sending logic
    const { sendSecureClientLink } = await import("@/lib/notifications");
    await sendSecureClientLink(
      client.lead.email,
      "Onboarding", // Hack: repurpose Onboarding type for Portal Invites
      link,
      clientId
    );

    revalidatePath(`/admin/leads/${client.leadId}`);
    return null; // success
  } catch (err) {
    return "Error sending invite";
  }
}
