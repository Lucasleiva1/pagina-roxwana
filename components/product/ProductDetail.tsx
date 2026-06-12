import type { Product } from "@/types/product";
import type { SiteSettings } from "@/types/settings";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

export function ProductDetail({ product, settings }: { product: Product; settings: SiteSettings }) {
  return <ProductDetailClient product={product} settings={settings} />;
}
