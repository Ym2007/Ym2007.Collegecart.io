export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          college_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          college_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          college_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string | null;
          created_at: string;
        };
      };
      marketplace_listings: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          title: string;
          description: string;
          price: number;
          images: string[];
          condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
          status: 'available' | 'sold' | 'reserved';
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          title: string;
          description: string;
          price: number;
          images?: string[];
          condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
          status?: 'available' | 'sold' | 'reserved';
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          title?: string;
          description?: string;
          price?: number;
          images?: string[];
          condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
          status?: 'available' | 'sold' | 'reserved';
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pg_accommodations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          address: string;
          latitude: number;
          longitude: number;
          rent_per_month: number;
          amenities: string[];
          room_type: 'single' | 'double' | 'triple' | 'shared';
          images: string[];
          contact_phone: string;
          available_from: string | null;
          gender_preference: 'male' | 'female' | 'any' | null;
          status: 'available' | 'occupied';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          address: string;
          latitude: number;
          longitude: number;
          rent_per_month: number;
          amenities?: string[];
          room_type: 'single' | 'double' | 'triple' | 'shared';
          images?: string[];
          contact_phone: string;
          available_from?: string | null;
          gender_preference?: 'male' | 'female' | 'any' | null;
          status?: 'available' | 'occupied';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          rent_per_month?: number;
          amenities?: string[];
          room_type?: 'single' | 'double' | 'triple' | 'shared';
          images?: string[];
          contact_phone?: string;
          available_from?: string | null;
          gender_preference?: 'male' | 'female' | 'any' | null;
          status?: 'available' | 'occupied';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
