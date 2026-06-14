"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/auth/requireAdmin";
import { formValue, intFormValue, nullableFormValue } from "@/lib/admin/form";
import { defaultHomeSections, mapHomeSection } from "@/lib/home/sections";

export async function getAdminHomeSections() {
  await requireStaff();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return defaultHomeSections;
  }

  const { data } = await supabase.from("site_sections").select("*").order("sort_order", { ascending: true });
  return data?.length ? data.map(mapHomeSection) : defaultHomeSections;
}

export async function updateHomeSectionAction(formData: FormData) {
  await requireStaff();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin no esta configurado.");
  }

  const key = formValue(formData, "key");
  const type = formValue(formData, "type");

  if (!key || !type) {
    throw new Error("La seccion no es valida.");
  }

  await supabase.from("site_sections").upsert(
    {
      key,
      type,
      title: nullableFormValue(formData, "title"),
      subtitle: nullableFormValue(formData, "subtitle"),
      body: nullableFormValue(formData, "body"),
      image_path: nullableFormValue(formData, "image_path"),
      cta_label: nullableFormValue(formData, "cta_label"),
      cta_url: nullableFormValue(formData, "cta_url"),
      is_visible: formData.get("is_visible") === "on",
      sort_order: intFormValue(formData, "sort_order"),
      metadata: {}
    },
    { onConflict: "key" }
  );

  revalidatePath("/");
  revalidatePath("/admin/home");
}
