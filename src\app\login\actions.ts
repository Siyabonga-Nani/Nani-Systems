"use server";

import { db } from "@/lib/db";
import { login } from "@/lib/auth";
import { loginClient } from "@/lib/clientAuth";
import { loginAccount } from "@/lib/accountAuth";
import crypto from "crypto";

export async function unifiedLoginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password required" };

  // 1. Admin Check
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nanisystems.com";
  if (email.toLowerCase() === adminEmail.toLowerCase()) {
    const success = await login(password);
    if (success) {
      return { redirect: "/admin" };
    }
    return { error: "Invalid credentials" };
  }

  // 2. Account Check
  const account = await db.account.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (account) {
    if (!verifyPassword(password, account.passwordHash)) {
      return { error: "Invalid credentials" };
    }

    if (account.clientId) {
      await loginClient(account.clientId);
      return { redirect: "/portal" };
    } else {
      await loginAccount(account.id);
      return { redirect: "/account" };
    }
  }

  // 3. Fallback: Old Client Check (for clients activated before Account model)
  const lead = await db.lead.findFirst({
    where: { email: email.toLowerCase() },
    include: { client: true }
  });

  if (lead?.client?.passwordHash) {
    if (!verifyPassword(password, lead.client.passwordHash)) {
      return { error: "Invalid credentials" };
    }
    
    // Auto-migrate to Account to unify identity
    const newAccount = await db.account.create({
      data: {
        email: email.toLowerCase(),
        name: lead.name,
        passwordHash: lead.client.passwordHash,
        clientId: lead.client.id
      }
    });

    await loginClient(lead.client.id);
    return { redirect: "/portal" };
  }

  return { error: "Invalid credentials" };
}

function verifyPassword(password: string, hashString: string): boolean {
  try {
    const [salt, key] = hashString.split(":");
    const hashedBuffer = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    return crypto.timingSafeEqual(hashedBuffer, keyBuffer);
  } catch (e) {
    return false;
  }
}
