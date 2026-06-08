export function normalizeWhatsAppPhone(phone: string | null | undefined) {
  const value = (phone || "").replace(/[^\d]/g, "");
  return value.length >= 8 ? value : null;
}

export function buildWhatsAppUrl({ phone, message }: { phone: string | null | undefined; message: string }) {
  const normalized = normalizeWhatsAppPhone(phone);

  if (!normalized) {
    return null;
  }

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
