"use server";

import { db } from "@/lib/db";
import { loginClient } from "@/lib/clientAuth";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function activatePortalAction(token: string, prevState: string | null, formData: FormData) {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) return "Password must be at least 8 characters";
  if (password !== confirm) return "Passwords do not match";

  try {
    const client = await db.client.findUnique({
      where: { portalToken: token }
    });

    if (!client) return "Invalid or expired activation link";

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedBuffer = crypto.scryptSync(password, salt, 64);
    const passwordHash = `${salt}:${hashedBuffer.toString("hex")}`;

    await db.client.update({
      where: { id: client.id },
      data: {
        passwordHash,
        portalToken: null // One-time use
      }
    });

    // Create or update Account
    const lead = await db.lead.findUnique({ where: { id: client.leadId } });
    if (lead) {
      await db.account.upsert({
        where: { email: lead.email },
        update: {
          passwordHash,
          clientId: client.id
        },
        create: {
          email: lead.email,
          name: lead.name,
          passwordHash,
          clientId: client.id
        }
      });
    }

    await loginClient(client.id);
  } catch (err) {
    return "Error activating account";
  }

  redirect("/portal");
}
