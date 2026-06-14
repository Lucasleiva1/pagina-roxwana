"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/auth/requireAdmin";
import { formValue, intFormValue, nullableFormValue, slugify } from "@/lib/admin/form";
import type { AdminCategory, AdminCollection } from "@/types/admin";

function mapCategory(row: { id: string; name: string; slug: string; description: string | null; sort_order: number }): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sort_order
  };
}

function mapCollection(row: { id: string; name: string; slug: string; description: string | null; hero_image_path: string | null; is_active: boolean; sort_order: number }): AdminCollection {
  return {
    ...mapCategory(row),
    heroImagePath: row.hero_image_path,
    isActive: row.is_active
  };
}

export async function getAdminCategories() {
  await requireStaff();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase.from("categories").select("*").order("sort_order", { ascending: true }).order("name", { ascending: true });
  return (data || []).map(mapCategory);
}

export async function getAdminCollections() {
  await requireStaff();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase.from("collections").select("*").order("sort_order", { ascending: true }).order("name", { ascending: true });
  return (data || []).map(mapCollection);
}

function revalidateTaxonomy() {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/drops");
  revalidatePath("/admin/productos");
}

export async function upsertCategoryAction(formData: FormData) {
  await requireStaff();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin no esta configurado.");
  }

  const id = formValue(formData, "id");
  const name = formValue(formData, "name");
  const payload = {
    name,
    slug: slugify(formValue(formData, "slug") || name, "categoria"),
    description: nullableFormValue(formData, "description"),
    sort_order: intFormValue(formData, "sort_order")
  };

  if (!payload.name) {
    throw new Error("La categoria necesita nombre.");
  }

  if (id) {
    await supabase.from("categories").update(payload).eq("id", id);
  } else {
    await supabase.from("categories").insert(payload);
  }

  revalidateTaxonomy();
}

export async function deleteCategoryAction(formData: FormData) {
  await requireStaff();
  const supabase = createSupabaseAdminClient();
  const id = formValue(formData, "id");

  if (!supabase || !id) {
    throw new Error("No se pudo borrar la categoria.");
  }

  await supabase.from("products").update({ category_id: null }).eq("category_id", id);
  await supabase.from("categories").delete().eq("id", id);
  revalidateTaxonomy();
}

export async function upsertCollectionAction(formData: FormData) {
  await requireStaff();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin no esta configurado.");
  }

  const id = formValue(formData, "id");
  const name = formValue(formData, "name");
  const payload = {
    name,
    slug: slugify(formValue(formData, "slug") || name, "drop"),
    description: nullableFormValue(formData, "description"),
    hero_image_path: nullableFormValue(formData, "hero_image_path"),
    is_active: formData.get("is_active") === "on",
    sort_order: intFormValue(formData, "sort_order")
  };

  if (!payload.name) {
    throw new Error("El drop necesita nombre.");
  }

  if (id) {
    await supabase.from("collections").update(payload).eq("id", id);
  } else {
    await supabase.from("collections").insert(payload);
  }

  revalidateTaxonomy();
}

export async function deleteCollectionAction(formData: FormData) {
  await requireStaff();
  const supabase = createSupabaseAdminClient();
  const id = formValue(formData, "id");

  if (!supabase || !id) {
    throw new Error("No se pudo borrar el drop.");
  }

  await supabase.from("products").update({ collection_id: null }).eq("collection_id", id);
  await supabase.from("collections").delete().eq("id", id);
  revalidateTaxonomy();
}
