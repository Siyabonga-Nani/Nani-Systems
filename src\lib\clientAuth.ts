import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.ADMIN_SECRET;
if (!secretKey) throw new Error('ADMIN_SECRET environment variable is missing');
const key = new TextEncoder().encode(secretKey + "_client_portal_salt");

export async function encryptClient(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decryptClient(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function loginClient(clientId: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encryptClient({ role: "client", clientId, expires });

  (await cookies()).set("client_session", session, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax" 
  });
  return true;
}

export async function logoutClient() {
  (await cookies()).set("client_session", "", { expires: new Date(0) });
}

export async function getClientSession() {
  const session = (await cookies()).get("client_session")?.value;
  if (!session) return null;
  try {
    const payload = await decryptClient(session);
    if (payload.role !== "client") return null;
    return payload as { role: "client", clientId: string, expires: string | Date };
  } catch {
    return null;
  }
}

export async function updateClientSession(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("client_session")?.value;
  if (!session) return;

  try {
    const parsed = await decryptClient(session);
    if (parsed.role !== "client") return;
    
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    response.cookies.set({
      name: "client_session",
      value: await encryptClient(parsed),
      httpOnly: true,
      expires: parsed.expires as Date,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
  } catch {
    return;
  }
}
