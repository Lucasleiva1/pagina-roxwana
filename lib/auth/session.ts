import "server-only";

import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { CustomerProfile } from "@/types/customer";
import type { Database } from "@/types/supabase";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

function mapProfile(row: ProfileRow): CustomerProfile {
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    marketingConsent: row.marketing_consent,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getAuthenticatedUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return { supabase, user: data.user };
}

export async function getCurrentProfile() {
  const auth = await getAuthenticatedUser();

  if (!auth) {
    return null;
  }

  const { data, error } = await auth.supabase.from("profiles").select("*").eq("user_id", auth.user.id).maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProfile(data);
}

export async function requireCustomer(returnPath = "/carrito") {
  const auth = await getAuthenticatedUser();

  if (!auth) {
    redirect(`/login?returnUrl=${encodeURIComponent(returnPath)}`);
  }

  return auth;
}

export async function ensureCustomerProfile(supabase: SupabaseClient<Database>, user: User) {
  const metadata = user.user_metadata || {};
  const name = typeof metadata.name === "string" ? metadata.name : typeof metadata.full_name === "string" ? metadata.full_name : null;
  const avatarUrl = typeof metadata.avatar_url === "string" ? metadata.avatar_url : typeof metadata.picture === "string" ? metadata.picture : null;

  const { data: existing } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();

  if (existing) {
    const profileUpdates: Database["public"]["Tables"]["profiles"]["Update"] = {
      email: user.email || null
    };

    if (name) {
      profileUpdates.name = name;
    }

    if (avatarUrl) {
      profileUpdates.avatar_url = avatarUrl;
    }

    await supabase
      .from("profiles")
      .update(profileUpdates)
      .eq("user_id", user.id);
    return;
  }

  await supabase.from("profiles").insert({
    user_id: user.id,
    email: user.email || null,
    name,
    avatar_url: avatarUrl,
    role: "customer"
  });
}
