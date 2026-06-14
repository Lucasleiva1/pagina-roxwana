"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/auth/requireAdmin";
import { formValue, nullableFormValue, slugify } from "@/lib/admin/form";
import type { MediaAsset } from "@/types/admin";

const ALLOWED_BUCKETS = new Set(["product-images", "site-images", "brand-assets"]);
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function mapAsset(row: { id: string; path: string; bucket: string; alt_text: string | null; file_type: string | null; size: number | null; created_at: string }): MediaAsset {
  const supabase = createSupabaseAdminClient();
  const url = supabase?.storage.from(row.bucket).getPublicUrl(row.path).data.publicUrl || "";

  return {
    id: row.id,
    path: row.path,
    bucket: row.bucket,
    altText: row.alt_text,
    fileType: row.file_type,
    size: row.size,
    url,
    createdAt: row.created_at
  };
}

export async function getMediaAssets() {
  await requireStaff();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false }).limit(80);
  return (data || []).map(mapAsset);
}

export async function uploadMediaAssetAction(formData: FormData) {
  await requireStaff();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin no esta configurado.");
  }

  const bucket = formValue(formData, "bucket") || "site-images";
  const folder = slugify(formValue(formData, "folder") || "uploads", "uploads");
  const altText = nullableFormValue(formData, "alt_text");
  const file = formData.get("file");

  if (!ALLOWED_BUCKETS.has(bucket) || !(file instanceof File) || file.size === 0) {
    throw new Error("Archivo o bucket invalido.");
  }

  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
    throw new Error("Solo se aceptan imagenes permitidas de hasta 5 MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) {
    throw new Error("No se pudo subir la imagen.");
  }

  await supabase.from("media_assets").insert({
    bucket,
    path,
    alt_text: altText,
    file_type: file.type,
    size: file.size
  });

  revalidatePath("/admin/media");
}

export async function deleteMediaAssetAction(formData: FormData) {
  await requireStaff();
  const supabase = createSupabaseAdminClient();
  const id = formValue(formData, "id");

  if (!supabase || !id) {
    throw new Error("No se pudo borrar la imagen.");
  }

  const { data } = await supabase.from("media_assets").select("bucket, path").eq("id", id).maybeSingle();

  if (data) {
    await supabase.storage.from(data.bucket).remove([data.path]);
    await supabase.from("media_assets").delete().eq("id", id);
  }

  revalidatePath("/admin/media");
}
