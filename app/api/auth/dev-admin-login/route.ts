import { NextResponse } from "next/server";
import { DEV_ADMIN_COOKIE, isDevAdminCredential, isDevAdminEnabled } from "@/lib/auth/devAdmin";
import { getSafeReturnPath } from "@/lib/auth/redirects";

type DevAdminLoginBody = {
  email?: unknown;
  password?: unknown;
  returnUrl?: unknown;
};

export async function POST(request: Request) {
  if (!isDevAdminEnabled()) {
    return NextResponse.json({ error: "Acceso local deshabilitado." }, { status: 404 });
  }

  let body: DevAdminLoginBody;

  try {
    body = (await request.json()) as DevAdminLoginBody;
  } catch {
    return NextResponse.json({ error: "Datos invalidos." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";
  const returnUrl = typeof body.returnUrl === "string" ? body.returnUrl : "/admin";

  if (!isDevAdminCredential(email, password)) {
    return NextResponse.json({ error: "Credenciales invalidas." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, returnUrl: getSafeReturnPath(returnUrl, "/admin") });
  response.cookies.set(DEV_ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return response;
}
