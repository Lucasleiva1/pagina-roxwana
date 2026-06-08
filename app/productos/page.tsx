import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProductOptions, searchProducts } from "@/lib/products/queries";
import type { ProductFilters as ProductFiltersType } from "@/types/product";

export const dynamic = "force-dynamic";

type ProductosPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const params = (await searchParams) || {};
  const filters: ProductFiltersType = {
    q: getParam(params, "q") || undefined,
    gender: (getParam(params, "gender") as ProductFiltersType["gender"]) || "all",
    garmentType: getParam(params, "garmentType") || undefined,
    color: getParam(params, "color") || undefined,
    size: getParam(params, "size") || undefined
  };
  const [products, options] = await Promise.all([searchProducts(filters), getProductOptions()]);

  return (
      <section className="theme-shop bg-ink pb-20 pt-32">
      <div className="rox-container">
        <SectionHeader
          eyebrow="Shop"
          title="TODOS LOS MODELOS"
          description="Catalogo ROXWANA conectado a productos reales, con filtros simples y presencia de marca."
        />
        <div className="mt-8">
          <ProductFilters filters={filters} garmentTypes={options.garmentTypes} colors={options.colors} sizes={options.sizes} />
        </div>
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
