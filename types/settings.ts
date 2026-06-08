export type SiteSettings = {
  id?: string;
  whatsappNumber: string | null;
  whatsappLabel: string | null;
  whatsappEnabled: boolean;
  fallbackContact: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type WhatsAppOrderStatus = "new" | "read" | "done";

export type WhatsAppOrder = {
  id: string;
  productId: string | null;
  productName: string | null;
  modelCode: string | null;
  sku: string | null;
  selectedColor: string | null;
  selectedSize: string | null;
  quantity: number;
  customerName: string | null;
  customerPhone: string | null;
  sourceUrl: string | null;
  message: string | null;
  status: WhatsAppOrderStatus;
  createdAt: string;
};
