import type { ProductGender, ProductStatus } from "@/types/product";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string | null;
          name: string | null;
          phone: string | null;
          avatar_url: string | null;
          marketing_consent: boolean;
          role: "customer" | "editor" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { user_id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      garment_types: {
        Row: { id: string; code: string; name: string; created_at: string };
        Insert: { id?: string; code: string; name: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["garment_types"]["Row"]>;
        Relationships: [];
      };
      colors: {
        Row: { id: string; code: string; name: string; hex: string | null; created_at: string };
        Insert: { id?: string; code: string; name: string; hex?: string | null; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["colors"]["Row"]>;
        Relationships: [];
      };
      sizes: {
        Row: { id: string; code: string; name: string; sort_order: number };
        Insert: { id?: string; code: string; name: string; sort_order: number };
        Update: Partial<Database["public"]["Tables"]["sizes"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          model_code: string;
          name: string;
          slug: string;
          garment_type_id: string;
          gender: ProductGender;
          description: string | null;
          description_short: string | null;
          description_long: string | null;
          status: ProductStatus;
          featured: boolean;
          price: number;
          compare_at_price: number | null;
          category_id: string | null;
          collection_id: string | null;
          sort_order: number;
          main_image_path: string | null;
          whatsapp_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          model_code: string;
          name: string;
          slug: string;
          garment_type_id: string;
          gender: ProductGender;
          description?: string | null;
          description_short?: string | null;
          description_long?: string | null;
          status: ProductStatus;
          featured?: boolean;
          price: number;
          compare_at_price?: number | null;
          category_id?: string | null;
          collection_id?: string | null;
          sort_order?: number;
          main_image_path?: string | null;
          whatsapp_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          hero_image_path: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          hero_image_path?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
        Relationships: [];
      };
      product_colors: {
        Row: { product_id: string; color_id: string };
        Insert: { product_id: string; color_id: string };
        Update: Partial<Database["public"]["Tables"]["product_colors"]["Row"]>;
        Relationships: [];
      };
      product_sizes: {
        Row: { product_id: string; size_id: string };
        Insert: { product_id: string; size_id: string };
        Update: Partial<Database["public"]["Tables"]["product_sizes"]["Row"]>;
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          path: string | null;
          bucket: string;
          alt: string | null;
          sort_order: number;
          is_primary: boolean;
          file_type: string | null;
          size: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          path?: string | null;
          bucket?: string;
          alt?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          file_type?: string | null;
          size?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Row"]>;
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string | null;
          color: string | null;
          stock: number;
          sku: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          size?: string | null;
          color?: string | null;
          stock?: number;
          sku?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Row"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          whatsapp_number: string | null;
          whatsapp_label: string | null;
          whatsapp_enabled: boolean;
          fallback_contact: string | null;
          instagram_url: string | null;
          tiktok_url: string | null;
          contact_email: string | null;
          global_cta_label: string | null;
          global_cta_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Relationships: [];
      };
      site_sections: {
        Row: {
          id: string;
          key: string;
          type: string;
          title: string | null;
          subtitle: string | null;
          body: string | null;
          image_path: string | null;
          cta_label: string | null;
          cta_url: string | null;
          is_visible: boolean;
          sort_order: number;
          metadata: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          type: string;
          title?: string | null;
          subtitle?: string | null;
          body?: string | null;
          image_path?: string | null;
          cta_label?: string | null;
          cta_url?: string | null;
          is_visible?: boolean;
          sort_order?: number;
          metadata?: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_sections"]["Row"]>;
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          path: string;
          bucket: string;
          alt_text: string | null;
          file_type: string | null;
          size: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          path: string;
          bucket: string;
          alt_text?: string | null;
          file_type?: string | null;
          size?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["media_assets"]["Row"]>;
        Relationships: [];
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
        Relationships: [];
      };
      whatsapp_orders: {
        Row: {
          id: string;
          product_id: string | null;
          product_name: string | null;
          model_code: string | null;
          sku: string | null;
          selected_color: string | null;
          selected_size: string | null;
          quantity: number;
          customer_name: string | null;
          customer_phone: string | null;
          source_url: string | null;
          message: string | null;
          status: "new" | "read" | "done";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["whatsapp_orders"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["whatsapp_orders"]["Row"]>;
        Relationships: [];
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          status: "active" | "converted" | "abandoned";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["carts"]["Row"]> & { user_id: string };
        Update: Partial<Database["public"]["Tables"]["carts"]["Row"]>;
        Relationships: [];
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string | null;
          product_name_snapshot: string;
          model_code_snapshot: string;
          selected_color: string;
          selected_size: string;
          quantity: number;
          sku: string;
          price_snapshot: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id?: string | null;
          product_name_snapshot: string;
          model_code_snapshot: string;
          selected_color: string;
          selected_size: string;
          quantity?: number;
          sku: string;
          price_snapshot?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cart_items"]["Row"]>;
        Relationships: [];
      };
      customer_addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          street: string;
          street_number: string;
          apartment: string | null;
          city: string;
          province: string;
          postal_code: string;
          delivery_notes: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone: string;
          street: string;
          street_number: string;
          apartment?: string | null;
          city: string;
          province: string;
          postal_code: string;
          delivery_notes?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customer_addresses"]["Row"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          address_id: string | null;
          status: "new" | "contacted" | "payment_sent" | "paid" | "shipped" | "cancelled";
          customer_name_snapshot: string;
          customer_email_snapshot: string | null;
          customer_phone_snapshot: string;
          shipping_address_snapshot: Json;
          whatsapp_message: string | null;
          source_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          address_id?: string | null;
          status?: "new" | "contacted" | "payment_sent" | "paid" | "shipped" | "cancelled";
          customer_name_snapshot: string;
          customer_email_snapshot?: string | null;
          customer_phone_snapshot: string;
          shipping_address_snapshot: Json;
          whatsapp_message?: string | null;
          source_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name_snapshot: string;
          model_code_snapshot: string;
          selected_color: string;
          selected_size: string;
          quantity: number;
          sku: string;
          price_snapshot: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name_snapshot: string;
          model_code_snapshot: string;
          selected_color: string;
          selected_size: string;
          quantity: number;
          sku: string;
          price_snapshot?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
        Relationships: [];
      };
      order_events: {
        Row: {
          id: string;
          order_id: string;
          type: "order_created" | "whatsapp_generated" | "admin_contacted" | "payment_link_sent" | "paid" | "shipped" | "cancelled" | "admin_note";
          note: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          type: Database["public"]["Tables"]["order_events"]["Row"]["type"];
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_events"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
