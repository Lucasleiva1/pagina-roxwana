import { RandomPrintTeaser } from "@/components/home/RandomPrintTeaser";
import { BackButton } from "@/components/ui/BackButton";
import { getActiveProducts } from "@/lib/products/queries";

export const dynamic = "force-dynamic";

export default async function RandomPage() {
  const products = await getActiveProducts();

  return (
    <div className="theme-shop bg-ink pt-24">
      <BackButton mode="fixed" />
      <RandomPrintTeaser compact products={products} />
    </div>
  );
}
