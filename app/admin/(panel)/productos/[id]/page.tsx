import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProductAction } from "@/lib/products/mutations";
import { getProductOptions, getProductsForAdmin } from "@/lib/products/queries";

type AdminEditarProductoProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditarProductoPage({ params }: AdminEditarProductoProps) {
  const { id } = await params;
  const [products, options] = await Promise.all([getProductsForAdmin(), getProductOptions()]);
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Editar producto" title={product.modelCode} description="Actualizar catalogo, variantes, imagenes y estado publico." />
      <ProductForm product={product} options={options} action={updateProductAction} submitLabel="Guardar producto" />
    </div>
  );
}
