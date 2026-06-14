"use client";

import type { ReactNode } from "react";

export function ConfirmDeleteDialog({ children, message = "Confirmar accion irreversible?" }: { children: ReactNode; message?: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className="border border-roxred/50 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-roxred transition hover:border-roxred hover:bg-roxred/10"
    >
      {children}
    </button>
  );
}
