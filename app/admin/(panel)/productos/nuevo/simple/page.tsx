import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/products/mutations";
import { getProductOptions } from "@/lib/products/queries";

export default async function AdminNuevoProductoSimplePage() {
  const options = await getProductOptions();

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Formulario simple" title="CARGAR MODELO" description="Respaldo temporal del formulario anterior." />
      <ProductForm options={options} action={createProductAction} submitLabel="Crear producto" />
    </div>
  );
}
