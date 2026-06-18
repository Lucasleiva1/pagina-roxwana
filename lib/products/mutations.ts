"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/requireAdmin";
import type { Database } from "@/types/supabase";
import type { ProductGender, ProductStatus } from "@/types/product";
import { normalizeDeviceVariant, normalizeImageRole, parseProductImageName, type StudioDeviceVariant, type StudioImageRole } from "@/lib/product-studio/imageRules";

const IMAGE_BUCKET = "product-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const PRODUCT_STATUSES: ProductStatus[] = ["draft", "published", "sold_out"];

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim() : "";
}

function nullableValue(formData: FormData, key: string) {
  const item = value(formData, key);
  return item.length > 0 ? item : null;
}

function values(formData: FormData, key: string) {
  return formData.getAll(key).filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function valueAt(formData: FormData, key: string, index: number) {
  const item = formData.getAll(key)[index];
  return typeof item === "string" ? item.trim() : "";
}

function positiveNumber(formData: FormData, key: string) {
  const parsed = Number(value(formData, key));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function integerValue(formData: FormData, key: string) {
  const parsed = Number(value(formData, key));
  return Number.isInteger(parsed) ? parsed : 0;
}

function integerAt(formData: FormData, key: string, index: number, fallback: number) {
  const parsed = Number(valueAt(formData, key, index));
  return Number.isInteger(parsed) ? parsed : fallback;
}

function assertChoice<T extends string>(valueToCheck: string, allowed: readonly T[], fallback: T): T {
  return allowed.includes(valueToCheck as T) ? (valueToCheck as T) : fallback;
}

function safeSegment(input: string, fallback: string) {
  const cleaned = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

function isMissingStudioImageColumn(error: { message?: string; code?: string } | null | undefined) {
  const message = error?.message || "";
  return error?.code === "42703" || /image_role|view_number|color_code|device_variant|original_filename/i.test(message);
}

function getStudioImageMetadata(formData: FormData, index: number, fileName: string) {
  const parsed = parseProductImageName(fileName, valueAt(formData, "image_role", index));
  const role = normalizeImageRole(valueAt(formData, "image_role", index)) || parsed.role;
  const deviceVariant = normalizeDeviceVariant(valueAt(formData, "image_device_variant", index)) || parsed.deviceVariant;
  const colorCode = valueAt(formData, "image_color_code", index).toUpperCase() || parsed.colorCode;
  const viewNumber = valueAt(formData, "image_view_number", index) || parsed.viewNumber;

  return {
    image_role: role,
    view_number: viewNumber,
    color_code: colorCode,
    device_variant: deviceVariant,
    original_filename: valueAt(formData, "image_original_name", index) || fileName,
    sort_order: integerAt(formData, "image_sort_order", index, parsed.sortOrder)
  };
}

function validateProductForm(formData: FormData) {
  const status = assertChoice<ProductStatus>(value(formData, "status"), PRODUCT_STATUSES, "draft");
  const price = positiveNumber(formData, "price");
  const compareAtPrice = positiveNumber(formData, "compare_at_price");
  const categoryId = nullableValue(formData, "category_id");
  const payload: Database["public"]["Tables"]["products"]["Insert"] = {
    model_code: value(formData, "model_code").toUpperCase(),
    name: value(formData, "name"),
    slug: safeSegment(value(formData, "slug"), "producto"),
    garment_type_id: value(formData, "garment_type_id"),
    gender: assertChoice<ProductGender>(value(formData, "gender"), ["hombre", "mujer", "unisex"], "unisex"),
    description: nullableValue(formData, "description_long") || nullableValue(formData, "description") || nullableValue(formData, "description_short"),
    description_short: nullableValue(formData, "description_short"),
    description_long: nullableValue(formData, "description_long") || nullableValue(formData, "description"),
    status,
    featured: formData.get("featured") === "on",
    price,
    compare_at_price: compareAtPrice > 0 ? compareAtPrice : null,
    category_id: categoryId,
    collection_id: nullableValue(formData, "collection_id"),
    sort_order: integerValue(formData, "sort_order"),
    whatsapp_message: nullableValue(formData, "whatsapp_message")
  };
  const colorIds = values(formData, "color_ids");
  const sizeIds = values(formData, "size_ids");

  if (!payload.model_code || !payload.name || !payload.slug || !payload.garment_type_id || price <= 0) {
    throw new Error("Faltan campos obligatorios del producto.");
  }

  if (status !== "draft" && !categoryId) {
    throw new Error("Para publicar o agotar un producto, elegi una categoria.");
  }

  if (status !== "draft" && (colorIds.length === 0 || sizeIds.length === 0)) {
    throw new Error("Los productos publicados o agotados necesitan al menos un color y un talle.");
  }

  return { payload, colorIds, sizeIds, variants: parseVariants(formData) };
}

function parseVariants(formData: FormData) {
  return value(formData, "variants")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [sku = "", size = "", color = "", stock = "0"] = line.split("|").map((part) => part.trim());
      const parsedStock = Number(stock);
      return {
        sku: sku || null,
        size: size || null,
        color: color || null,
        stock: Number.isInteger(parsedStock) && parsedStock >= 0 ? parsedStock : 0
      };
    });
}

async function replaceVariants(supabase: SupabaseClient<Database>, productId: string, variants: ReturnType<typeof parseVariants>) {
  await supabase.from("product_variants").delete().eq("product_id", productId);

  if (variants.length > 0) {
    await supabase.from("product_variants").insert(variants.map((variant) => ({ ...variant, product_id: productId })));
  }
}

async function replaceRelations(supabase: SupabaseClient<Database>, productId: string, colorIds: string[], sizeIds: string[]) {
  await supabase.from("product_colors").delete().eq("product_id", productId);
  await supabase.from("product_sizes").delete().eq("product_id", productId);

  if (colorIds.length > 0) {
    await supabase.from("product_colors").insert(colorIds.map((color_id) => ({ product_id: productId, color_id })));
  }

  if (sizeIds.length > 0) {
    await supabase.from("product_sizes").insert(sizeIds.map((size_id) => ({ product_id: productId, size_id })));
  }
}

async function insertProductImage(supabase: SupabaseClient<Database>, payload: Database["public"]["Tables"]["product_images"]["Insert"]) {
  const { error } = await supabase.from("product_images").insert(payload);

  if (!error) {
    return;
  }

  if (!isMissingStudioImageColumn(error)) {
    throw new Error("No se pudo guardar una imagen del producto.");
  }

  const legacyPayload = { ...payload };
  delete legacyPayload.image_role;
  delete legacyPayload.view_number;
  delete legacyPayload.color_code;
  delete legacyPayload.device_variant;
  delete legacyPayload.original_filename;
  const retry = await supabase.from("product_images").insert(legacyPayload);

  if (retry.error) {
    throw new Error("No se pudo guardar una imagen del producto.");
  }
}

async function uploadImages(supabase: SupabaseClient<Database>, productId: string, slug: string, productName: string, formData: FormData) {
  const files = formData.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);

  if (files.length === 0) {
    return;
  }

  const { data: existing } = await supabase.from("product_images").select("id").eq("product_id", productId).limit(1);
  const hasExistingImages = Boolean(existing?.length);
  const primaryNewImageIndex = integerValue(formData, "primary_new_image_index");

  if (primaryNewImageIndex >= 0 && value(formData, "primary_new_image_index")) {
    await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);
  }

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];

    if (valueAt(formData, "image_skip", index) === "true") {
      continue;
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error("Solo se aceptan imagenes jpg, png o webp.");
    }

    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("Cada imagen debe pesar 5 MB o menos.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
    const path = `products/${safeSegment(slug, productId)}/gallery/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      throw new Error("No se pudo subir una imagen del producto.");
    }

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    const metadata = getStudioImageMetadata(formData, index, file.name);
    const forcePrimary = value(formData, "primary_new_image_index") ? index === primaryNewImageIndex : false;
    const isPrimary = forcePrimary || (!hasExistingImages && (metadata.image_role === "cover" || index === 0));

    await insertProductImage(supabase, {
      product_id: productId,
      url: data.publicUrl,
      path,
      bucket: IMAGE_BUCKET,
      alt: productName,
      sort_order: metadata.sort_order || Date.now() + index,
      is_primary: isPrimary,
      file_type: file.type,
      size: file.size,
      image_role: metadata.image_role,
      view_number: metadata.view_number,
      color_code: metadata.color_code,
      device_variant: metadata.device_variant,
      original_filename: metadata.original_filename
    });
  }
}

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length)) : null;
}

async function deleteImages(supabase: SupabaseClient<Database>, imageIds: string[]) {
  if (imageIds.length === 0) {
    return;
  }

  const { data } = await supabase.from("product_images").select("url, path, bucket").in("id", imageIds);
  const storagePaths = (data || [])
    .filter((image) => (image.bucket || IMAGE_BUCKET) === IMAGE_BUCKET)
    .map((image) => image.path || getStoragePathFromPublicUrl(image.url))
    .filter((path): path is string => Boolean(path));

  if (storagePaths.length > 0) {
    await supabase.storage.from(IMAGE_BUCKET).remove(storagePaths);
  }

  await supabase.from("product_images").delete().in("id", imageIds);
}

async function updateExistingImageMetadata(supabase: SupabaseClient<Database>, productId: string, formData: FormData, deletedImageIds: string[]) {
  const imageIds = values(formData, "existing_image_ids");

  for (let index = 0; index < imageIds.length; index += 1) {
    const imageId = imageIds[index];

    if (deletedImageIds.includes(imageId)) {
      continue;
    }

    const role = normalizeImageRole(valueAt(formData, "existing_image_role", index)) || "gallery";
    const deviceVariant = normalizeDeviceVariant(valueAt(formData, "existing_image_device_variant", index)) || "base";
    const payload: Database["public"]["Tables"]["product_images"]["Update"] = {
      image_role: role as StudioImageRole,
      view_number: valueAt(formData, "existing_image_view_number", index) || null,
      color_code: valueAt(formData, "existing_image_color_code", index).toUpperCase() || null,
      device_variant: deviceVariant as StudioDeviceVariant,
      sort_order: integerAt(formData, "existing_image_sort_order", index, index)
    };

    const { error } = await supabase.from("product_images").update(payload).eq("id", imageId).eq("product_id", productId);

    if (error && !isMissingStudioImageColumn(error)) {
      throw new Error("No se pudo actualizar metadata de imagen.");
    }
  }
}

async function syncPrimaryImage(supabase: SupabaseClient<Database>, productId: string, preferredImageId?: string | null) {
  const { data: images } = await supabase.from("product_images").select("id, path, url, is_primary, sort_order").eq("product_id", productId).order("sort_order", { ascending: true });

  if (!images?.length) {
    await supabase.from("products").update({ main_image_path: null }).eq("id", productId);
    return;
  }

  const primary = (preferredImageId ? images.find((image) => image.id === preferredImageId) : null) || images.find((image) => image.is_primary) || images[0];
  await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);
  await supabase.from("product_images").update({ is_primary: true }).eq("id", primary.id);
  await supabase.from("products").update({ main_image_path: primary.path || primary.url }).eq("id", productId);
}

function revalidateProductSurfaces(slug?: string) {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/hombre");
  revalidatePath("/mujer");
  revalidatePath("/random");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");

  if (slug) {
    revalidatePath(`/producto/${slug}`);
  }
}

async function createProductMutationClient() {
  await requireStaff();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase no esta configurado.");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Para guardar productos inicia sesion con un usuario admin real de Supabase.");
  }

  return supabase;
}

export async function createProductAction(formData: FormData) {
  const supabase = await createProductMutationClient();

  const { payload, colorIds, sizeIds, variants } = validateProductForm(formData);
  const { data, error } = await supabase.from("products").insert(payload).select("id, slug").single();

  if (error || !data) {
    throw new Error("No se pudo crear el producto.");
  }

  await replaceRelations(supabase, data.id, colorIds, sizeIds);
  await replaceVariants(supabase, data.id, variants);
  await uploadImages(supabase, data.id, payload.slug, payload.name, formData);
  await syncPrimaryImage(supabase, data.id, value(formData, "primary_image_id") || null);
  revalidateProductSurfaces(data.slug);
  redirect("/admin/productos");
}

export async function updateProductAction(formData: FormData) {
  const supabase = await createProductMutationClient();

  const id = value(formData, "id");
  const { payload, colorIds, sizeIds, variants } = validateProductForm(formData);

  if (!id) {
    throw new Error("Falta el producto a editar.");
  }

  const deleteImageIds = values(formData, "delete_image_ids");

  if (deleteImageIds.length > 0) {
    await deleteImages(supabase, deleteImageIds);
  }

  await updateExistingImageMetadata(supabase, id, formData, deleteImageIds);

  const { error } = await supabase.from("products").update(payload).eq("id", id);

  if (error) {
    throw new Error("No se pudo actualizar el producto.");
  }

  await replaceRelations(supabase, id, colorIds, sizeIds);
  await replaceVariants(supabase, id, variants);
  await uploadImages(supabase, id, payload.slug, payload.name, formData);
  await syncPrimaryImage(supabase, id, value(formData, "primary_image_id") || null);
  revalidateProductSurfaces(payload.slug);
  redirect("/admin/productos");
}

export async function changeProductStatusAction(formData: FormData) {
  const supabase = await createProductMutationClient();
  const id = value(formData, "id");
  const status = assertChoice<ProductStatus>(value(formData, "status"), PRODUCT_STATUSES, "draft");

  if (!supabase || !id) {
    throw new Error("No se pudo cambiar el estado del producto.");
  }

  await supabase.from("products").update({ status }).eq("id", id);
  revalidateProductSurfaces();
}

export async function toggleFeaturedProductAction(formData: FormData) {
  const supabase = await createProductMutationClient();
  const id = value(formData, "id");
  const featured = value(formData, "featured") === "true";

  if (!supabase || !id) {
    throw new Error("No se pudo cambiar destacado.");
  }

  const { data, error } = await supabase.from("products").update({ featured }).eq("id", id).select("id").single();

  if (error || !data) {
    throw new Error("No se pudo cambiar destacado.");
  }

  revalidateProductSurfaces();
}

export async function deleteProductAction(formData: FormData) {
  const supabase = await createProductMutationClient();
  const id = value(formData, "id");

  if (!supabase || !id) {
    throw new Error("No se pudo borrar el producto.");
  }

  const { data: images } = await supabase.from("product_images").select("id").eq("product_id", id);
  await deleteImages(supabase, (images || []).map((image) => image.id));
  await supabase.from("products").delete().eq("id", id);
  revalidateProductSurfaces();
}

export async function duplicateProductAction(formData: FormData) {
  const supabase = await createProductMutationClient();
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
      description_short: product.description_short,
      description_long: product.description_long,
      status: "draft",
      featured: false,
      price: product.price,
      compare_at_price: product.compare_at_price,
      category_id: product.category_id,
      collection_id: product.collection_id,
      sort_order: product.sort_order,
      whatsapp_message: product.whatsapp_message
    })
    .select("id")
    .single();

  if (insertError || !copy) {
    throw new Error("No se pudo duplicar el producto.");
  }

  const [{ data: colors }, { data: sizes }, { data: images }, { data: variants }] = await Promise.all([
    supabase.from("product_colors").select("color_id").eq("product_id", id),
    supabase.from("product_sizes").select("size_id").eq("product_id", id),
    supabase.from("product_images").select("url, path, bucket, alt, sort_order, is_primary, file_type, size, image_role, view_number, color_code, device_variant, original_filename").eq("product_id", id),
    supabase.from("product_variants").select("size, color, stock, sku").eq("product_id", id)
  ]);

  if (colors?.length) {
    await supabase.from("product_colors").insert(colors.map((item) => ({ product_id: copy.id, color_id: item.color_id })));
  }

  if (sizes?.length) {
    await supabase.from("product_sizes").insert(sizes.map((item) => ({ product_id: copy.id, size_id: item.size_id })));
  }

  if (images?.length) {
    await supabase.from("product_images").insert(images.map((item) => ({ ...item, product_id: copy.id, is_primary: false })));
  }

  if (variants?.length) {
    await supabase.from("product_variants").insert(variants.map((item) => ({ ...item, product_id: copy.id })));
  }

  revalidateProductSurfaces();
}
