"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import type { ProductGender, ProductStatus } from "@/types/product";

const IMAGE_BUCKET = "product-images";
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim() : "";
}

function values(formData: FormData, key: string) {
  return formData.getAll(key).filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function positiveInteger(formData: FormData, key: string) {
  const parsed = Number(value(formData, key));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

function assertChoice<T extends string>(valueToCheck: string, allowed: readonly T[], fallback: T): T {
  return allowed.includes(valueToCheck as T) ? (valueToCheck as T) : fallback;
}

function validateProductForm(formData: FormData) {
  const status = assertChoice<ProductStatus>(value(formData, "status"), ["draft", "active", "hidden"], "draft");
  const payload = {
    model_code: value(formData, "model_code").toUpperCase(),
    name: value(formData, "name"),
    slug: value(formData, "slug").toLowerCase(),
    garment_type_id: value(formData, "garment_type_id"),
    gender: assertChoice<ProductGender>(value(formData, "gender"), ["hombre", "mujer", "unisex"], "unisex"),
    description: value(formData, "description") || null,
    status,
    featured: formData.get("featured") === "on",
    price: positiveInteger(formData, "price")
  };
  const colorIds = values(formData, "color_ids");
  const sizeIds = values(formData, "size_ids");

  if (!payload.model_code || !payload.name || !payload.slug || !payload.garment_type_id || !payload.status || !payload.price) {
    throw new Error("Faltan campos obligatorios del producto.");
  }

  if (status !== "draft" && (colorIds.length === 0 || sizeIds.length === 0)) {
    throw new Error("Los productos activos u ocultos necesitan al menos un color y un talle.");
  }

  return { payload, colorIds, sizeIds };
}

async function uploadImages(productId: string, formData: FormData) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return;
  }

  const files = formData.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error("Solo se aceptan imagenes jpg, png o webp.");
    }

    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("Cada imagen debe pesar 3 MB o menos.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
    const path = `${productId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      throw new Error("No se pudo subir una imagen del producto.");
    }

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);

    await supabase.from("product_images").insert({
      product_id: productId,
      url: data.publicUrl,
      alt: value(formData, "name"),
      sort_order: Date.now(),
      is_primary: false
    });
  }
}

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length)) : null;
}

async function deleteImages(imageIds: string[]) {
  const supabase = createSupabaseAdminClient();

  if (!supabase || imageIds.length === 0) {
    return;
  }

  const { data } = await supabase.from("product_images").select("url").in("id", imageIds);
  const storagePaths = (data || [])
    .map((image) => getStoragePathFromPublicUrl(image.url))
    .filter((path): path is string => Boolean(path));

  if (storagePaths.length > 0) {
    await supabase.storage.from(IMAGE_BUCKET).remove(storagePaths);
  }

  await supabase.from("product_images").delete().in("id", imageIds);
}

async function replaceRelations(productId: string, colorIds: string[], sizeIds: string[]) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin no esta configurado.");
  }

  await supabase.from("product_colors").delete().eq("product_id", productId);
  await supabase.from("product_sizes").delete().eq("product_id", productId);

  if (colorIds.length > 0) {
    await supabase.from("product_colors").insert(colorIds.map((color_id) => ({ product_id: productId, color_id })));
  }

  if (sizeIds.length > 0) {
    await supabase.from("product_sizes").insert(sizeIds.map((size_id) => ({ product_id: productId, size_id })));
  }
}

function revalidateProductSurfaces(slug?: string) {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/hombre");
  revalidatePath("/mujer");
  revalidatePath("/random");
  revalidatePath("/command");
  revalidatePath("/command/productos");

  if (slug) {
    revalidatePath(`/producto/${slug}`);
  }
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin no esta configurado.");
  }

  const { payload, colorIds, sizeIds } = validateProductForm(formData);
  const { data, error } = await supabase.from("products").insert(payload).select("id, slug").single();

  if (error || !data) {
    throw new Error("No se pudo crear el producto.");
  }

  await replaceRelations(data.id, colorIds, sizeIds);
  await uploadImages(data.id, formData);
  revalidateProductSurfaces(data.slug);
  redirect("/command/productos");
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin no esta configurado.");
  }

  const id = value(formData, "id");
  const { payload, colorIds, sizeIds } = validateProductForm(formData);

  if (!id) {
    throw new Error("Falta el producto a editar.");
  }

  const deleteImageIds = values(formData, "delete_image_ids");

  if (deleteImageIds.length > 0) {
    await deleteImages(deleteImageIds);
  }

  const { error } = await supabase.from("products").update(payload).eq("id", id);

  if (error) {
    throw new Error("No se pudo actualizar el producto.");
  }

  await replaceRelations(id, colorIds, sizeIds);
  await uploadImages(id, formData);
  revalidateProductSurfaces(payload.slug);
  redirect("/command/productos");
}

export async function changeProductStatusAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const id = value(formData, "id");
  const status = assertChoice<ProductStatus>(value(formData, "status"), ["draft", "active", "hidden"], "hidden");

  if (!supabase || !id) {
    throw new Error("No se pudo cambiar el estado del producto.");
  }

  await supabase.from("products").update({ status }).eq("id", id);
  revalidateProductSurfaces();
}

export async function duplicateProductAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const id = value(formData, "id");

  if (!supabase || !id) {
    throw new Error("No se pudo duplicar el producto.");
  }

  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single();

  if (error || !product) {
    throw new Error("Producto inexistente.");
  }

  const suffix = Date.now().toString(36);
  const { data: copy, error: insertError } = await supabase
    .from("products")
    .insert({
      model_code: `${product.model_code}-COPY-${suffix}`.toUpperCase(),
      name: `${product.name} copia`,
      slug: `${product.slug}-copy-${suffix}`,
      garment_type_id: product.garment_type_id,
      gender: product.gender,
      description: product.description,
      status: "draft",
      featured: false,
      price: product.price
    })
    .select("id")
    .single();

  if (insertError || !copy) {
    throw new Error("No se pudo duplicar el producto.");
  }

  const [{ data: colors }, { data: sizes }, { data: images }] = await Promise.all([
    supabase.from("product_colors").select("color_id").eq("product_id", id),
    supabase.from("product_sizes").select("size_id").eq("product_id", id),
    supabase.from("product_images").select("url, alt, sort_order, is_primary").eq("product_id", id)
  ]);

  if (colors?.length) {
    await supabase.from("product_colors").insert(colors.map((item) => ({ product_id: copy.id, color_id: item.color_id })));
  }

  if (sizes?.length) {
    await supabase.from("product_sizes").insert(sizes.map((item) => ({ product_id: copy.id, size_id: item.size_id })));
  }

  if (images?.length) {
    await supabase.from("product_images").insert(images.map((item) => ({ ...item, product_id: copy.id })));
  }

  revalidateProductSurfaces();
}
