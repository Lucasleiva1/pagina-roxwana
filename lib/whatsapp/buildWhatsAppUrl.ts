export const WHATSAPP_FALLBACK_NUMBER = "5491100000000";

export function getWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || WHATSAPP_FALLBACK_NUMBER;
}

export function hasConfiguredWhatsAppNumber() {
  return Boolean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}
