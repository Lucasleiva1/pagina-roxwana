import { notFound } from "next/navigation";
import { CommandHeader } from "@/components/command/CommandHeader";
import { ProductForm } from "@/components/command/ProductForm";
import { updateProductAction } from "@/lib/products/mutations";
import { getProductOptions, getProductsForCommand } from "@/lib/products/queries";

type EditarProductoProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarProductoPage({ params }: EditarProductoProps) {
  const { id } = await params;
  const [products, options] = await Promise.all([getProductsForCommand(), getProductOptions()]);
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <CommandHeader eyebrow="Editar producto" title={product.modelCode} description="Actualizar datos, estado, variantes e imagenes." />
      <ProductForm product={product} options={options} action={updateProductAction} submitLabel="Guardar producto" />
    </div>
  );
}
