export function getPublicMediaUrl(path: string | null | undefined, fallbackBucket = "site-images") {
  if (!path) {
    return null;
  }

  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return `/${path.replace(/^\/+/, "")}`;
  }

  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${fallbackBucket}/${path.replace(/^\/+/, "")}`;
}
