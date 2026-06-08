import type { Product } from "@/types/product";

type MessageOptions = {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  quantity?: number;
  sku?: string;
  productUrl?: string;
};

export function buildWhatsAppMessage({ product, selectedColor, selectedSize, quantity = 1, sku, productUrl }: MessageOptions) {
  return [
    `Hola ROXWANA, quiero consultar por ${product.name}.`,
    `Codigo de modelo: ${product.modelCode}`,
    sku ? `SKU: ${sku}` : undefined,
    selectedColor ? `Color: ${selectedColor}` : undefined,
    selectedSize ? `Talle: ${selectedSize}` : undefined,
    `Cantidad: ${quantity}`,
    productUrl ? `Link: ${productUrl}` : `Link: /producto/${product.slug}`,
    "Me pasas precio final, disponibilidad y forma de pago?"
  ]
    .filter(Boolean)
    .join("\n");
}
