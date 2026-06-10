"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getOrCreateActiveCartRow } from "@/lib/cart/queries";
import { buildSku } from "@/lib/products/buildSku";
import { getProductById } from "@/lib/products/queries";

function clampQuantity(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.min(Math.max(Math.round(parsed), 1), 20);
}

function cleanOption(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function isUuid(value: string | null | undefined) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

export async function addToCartAction(input: {
  productId: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}) {
  const auth = await getAuthenticatedUser();

  if (!auth) {
    return { ok: false, needsLogin: true, error: "Inicia sesion para agregar al carrito." };
  }

  const product = await getProductById(input.productId);

  if (!product || !product.id) {
    return { ok: false, needsLogin: false, error: "Producto no disponible." };
  }

  const selectedColor = cleanOption(input.selectedColor);
  const selectedSize = cleanOption(input.selectedSize);

  if (!product.colors.some((color) => color.code === selectedColor) || !product.sizes.includes(selectedSize)) {
    return { ok: false, needsLogin: false, error: "Selecciona un color y talle disponibles." };
  }

  const cart = await getOrCreateActiveCartRow(auth.supabase, auth.user.id);

  if (!cart) {
    return { ok: false, needsLogin: false, error: "No se pudo preparar el carrito." };
  }

  const quantity = clampQuantity(input.quantity);
  const sku = buildSku(product, selectedColor, selectedSize);
  const { data: existing } = await auth.supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.id)
    .eq("sku", sku)
    .eq("selected_color", selectedColor)
    .eq("selected_size", selectedSize)
    .maybeSingle();

  if (existing) {
    const nextQuantity = clampQuantity(existing.quantity + quantity);
    const { error } = await auth.supabase.from("cart_items").update({ quantity: nextQuantity }).eq("id", existing.id);

    if (error) {
      return { ok: false, needsLogin: false, error: "No se pudo actualizar el carrito." };
    }
  } else {
    const { error } = await auth.supabase.from("cart_items").insert({
      cart_id: cart.id,
      product_id: isUuid(product.id) ? product.id : null,
      product_name_snapshot: product.name,
      model_code_snapshot: product.modelCode,
      selected_color: selectedColor,
      selected_size: selectedSize,
      quantity,
      sku,
      price_snapshot: null
    });

    if (error) {
      return { ok: false, needsLogin: false, error: "No se pudo agregar el producto." };
    }
  }

  revalidatePath("/carrito");
  return { ok: true, needsLogin: false, error: null };
}

export async function updateCartItemQuantityAction(formData: FormData) {
  const auth = await getAuthenticatedUser();
  const itemId = formData.get("itemId");
  const quantity = clampQuantity(formData.get("quantity"));

  if (!auth || typeof itemId !== "string") {
    throw new Error("No se pudo actualizar el item.");
  }

  await auth.supabase.from("cart_items").update({ quantity }).eq("id", itemId);
  revalidatePath("/carrito");
}

export async function removeCartItemAction(formData: FormData) {
  const auth = await getAuthenticatedUser();
  const itemId = formData.get("itemId");

  if (!auth || typeof itemId !== "string") {
    throw new Error("No se pudo quitar el item.");
  }

  await auth.supabase.from("cart_items").delete().eq("id", itemId);
  revalidatePath("/carrito");
}
