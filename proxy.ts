import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { DEV_ADMIN_COOKIE, isDevAdminEnabled } from "@/lib/auth/devAdmin";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request
  });
  const config = getSupabasePublicConfig();
  const pathname = request.nextUrl.pathname;
  const hasDevAdmin = isDevAdminEnabled() && request.cookies.get(DEV_ADMIN_COOKIE)?.value === "1";

  if (pathname.startsWith("/admin-login")) {
    const redirectUrl = new URL("/admin/login", request.url);
    const returnUrl = request.nextUrl.searchParams.get("returnUrl");
    if (returnUrl) {
      redirectUrl.searchParams.set("returnUrl", returnUrl.replace(/^\/command/, "/admin"));
    }
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/command")) {
    const redirectUrl = new URL(pathname.replace(/^\/command/, "/admin") + request.nextUrl.search, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (!config) {
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !hasDevAdmin) {
      const redirectUrl = new URL("/admin/login", request.url);
      redirectUrl.searchParams.set("returnUrl", pathname + request.nextUrl.search);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !user && !hasDevAdmin) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("returnUrl", pathname + request.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)"]
};
