import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.ADMIN_SECRET;
if (!secretKey) throw new Error('ADMIN_SECRET environment variable is missing');
const key = new TextEncoder().encode(secretKey + "_account_salt");

export async function encryptAccount(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decryptAccount(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function loginAccount(accountId: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encryptAccount({ role: "account", accountId, expires });

  (await cookies()).set("account_session", session, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax" 
  });
  return true;
}

export async function logoutAccount() {
  (await cookies()).set("account_session", "", { expires: new Date(0) });
}

export async function getAccountSession() {
  const session = (await cookies()).get("account_session")?.value;
  if (!session) return null;
  try {
    const payload = await decryptAccount(session);
    if (payload.role !== "account") return null;
    return payload as { role: "account", accountId: string, expires: string | Date };
  } catch {
    return null;
  }
}

export async function updateAccountSession(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("account_session")?.value;
  if (!session) return;

  try {
    const parsed = await decryptAccount(session);
    if (parsed.role !== "account") return;
    
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    response.cookies.set({
      name: "account_session",
      value: await encryptAccount(parsed),
      httpOnly: true,
      expires: parsed.expires as Date,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
  } catch {
    return;
  }
}
