import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.ADMIN_SECRET;
if (!secretKey) throw new Error('ADMIN_SECRET environment variable is missing');
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) throw new Error('ADMIN_PASSWORD environment variable is missing');
  if (password !== adminPassword) {
    return false;
  }

  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ role: "admin", expires });

  // Save the session in a cookie
  (await cookies()).set("admin_session", session, { expires, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
  return true;
}

export async function logout() {
  (await cookies()).set("admin_session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("admin_session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  if (!session) return;

  try {
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
      name: "admin_session",
      value: await encrypt(parsed),
      httpOnly: true,
      expires: parsed.expires as Date,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    return res;
  } catch {
    return;
  }
}
