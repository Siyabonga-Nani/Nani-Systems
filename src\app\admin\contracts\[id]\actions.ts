"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendSecureClientLink } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function sendContractToClientAction(contractId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const contract = await db.contract.findUnique({
    where: { id: contractId },
    include: { quotation: { include: { lead: true } } }
  });

  if (!contract) throw new Error("Contract not found");

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/contract/${contract.token}`;

  await sendSecureClientLink(contract.quotation.lead.email, "Contract", link, contract.id);

  if (contract.status === "PENDING") {
    // Optionally update status to "SENT", though PENDING is fine.
    // For now we just log it as sent via the notification system.
  }

  revalidatePath(`/admin/contracts/${contract.id}`);
  return { success: true };
}
