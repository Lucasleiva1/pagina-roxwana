import type { Json } from "@/types/supabase";

export type CustomerProfile = {
  id: string;
  userId: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  marketingConsent: boolean;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
};

export type CartStatus = "active" | "converted" | "abandoned";
export type OrderStatus = "new" | "contacted" | "payment_sent" | "paid" | "shipped" | "cancelled";
export type OrderEventType = "order_created" | "whatsapp_generated" | "admin_contacted" | "payment_link_sent" | "paid" | "shipped" | "cancelled" | "admin_note";

export type CartItem = {
  id: string;
  cartId: string;
  productId: string | null;
  productName: string;
  modelCode: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  sku: string;
  priceSnapshot: number | null;
  createdAt: string;
  updatedAt: string;
};

export type Cart = {
  id: string;
  userId: string;
  status: CartStatus;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export type CustomerAddress = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  streetNumber: string;
  apartment: string | null;
  city: string;
  province: string;
  postalCode: string;
  deliveryNotes: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  modelCode: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  sku: string;
  priceSnapshot: number | null;
  createdAt: string;
};

export type OrderEvent = {
  id: string;
  orderId: string;
  type: OrderEventType;
  note: string | null;
  createdBy: string | null;
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;
  addressId: string | null;
  status: OrderStatus;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  shippingAddress: Json;
  whatsappMessage: string | null;
  sourceUrl: string | null;
  items: OrderItem[];
  events: OrderEvent[];
  createdAt: string;
  updatedAt: string;
};
