
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

// Type definitions for our app models
export interface PlanningInitiative {
  id: string;
  name: string;
  description?: string;
  progress: number;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  owner_id?: string;
}

export interface StrategyReview {
  id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  duration_minutes?: number;
  created_at: string;
}

export interface CompanyStrategy {
  id: string;
  vision?: string;
  mission?: string;
  updated_at: string;
  updated_by?: string;
}
