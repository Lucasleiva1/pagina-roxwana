import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { mockProducts } from "@/data/mockProducts";
import { getProductBySlug } from "@/lib/products/queries";
import { getSiteSettings } from "@/lib/settings/getSiteSettings";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return mockProducts.map((product) => ({
    slug: product.slug
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()]);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} settings={settings} />;
}
