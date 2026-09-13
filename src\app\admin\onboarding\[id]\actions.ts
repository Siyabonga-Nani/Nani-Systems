"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendSecureClientLink } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function sendOnboardingToClientAction(onboardingId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const ob = await db.projectOnboarding.findUnique({
    where: { id: onboardingId },
    include: { client: { include: { lead: true } } }
  });

  if (!ob) throw new Error("Onboarding not found");

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/${ob.token}`;

  await sendSecureClientLink(ob.client.lead.email, "Onboarding", link, ob.id);

  // Status doesn't change here typically, it stays PENDING until SUBMITTED.
  revalidatePath(`/admin/onboarding/${ob.id}`);
  return { success: true };
}
