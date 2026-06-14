import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEV_ADMIN_COOKIE, isDevAdminEnabled } from "@/lib/auth/devAdmin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSafeReturnPath } from "@/lib/auth/redirects";

export type AdminProfile = {
  id: string;
  userId: string;
  name: string | null;
  role: "customer" | "editor" | "admin";
};

type AdminProfileRow = {
  id: string;
  user_id: string;
  name: string | null;
  role: "customer" | "editor" | "admin";
};

export type StaffRole = "editor" | "admin";

export async function getAdminProfile(roles: StaffRole[] = ["admin"]): Promise<AdminProfile | null> {
  if (isDevAdminEnabled()) {
    const cookieStore = await cookies();
    if (cookieStore.get(DEV_ADMIN_COOKIE)?.value === "1" && roles.includes("admin")) {
      return {
        id: "dev-admin",
        userId: "dev-admin",
        name: "Admin local ROXWANA",
        role: "admin"
      };
    }
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, user_id, name, role")
    .eq("user_id", user.id)
    .in("role", roles)
    .maybeSingle();

  const profile = data as AdminProfileRow | null;

  if (error || !profile) {
    return null;
  }

  return {
    id: profile.id,
    userId: profile.user_id,
    name: profile.name,
    role: profile.role
  };
}

export async function requireAdmin() {
  const profile = await getAdminProfile(["admin"]);

  if (!profile) {
    redirect(`/admin/login?returnUrl=${encodeURIComponent(getSafeReturnPath("/admin", "/admin"))}`);
  }

  return profile;
}

export async function requireStaff() {
  const profile = await getAdminProfile(["admin", "editor"]);

  if (!profile) {
    redirect(`/admin/login?returnUrl=${encodeURIComponent(getSafeReturnPath("/admin", "/admin"))}`);
  }

  return profile;
}
