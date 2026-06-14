"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { formValue } from "@/lib/admin/form";
import type { AdminUser } from "@/types/admin";

const INTERNAL_ROLES = ["customer", "editor", "admin"] as const;
type InternalRole = (typeof INTERNAL_ROLES)[number];

function getRole(value: string): InternalRole {
  return INTERNAL_ROLES.includes(value as InternalRole) ? (value as InternalRole) : "customer";
}

export async function getAdminUsers() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  const profiles = data || [];
  const { data: usersResult } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const emailByUserId = new Map((usersResult?.users || []).map((user) => [user.id, user.email || null]));

  return profiles.map<AdminUser>((profile) => ({
    id: profile.id,
    userId: profile.user_id,
    email: profile.email || emailByUserId.get(profile.user_id) || null,
    name: profile.name,
    role: profile.role,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at
  }));
}

export async function createInternalUserAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin no esta configurado.");
  }

  const email = formValue(formData, "email").toLowerCase();
  const password = formValue(formData, "password");
  const name = formValue(formData, "name") || null;
  const role = getRole(formValue(formData, "role"));

  if (!email.includes("@") || password.length < 6 || role === "customer") {
    throw new Error("El acceso interno necesita email, password y rol editor/admin.");
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  if (error || !data.user) {
    throw new Error(error?.message || "No se pudo crear el usuario interno.");
  }

  await supabase.from("profiles").upsert(
    {
      user_id: data.user.id,
      email,
      name,
      role
    },
    { onConflict: "user_id" }
  );

  revalidatePath("/admin/usuarios");
}

export async function updateInternalUserRoleAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const id = formValue(formData, "id");
  const role = getRole(formValue(formData, "role"));

  if (!supabase || !id) {
    throw new Error("No se pudo actualizar el usuario.");
  }

  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/usuarios");
}
