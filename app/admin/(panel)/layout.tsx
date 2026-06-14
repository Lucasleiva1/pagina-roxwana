import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireStaff();
  return <AdminShell profile={profile}>{children}</AdminShell>;
}
