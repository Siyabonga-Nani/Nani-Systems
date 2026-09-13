import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession, getSession } from "@/lib/auth";
import { updateClientSession, getClientSession } from "@/lib/clientAuth";
import { updateAccountSession, getAccountSession } from "@/lib/accountAuth";

export async function proxy(request: NextRequest) {
  let res = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    res = await updateSession(request) ?? res;
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else if (request.nextUrl.pathname.startsWith("/portal")) {
    await updateClientSession(request, res);
    
    // allow access to portal activation/login routes without auth
    if (request.nextUrl.pathname.startsWith("/portal/activate")) {
      return res;
    }

    const session = await getClientSession();
    if (!session || session.role !== "client") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else if (request.nextUrl.pathname.startsWith("/account")) {
    await updateAccountSession(request, res);

    const session = await getAccountSession();
    if (!session || session.role !== "account") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/account/:path*"],
};
