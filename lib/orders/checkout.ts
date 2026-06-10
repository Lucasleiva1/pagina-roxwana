"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, ensureCustomerProfile } from "@/lib/auth/session";
import { getActiveCartForUser } from "@/lib/cart/queries";
import { getSiteSettings } from "@/lib/settings/getSiteSettings";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";
import type { Json } from "@/types/supabase";

function readText(formData: FormData, key: string, label: string, minLength = 1) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return { value: "", error: `${label} es obligatorio.` };
  }

  const clean = value.trim();

  if (clean.length < minLength) {
    return { value: clean, error: `${label} es obligatorio.` };
  }

  if (clean.length > 180) {
    return { value: clean.slice(0, 180), error: `${label} es demasiado largo.` };
  }

  return { value: clean, error: null };
}

function readOptionalText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 300) : null;
}

function validatePhone(phone: string) {
  return phone.replace(/[^\d]/g, "").length >= 8;
}

function buildAddressLine(address: {
  street: string;
  streetNumber: string;
  apartment: string | null;
  city: string;
  province: string;
  postalCode: string;
}) {
  const apartment = address.apartment ? `, ${address.apartment}` : "";
  return `${address.street} ${address.streetNumber}${apartment}, ${address.city}, ${address.province}, CP ${address.postalCode}`;
}

export async function checkoutCartAction(formData: FormData) {
  const auth = await getAuthenticatedUser();

  if (!auth) {
    return { ok: false, error: "Inicia sesion para enviar el pedido.", url: null, fallbackContact: null, orderId: null };
  }

  const required = [
    readText(formData, "fullName", "Nombre", 2),
    readText(formData, "phone", "Telefono", 6),
    readText(formData, "street", "Calle", 2),
    readText(formData, "streetNumber", "Numero", 1),
    readText(formData, "city", "Ciudad", 2),
    readText(formData, "province", "Provincia", 2),
    readText(formData, "postalCode", "Codigo postal", 2)
  ];
  const firstError = required.find((item) => item.error);

  if (firstError) {
    return { ok: false, error: firstError.error, url: null, fallbackContact: null, orderId: null };
  }

  const [fullName, phone, street, streetNumber, city, province, postalCode] = required.map((item) => item.value);

  if (!validatePhone(phone)) {
    return { ok: false, error: "Ingresa un telefono valido para WhatsApp.", url: null, fallbackContact: null, orderId: null };
  }

  const apartment = readOptionalText(formData, "apartment");
  const deliveryNotes = readOptionalText(formData, "deliveryNotes");
  const sourceUrl = readOptionalText(formData, "sourceUrl");
  const cart = await getActiveCartForUser(auth.supabase, auth.user.id);

  if (!cart || cart.items.length === 0) {
    return { ok: false, error: "Tu carrito esta vacio.", url: null, fallbackContact: null, orderId: null };
  }

  await ensureCustomerProfile(auth.supabase, auth.user);
  await auth.supabase.from("profiles").update({ name: fullName, phone }).eq("user_id", auth.user.id);

  const shippingAddress = {
    fullName,
    phone,
    street,
    streetNumber,
    apartment,
    city,
    province,
    postalCode,
    deliveryNotes
  };

  const { data: address, error: addressError } = await auth.supabase
    .from("customer_addresses")
    .insert({
      user_id: auth.user.id,
      full_name: fullName,
      phone,
      street,
      street_number: streetNumber,
      apartment,
      city,
      province,
      postal_code: postalCode,
      delivery_notes: deliveryNotes,
      is_default: true
    })
    .select("id")
    .single();

  if (addressError || !address) {
    return { ok: false, error: "No se pudo guardar la direccion.", url: null, fallbackContact: null, orderId: null };
  }

  const { data: profile } = await auth.supabase.from("profiles").select("email").eq("user_id", auth.user.id).maybeSingle();
  const customerEmail = profile?.email || auth.user.email || null;

  const { data: order, error: orderError } = await auth.supabase
    .from("orders")
    .insert({
      user_id: auth.user.id,
      address_id: address.id,
      customer_name_snapshot: fullName,
      customer_email_snapshot: customerEmail,
      customer_phone_snapshot: phone,
      shipping_address_snapshot: shippingAddress as Json,
      source_url: sourceUrl
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, error: "No se pudo crear el pedido.", url: null, fallbackContact: null, orderId: null };
  }

  const orderItems = cart.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name_snapshot: item.productName,
    model_code_snapshot: item.modelCode,
    selected_color: item.selectedColor,
    selected_size: item.selectedSize,
    quantity: item.quantity,
    sku: item.sku,
    price_snapshot: item.priceSnapshot
  }));

  const { error: itemsError } = await auth.supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    return { ok: false, error: "No se pudieron guardar los productos del pedido.", url: null, fallbackContact: null, orderId: null };
  }

  const addressLine = buildAddressLine({ street, streetNumber, apartment, city, province, postalCode });
  const message = [
    "Pedido ROXWANA",
    `Orden: ${order.id}`,
    "",
    `Cliente: ${fullName}`,
    `Email: ${customerEmail || "-"}`,
    `Telefono: ${phone}`,
    `Direccion: ${addressLine}`,
    deliveryNotes ? `Notas de envio: ${deliveryNotes}` : null,
    "",
    "Productos:",
    ...cart.items.map(
      (item, index) =>
        `${index + 1}. ${item.productName} | Modelo: ${item.modelCode} | SKU: ${item.sku} | Color: ${item.selectedColor} | Talle: ${item.selectedSize} | Cantidad: ${item.quantity}`
    ),
    "",
    "¿Me pasás precio final, disponibilidad y link de pago?"
  ]
    .filter(Boolean)
    .join("\n");

  const { error: messageError } = await auth.supabase.from("orders").update({ whatsapp_message: message }).eq("id", order.id);

  if (messageError) {
    return { ok: false, error: "No se pudo guardar el mensaje del pedido.", url: null, fallbackContact: null, orderId: order.id };
  }

  const { error: eventsError } = await auth.supabase.from("order_events").insert([
    { order_id: order.id, type: "order_created", note: "Pedido creado desde carrito.", created_by: auth.user.id },
    { order_id: order.id, type: "whatsapp_generated", note: "Mensaje de WhatsApp generado.", created_by: auth.user.id }
  ]);

  if (eventsError) {
    return { ok: false, error: "No se pudieron crear los eventos del pedido.", url: null, fallbackContact: null, orderId: order.id };
  }

  const { error: cartError } = await auth.supabase.from("carts").update({ status: "converted" }).eq("id", cart.id);

  if (cartError) {
    return { ok: false, error: "No se pudo convertir el carrito.", url: null, fallbackContact: null, orderId: order.id };
  }

  await auth.supabase.from("carts").insert({ user_id: auth.user.id, status: "active" });

  const settings = await getSiteSettings();
  const url = settings.whatsappEnabled ? buildWhatsAppUrl({ phone: settings.whatsappNumber, message }) : null;

  revalidatePath("/carrito");
  revalidatePath("/command/pedidos");
  revalidatePath("/command/carritos");

  return {
    ok: true,
    error: null,
    url,
    fallbackContact: url ? null : settings.fallbackContact,
    orderId: order.id
  };
}
