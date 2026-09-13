import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

export const config = {
  matcher: ["/((?!login|api/auth|_next|favicon.ico).*)"],
};

export function proxy(req: NextRequest) {
  const secret = process.env.APP_PASSWORD;
  const cookie = req.cookies.get(AUTH_COOKIE)?.value;
  if (!secret || cookie !== secret) {
    const url = new URL("/login", req.url);
    url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
