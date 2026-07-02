import { NextResponse, type NextRequest } from "next/server";
import { DEV_ADMIN_COOKIE, isDevAdminEnabled } from "@/lib/auth/devAdmin";
import { getSafeReturnPath } from "@/lib/auth/redirects";

function getRequestOrigin(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "") || "http";
  return `${proto}://${host}`;
}

export async function GET(request: NextRequest) {
  if (!isDevAdminEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const requestUrl = new URL(request.url);
  const returnUrl = getSafeReturnPath(requestUrl.searchParams.get("returnUrl"), "/admin");
  const safeReturnUrl =
    returnUrl.startsWith("/admin") && !returnUrl.startsWith("/admin/login") && !returnUrl.startsWith("/admin/dev-login")
      ? returnUrl
      : "/admin";
  const response = NextResponse.redirect(new URL(safeReturnUrl, getRequestOrigin(request)));

  response.cookies.set(DEV_ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
