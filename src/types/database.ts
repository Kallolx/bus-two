// Database types that match the Supabase schema

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          stall_name: string;
          stall_description: string | null;
          stall_logo_url: string | null;
          phone: string | null;
          address: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          stall_name: string;
          stall_description?: string | null;
          stall_logo_url?: string | null;
          phone?: string | null;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          stall_name?: string;
          stall_description?: string | null;
          stall_logo_url?: string | null;
          phone?: string | null;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          quantity: number;
          unit: 'kg' | 'pc' | 'ltr' | 'gm';
          low_stock_threshold: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          quantity?: number;
          unit: 'kg' | 'pc' | 'ltr' | 'gm';
          low_stock_threshold?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          quantity?: number;
          unit?: 'kg' | 'pc' | 'ltr' | 'gm';
          low_stock_threshold?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_available: boolean;
          is_public: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean;
          is_public?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_available?: boolean;
          is_public?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          token: number;
          total: number;
          fulfillment_type: 'dine-in' | 'takeaway' | 'delivery';
          payment_method: 'cash' | 'digital';
          status: 'waiting' | 'cooking' | 'ready' | 'completed' | 'cancelled';
          customer_name: string | null;
          customer_phone: string | null;
          delivery_address: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          token: number;
          total: number;
          fulfillment_type: 'dine-in' | 'takeaway' | 'delivery';
          payment_method: 'cash' | 'digital';
          status?: 'waiting' | 'cooking' | 'ready' | 'completed' | 'cancelled';
          customer_name?: string | null;
          customer_phone?: string | null;
          delivery_address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          token?: number;
          total?: number;
          fulfillment_type?: 'dine-in' | 'takeaway' | 'delivery';
          payment_method?: 'cash' | 'digital';
          status?: 'waiting' | 'cooking' | 'ready' | 'completed' | 'cancelled';
          customer_name?: string | null;
          customer_phone?: string | null;
          delivery_address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
