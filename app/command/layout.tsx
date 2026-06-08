import type { ReactNode } from "react";
import { CommandShell } from "@/components/command/CommandShell";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

export default async function CommandLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <CommandShell>{children}</CommandShell>;
}
