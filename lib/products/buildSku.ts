import type { Product, ProductColor, ProductSize } from "@/types/product";

export function buildSku(product: Product, color?: ProductColor["code"], size?: ProductSize) {
  const parts = ["RXW", product.garmentType, product.model];

  if (color) {
    parts.push(color);
  }

  if (size) {
    parts.push(size);
  }

  return parts.join("-");
}
