import { RandomPrintTeaser } from "@/components/home/RandomPrintTeaser";
import { getActiveProducts } from "@/lib/products/queries";

export const dynamic = "force-dynamic";

export default async function RandomPage() {
  const products = await getActiveProducts();

  return (
    <div className="theme-shop bg-ink pt-24">
      <RandomPrintTeaser compact products={products} />
    </div>
  );
}
