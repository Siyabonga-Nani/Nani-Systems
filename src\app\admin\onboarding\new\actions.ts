"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function createOnboardingAction(data: {
  clientId: string;
  contractId?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const ob = await db.projectOnboarding.create({
      data: {
        clientId: data.clientId,
        contractId: data.contractId || null,
      }
    });
    return { success: true, id: ob.id };
  } catch (error) {
    return { success: false, message: "Failed to create onboarding session. Ensure contract doesn't already have one." };
  }
}