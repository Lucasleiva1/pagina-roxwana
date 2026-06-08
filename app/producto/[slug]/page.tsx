import { notFound } from "next/navigation";
import { ProductDetailMock } from "@/components/product/ProductDetailMock";
import { mockProducts } from "@/data/mockProducts";

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
  const product = mockProducts.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailMock product={product} />;
}
