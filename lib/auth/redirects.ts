const DEFAULT_CUSTOMER_PATH = "/productos";

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
