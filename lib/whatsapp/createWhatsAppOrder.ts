"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/settings/getSiteSettings";
import { getProductById } from "@/lib/products/queries";
import { buildSku } from "@/lib/products/buildSku";
import { buildWhatsAppMessage } from "@/lib/whatsapp/buildWhatsAppMessage";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type CreateOrderInput = {
  productId: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  sourceUrl: string;
};

export type CreateOrderResult = {
  ok: boolean;
  url: string | null;
  message: string;
  fallbackContact: string | null;
  error?: string;
};

function clampQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.min(Math.max(Math.round(quantity), 1), 20);
}

export async function createWhatsAppOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const product = await getProductById(input.productId);

  if (!product) {
    return {
      ok: false,
      url: null,
      message: "",
      fallbackContact: null,
      error: "Producto no disponible."
    };
  }

  const selectedColor = input.selectedColor.trim().toUpperCase();
  const selectedSize = input.selectedSize.trim().toUpperCase();

  if (!product.colors.some((color) => color.code === selectedColor) || !product.sizes.includes(selectedSize)) {
    return {
      ok: false,
      url: null,
      message: "",
      fallbackContact: null,
      error: "Selecciona un color y talle disponibles."
    };
  }

  const quantity = clampQuantity(input.quantity);
  const settings = await getSiteSettings();
  const sku = buildSku(product, selectedColor, selectedSize);
  const message = buildWhatsAppMessage({
    product,
    selectedColor,
    selectedSize,
    quantity,
    sku,
    productUrl: input.sourceUrl
  });

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      await supabase.from("whatsapp_orders").insert({
        product_id: product.id || null,
        product_name: product.name,
        model_code: product.modelCode,
        sku,
        selected_color: selectedColor,
        selected_size: selectedSize,
        quantity,
        source_url: input.sourceUrl,
        message,
        status: "new"
      });
    }
  }

  const url = settings.whatsappEnabled ? buildWhatsAppUrl({ phone: settings.whatsappNumber, message }) : null;

  return {
    ok: true,
    url,
    message,
    fallbackContact: url ? null : settings.fallbackContact
  };
}
