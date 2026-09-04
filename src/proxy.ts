import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession, getSession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // Update session expiration on every request
  const res = await updateSession(request) ?? NextResponse.next();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.nextUrl.pathname === "/admin/login") {
      return res;
    }

    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
