"use server";

import { db } from "@/lib/db";
import { loginAccount } from "@/lib/accountAuth";
import { loginClient } from "@/lib/clientAuth";
import crypto from "crypto";

export async function registerAccountAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string || "").toLowerCase().trim();
  const password = formData.get("password") as string;
  const confirm = formData.get("confirmPassword") as string;

  if (!name || !email || !password) return { error: "All fields are required" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };
  if (password !== confirm) return { error: "Passwords do not match" };

  // Prevent Admin email takeover
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nanisystems.com";
  if (email === adminEmail.toLowerCase()) {
    return { error: "Invalid email address" };
  }

  try {
    const existingAccount = await db.account.findUnique({ where: { email } });
    if (existingAccount) return { error: "Account already exists" };

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedBuffer = crypto.scryptSync(password, salt, 64);
    const passwordHash = `${salt}:${hashedBuffer.toString("hex")}`;

    // Check if they are already a Client but just didn't have an Account model yet
    const existingLead = await db.lead.findFirst({
      where: { email },
      include: { client: true }
    });

    let clientId = null;
    let redirectPath = "/account";

    if (existingLead?.client) {
      clientId = existingLead.client.id;
      redirectPath = "/portal";
      
      // Update existing Client password to keep it in sync (for legacy flows if needed)
      await db.client.update({
        where: { id: clientId },
        data: { passwordHash }
      });
    }

    const account = await db.account.create({
      data: {
        email,
        name,
        passwordHash,
        clientId
      }
    });

    if (clientId) {
      await loginClient(clientId);
    } else {
      await loginAccount(account.id);
    }

    return { redirect: redirectPath };
  } catch (err) {
    return { error: "Error creating account" };
  }
}
