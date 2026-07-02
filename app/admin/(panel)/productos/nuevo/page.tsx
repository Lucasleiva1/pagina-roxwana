import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductStudio } from "@/components/admin/product-studio/ProductStudio";
import { createProductAction } from "@/lib/products/mutations";
import { getProductOptions } from "@/lib/products/queries";

type AdminNuevoProductoPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getError(params: Record<string, string | string[] | undefined>) {
  const value = params.error;
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminNuevoProductoPage({ searchParams }: AdminNuevoProductoPageProps) {
  const params = (await searchParams) || {};
  const error = getError(params);
  const options = await getProductOptions();

  return (
    <div className="grid gap-8">
      <AdminHeader compact eyebrow="Product Studio" title="CARGAR MODELO" description="Crear producto real con ficha, variantes e imagenes numeradas." />
      {error ? <p className="border border-roxred/45 bg-roxred/10 p-3 text-sm font-bold text-roxred">{error}</p> : null}
      <ProductStudio mode="create" options={options} action={createProductAction} submitLabel="Crear producto" />
    </div>
  );
}
