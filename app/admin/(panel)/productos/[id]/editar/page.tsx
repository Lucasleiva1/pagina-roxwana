import { redirect } from "next/navigation";

type AdminEditarLegacyProductoProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditarLegacyProductoPage({ params }: AdminEditarLegacyProductoProps) {
  const { id } = await params;
  redirect(`/admin/productos/${id}`);
}
