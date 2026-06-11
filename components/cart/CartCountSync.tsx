"use client";

import { useEffect } from "react";

export function CartCountSync({ count }: { count: number }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("roxwana-cart-count", { detail: { count } }));
  }, [count]);

  return null;
}
