import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductStudio } from "@/components/admin/product-studio/ProductStudio";
import { createProductAction } from "@/lib/products/mutations";
import { getProductOptions } from "@/lib/products/queries";

export default async function AdminNuevoProductoPage() {
  const options = await getProductOptions();

  return (
    <div className="grid gap-8">
      <AdminHeader compact eyebrow="Product Studio" title="CARGAR MODELO" description="Crear producto real con ficha, variantes e imagenes numeradas." />
      <ProductStudio mode="create" options={options} action={createProductAction} submitLabel="Crear producto" />
    </div>
  );
}
