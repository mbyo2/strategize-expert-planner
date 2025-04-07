
import { Database as SupabaseDatabase } from "@/integrations/supabase/types";

// Extend Database types with our custom tables
export interface Database extends SupabaseDatabase {
  public: {
    Tables: SupabaseDatabase['public']['Tables'] & {
      // Additional custom tables can be added here
    };
    Views: SupabaseDatabase['public']['Views'];
    Functions: SupabaseDatabase['public']['Functions'];
    Enums: SupabaseDatabase['public']['Enums'];
    CompositeTypes: SupabaseDatabase['public']['CompositeTypes'];
  };
}
