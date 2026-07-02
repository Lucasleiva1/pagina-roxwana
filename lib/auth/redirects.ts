const DEFAULT_CUSTOMER_PATH = "/productos";
const DEFAULT_SITE_URL = "http://127.0.0.1:3000";

export function getSafeReturnPath(value: string | null | undefined, fallback = DEFAULT_CUSTOMER_PATH) {
  if (!value) {
    return fallback;
  }

  try {
    const decoded = decodeURIComponent(value);

    if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\") || decoded.includes("\n") || decoded.includes("\r")) {
      return fallback;
    }

    return decoded;
  } catch {
    return fallback;
  }
}

export function buildLoginUrl(returnPath: string) {
  return `/login?returnUrl=${encodeURIComponent(getSafeReturnPath(returnPath))}`;
}

export function getPublicSiteUrl(origin?: string) {
  const cleanOrigin = origin?.replace(/\/+$/, "");
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

  if (cleanOrigin) {
    try {
      const url = new URL(cleanOrigin);
      const isLocal = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);

      if (!isLocal) {
        return cleanOrigin;
      }
    } catch {
      return configuredSiteUrl || DEFAULT_SITE_URL;
    }
  }

  return configuredSiteUrl || cleanOrigin || DEFAULT_SITE_URL;
}

export function buildAuthCallbackUrl(returnPath: string, origin?: string) {
  const safeReturnPath = getSafeReturnPath(returnPath);
  return `${getPublicSiteUrl(origin)}/auth/callback?next=${encodeURIComponent(safeReturnPath)}`;
}
