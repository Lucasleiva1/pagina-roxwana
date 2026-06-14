import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/products/mutations";
import { getProductOptions } from "@/lib/products/queries";

export default async function AdminNuevoProductoPage() {
  const options = await getProductOptions();

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Nuevo producto" title="CARGAR MODELO" description="Crear producto real para catalogo, drop y home." />
      <ProductForm options={options} action={createProductAction} submitLabel="Crear producto" />
    </div>
  );
}
