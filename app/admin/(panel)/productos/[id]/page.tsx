import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductStudio } from "@/components/admin/product-studio/ProductStudio";
import { updateProductAction } from "@/lib/products/mutations";
import { getProductOptions, getProductsForAdmin } from "@/lib/products/queries";

type AdminEditarProductoProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getError(params: Record<string, string | string[] | undefined>) {
  const value = params.error;
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminEditarProductoPage({ params, searchParams }: AdminEditarProductoProps) {
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
      <AdminHeader compact eyebrow="Product Studio" title={product.modelCode} description="Actualizar ficha, variantes, imagenes y estado publico desde una sola pantalla." />
      {error ? <p className="border border-roxred/45 bg-roxred/10 p-3 text-sm font-bold text-roxred">{error}</p> : null}
      <ProductStudio mode="edit" product={product} options={options} action={updateProductAction} submitLabel="Guardar producto" />
    </div>
  );
}
