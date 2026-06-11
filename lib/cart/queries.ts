import "server-only";

import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Cart, CartItem, CustomerAddress, CustomerProfile } from "@/types/customer";
import type { Database } from "@/types/supabase";
import { requireCustomer, getCurrentProfile } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/settings/getSiteSettings";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";

type CartRow = Database["public"]["Tables"]["carts"]["Row"];
type CartItemRow = Database["public"]["Tables"]["cart_items"]["Row"];
type AddressRow = Database["public"]["Tables"]["customer_addresses"]["Row"];

function mapCartItem(row: CartItemRow): CartItem {
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
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCart(row: CartRow, items: CartItemRow[]): Cart {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    items: items.map(mapCartItem),
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
    return mapCart(cartRow, []);
  }

  return mapCart(cartRow, data || []);
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
