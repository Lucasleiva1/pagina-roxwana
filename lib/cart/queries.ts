import "server-only";

import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Cart, CartItem, CustomerAddress, CustomerProfile } from "@/types/customer";
import type { Database } from "@/types/supabase";
import { requireCustomer, getCurrentProfile } from "@/lib/auth/session";
import { getPublicMediaUrl } from "@/lib/media/publicUrl";
import { getSiteSettings } from "@/lib/settings/getSiteSettings";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";

type CartRow = Database["public"]["Tables"]["carts"]["Row"];
type CartItemRow = Database["public"]["Tables"]["cart_items"]["Row"];
type AddressRow = Database["public"]["Tables"]["customer_addresses"]["Row"];
type ProductImageRow = Pick<
  Database["public"]["Tables"]["product_images"]["Row"],
  "product_id" | "url" | "path" | "bucket" | "alt" | "is_primary" | "sort_order" | "image_role" | "view_number" | "color_code" | "device_variant" | "original_filename"
>;
type ProductMainImageRow = Pick<Database["public"]["Tables"]["products"]["Row"], "id" | "main_image_path">;

function productImageUrl(image: ProductImageRow) {
  return image.url || getPublicMediaUrl(image.path, image.bucket || "product-images");
}

function cartItemImageKey(productId: string, colorCode: string) {
  return `${productId}:${colorCode.trim().toUpperCase()}`;
}

function imageText(image: ProductImageRow) {
  return `${image.original_filename || ""} ${image.path || ""} ${image.url || ""} ${image.alt || ""}`.toLowerCase();
}

function imagePriority(image: ProductImageRow, selectedColor: string) {
  const colorCode = image.color_code?.trim().toUpperCase() || null;
  const text = imageText(image);
  let score = 0;

  if (colorCode === selectedColor) score += 1_000;
  else if (!colorCode) score += 150;

  if (image.is_primary) score += 600;
  if (image.image_role === "cover") score += 500;
  if (image.view_number === "01" || image.view_number === "1") score += 350;
  if (/(^|[-_\s])(shirt|remera|producto)([-_\s.]|$)/.test(text)) score += 250;
  if (/(^|[-_\s])(front|frente)([-_\s.]|$)/.test(text)) score += 180;
  if (image.device_variant === "mobile") score += 30;
  if (image.device_variant === "base") score += 20;

  return score;
}

async function getCartItemImageMap(supabase: SupabaseClient<Database>, items: CartItemRow[]) {
  const productIds = Array.from(new Set(items.map((item) => item.product_id).filter((id): id is string => Boolean(id))));
  const imageByCartItem = new Map<string, string>();

  if (productIds.length === 0) {
    return imageByCartItem;
  }

  const [imagesResult, productsResult] = await Promise.all([
    supabase
      .from("product_images")
      .select("product_id, url, path, bucket, alt, is_primary, sort_order, image_role, view_number, color_code, device_variant, original_filename")
      .in("product_id", productIds)
      .order("sort_order", { ascending: true }),
    supabase.from("products").select("id, main_image_path").in("id", productIds)
  ]);

  const images = (imagesResult.data || []) as ProductImageRow[];
  const mainImageByProductId = new Map<string, string>();

  for (const product of (productsResult.data || []) as ProductMainImageRow[]) {
    const url = getPublicMediaUrl(product.main_image_path, "product-images");
    if (url) {
      mainImageByProductId.set(product.id, url);
    }
  }

  for (const item of items) {
    if (!item.product_id) continue;

    const selectedColor = item.selected_color.trim().toUpperCase();
    const preferredImage = images
      .filter((image) => image.product_id === item.product_id)
      .sort((a, b) => imagePriority(b, selectedColor) - imagePriority(a, selectedColor) || a.sort_order - b.sort_order)
      .find((image) => Boolean(productImageUrl(image)));
    const url = preferredImage ? productImageUrl(preferredImage) : mainImageByProductId.get(item.product_id) || null;

    if (url) imageByCartItem.set(cartItemImageKey(item.product_id, selectedColor), url);
  }

  return imageByCartItem;
}

function mapCartItem(row: CartItemRow, imageByCartItem: Map<string, string>): CartItem {
  return {
    id: row.id,
    cartId: row.cart_id,
    productId: row.product_id,
    productName: row.product_name_snapshot,
    modelCode: row.model_code_snapshot,
    selectedColor: row.selected_color,
    selectedSize: row.selected_size,
    quantity: row.quantity,
    sku: row.sku,
    priceSnapshot: row.price_snapshot,
    imageUrl: row.product_id ? imageByCartItem.get(cartItemImageKey(row.product_id, row.selected_color)) || null : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCart(row: CartRow, items: CartItemRow[], imageByCartItem: Map<string, string>): Cart {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    items: items.map((item) => mapCartItem(item, imageByCartItem)),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapAddress(row: AddressRow): CustomerAddress {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    phone: row.phone,
    street: row.street,
    streetNumber: row.street_number,
    apartment: row.apartment,
    city: row.city,
    province: row.province,
    postalCode: row.postal_code,
    deliveryNotes: row.delivery_notes,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getActiveCartRow(supabase: SupabaseClient<Database>, userId: string) {
  const { data, error } = await supabase.from("carts").select("*").eq("user_id", userId).eq("status", "active").maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function getOrCreateActiveCartRow(supabase: SupabaseClient<Database>, userId: string) {
  const existing = await getActiveCartRow(supabase, userId);

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase.from("carts").insert({ user_id: userId, status: "active" }).select("*").single();

  if (error) {
    const retry = await getActiveCartRow(supabase, userId);
    return retry;
  }

  return data;
}

export async function getCartByRow(supabase: SupabaseClient<Database>, cartRow: CartRow | null): Promise<Cart | null> {
  if (!cartRow) {
    return null;
  }

  const { data, error } = await supabase.from("cart_items").select("*").eq("cart_id", cartRow.id).order("created_at", { ascending: true });

  if (error) {
    return mapCart(cartRow, [], new Map());
  }

  const items = data || [];
  const imageByProductId = await getCartItemImageMap(supabase, items);

  return mapCart(cartRow, items, imageByProductId);
}

export async function getActiveCartForUser(supabase: SupabaseClient<Database>, userId: string) {
  const cartRow = await getActiveCartRow(supabase, userId);
  return getCartByRow(supabase, cartRow);
}

export async function getCustomerCartPageData(returnPath = "/carrito"): Promise<{
  cart: Cart | null;
  profile: CustomerProfile | null;
  latestAddress: CustomerAddress | null;
  latestWhatsAppNotice: { url: string; message: string } | null;
}> {
  const { supabase, user } = await requireCustomer(returnPath);
  const cookieStore = await cookies();
  const lastOrderId = cookieStore.get("roxwana_last_whatsapp_order")?.value;
  const [cart, profile, addressResult] = await Promise.all([
    getActiveCartForUser(supabase, user.id),
    getCurrentProfile(),
    supabase.from("customer_addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle()
  ]);
  let latestWhatsAppNotice: { url: string; message: string } | null = null;

  if (lastOrderId) {
    const { data: order } = await supabase
      .from("orders")
      .select("whatsapp_message")
      .eq("id", lastOrderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (order?.whatsapp_message) {
      const settings = await getSiteSettings();
      const url = buildWhatsAppUrl({ phone: settings.whatsappNumber, message: order.whatsapp_message });

      if (url) {
        latestWhatsAppNotice = {
          url,
          message: "Pedido guardado. Se genero el mensaje de WhatsApp para terminar la compra."
        };
      }
    }
  }

  return {
    cart,
    profile,
    latestAddress: addressResult.error || !addressResult.data ? null : mapAddress(addressResult.data),
    latestWhatsAppNotice
  };
}
