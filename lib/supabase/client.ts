"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export function createSupabaseBrowserClient(): SupabaseClient<Database> | null {
  const config = getSupabasePublicConfig();

  if (!config) {
    return null;
  }

  return createBrowserClient<Database>(config.url, config.anonKey);
}
