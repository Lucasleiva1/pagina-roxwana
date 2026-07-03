import { redirect } from "next/navigation";

type AdminEditarProductoSimpleProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditarProductoSimplePage({ params }: AdminEditarProductoSimpleProps) {
  const { id } = await params;
  redirect(`/admin/productos/${id}`);
}
