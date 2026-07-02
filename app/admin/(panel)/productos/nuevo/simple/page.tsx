import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/products/mutations";
import { getProductOptions } from "@/lib/products/queries";

type AdminNuevoProductoSimplePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getError(params: Record<string, string | string[] | undefined>) {
  const value = params.error;
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminNuevoProductoSimplePage({ searchParams }: AdminNuevoProductoSimplePageProps) {
  const params = (await searchParams) || {};
  const error = getError(params);
  const options = await getProductOptions();

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Formulario simple" title="CARGAR MODELO" description="Respaldo temporal del formulario anterior." />
      {error ? <p className="border border-roxred/45 bg-roxred/10 p-3 text-sm font-bold text-roxred">{error}</p> : null}
      <ProductForm options={options} action={createProductAction} submitLabel="Crear producto" />
    </div>
  );
}
