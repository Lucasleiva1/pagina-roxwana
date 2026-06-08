import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AdminProfile = {
  id: string;
  userId: string;
  name: string | null;
  role: "customer" | "admin";
};

type AdminProfileRow = {
  id: string;
  user_id: string;
  name: string | null;
  role: "customer" | "admin";
};

export async function getAdminProfile(): Promise<AdminProfile | null> {
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
    .eq("role", "admin")
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
  const profile = await getAdminProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}
