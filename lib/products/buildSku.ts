import type { Product, ProductColor, ProductSize } from "@/types/product";

export function buildSku(product: Product, color: ProductColor["code"], size: ProductSize) {
  return `RXW-${product.garmentType}-${product.model}-${color}-${size}`;
}
