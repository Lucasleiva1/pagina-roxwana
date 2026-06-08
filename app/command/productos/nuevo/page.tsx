import { CommandHeader } from "@/components/command/CommandHeader";
import { ProductForm } from "@/components/command/ProductForm";
import { createProductAction } from "@/lib/products/mutations";
import { getProductOptions } from "@/lib/products/queries";

export default async function NuevoProductoPage() {
  const options = await getProductOptions();

  return (
    <div className="grid gap-8">
      <CommandHeader eyebrow="Nuevo producto" title="CARGAR MODELO" description="Crear producto real para el catalogo Supabase." />
      <ProductForm options={options} action={createProductAction} submitLabel="Crear producto" />
    </div>
  );
}
