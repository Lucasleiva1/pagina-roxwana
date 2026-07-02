import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProductAction } from "@/lib/products/mutations";
import { getProductOptions, getProductsForAdmin } from "@/lib/products/queries";

type AdminEditarProductoSimpleProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getError(params: Record<string, string | string[] | undefined>) {
  const value = params.error;
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminEditarProductoSimplePage({ params, searchParams }: AdminEditarProductoSimpleProps) {
  const { id } = await params;
  const query = (await searchParams) || {};
  const error = getError(query);
  const [products, options] = await Promise.all([getProductsForAdmin(), getProductOptions()]);
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Formulario simple" title={product.modelCode} description="Respaldo temporal del formulario anterior." />
      {error ? <p className="border border-roxred/45 bg-roxred/10 p-3 text-sm font-bold text-roxred">{error}</p> : null}
      <ProductForm product={product} options={options} action={updateProductAction} submitLabel="Guardar producto" />
    </div>
  );
}
