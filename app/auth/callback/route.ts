import { NextResponse, type NextRequest } from "next/server";
import { ensureCustomerProfile } from "@/lib/auth/session";
import { getSafeReturnPath } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

async function hasStaffAccess(supabase: SupabaseClient<Database>, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "editor"])
    .maybeSingle();

  return !error && Boolean(data);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeReturnPath(requestUrl.searchParams.get("next") || requestUrl.searchParams.get("returnUrl"));
  const isAdminLogin = next.startsWith("/admin");

  function redirectToLogin(error = "oauth") {
    const loginUrl = new URL(isAdminLogin ? "/admin/login" : "/login", request.url);
    loginUrl.searchParams.set("returnUrl", next);
    loginUrl.searchParams.set("error", error);
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    return redirectToLogin();
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return redirectToLogin();
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectToLogin();
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectToLogin();
  }

  await ensureCustomerProfile(supabase, user);

  if (isAdminLogin && !(await hasStaffAccess(supabase, user.id))) {
    await supabase.auth.signOut();
    return redirectToLogin("forbidden");
  }

  return NextResponse.redirect(new URL(next, request.url));
}
