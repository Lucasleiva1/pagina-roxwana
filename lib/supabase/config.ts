export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured() {
  return Boolean(getSupabasePublicConfig());
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000";
}
