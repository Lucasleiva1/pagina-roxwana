import type { Product, ProductColor, ProductSize } from "@/types/product";
import { buildSku } from "@/lib/products/buildSku";

type MessageOptions = {
  color?: ProductColor["code"];
  size?: ProductSize;
  productUrl?: string;
};

export function buildWhatsAppMessage(product: Product, options: MessageOptions = {}) {
  const sku = options.color && options.size ? buildSku(product, options.color, options.size) : undefined;
  const productLine = options.productUrl ? `Link: ${options.productUrl}` : `Link: /producto/${product.slug}`;

  return [
    `Hola ROXWANA, quiero consultar por ${product.name}.`,
    `Codigo de modelo: ${product.modelCode}`,
    sku ? `SKU: ${sku}` : undefined,
    productLine,
    "Me pasas precio final, disponibilidad y forma de pago?"
  ]
    .filter(Boolean)
    .join("\n");
}
