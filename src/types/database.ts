
import { Database as SupabaseDatabase } from "@/integrations/supabase/types";

// Extend Database types with our custom tables
export interface Database extends SupabaseDatabase {
  public: {
    Tables: SupabaseDatabase['public']['Tables'] & {
      strategic_goals: {
        Row: {
          id: string;
          name: string;
          description?: string;
          progress: number;
          status: string;
          start_date?: string;
          due_date?: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          target_value?: number;
          current_value?: number;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          progress?: number;
          status?: string;
          start_date?: string;
          due_date?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          target_value?: number;
          current_value?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          progress?: number;
          status?: string;
          start_date?: string;
          due_date?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          target_value?: number;
          current_value?: number;
        };
      };
      industry_metrics: {
        Row: {
          id: string;
          name: string;
          value: number;
          previous_value?: number;
          change_percentage?: number;
          trend?: string;
          category: string;
          updated_at: string;
          source?: string;
        };
        Insert: {
          id?: string;
          name: string;
          value: number;
          previous_value?: number;
          change_percentage?: number;
          trend?: string;
          category: string;
          updated_at?: string;
          source?: string;
        };
        Update: {
          id?: string;
          name?: string;
          value?: number;
          previous_value?: number;
          change_percentage?: number;
          trend?: string;
          category?: string;
          updated_at?: string;
          source?: string;
        };
      };
      market_changes: {
        Row: {
          id: string;
          title: string;
          description: string;
          impact_level: string;
          date_identified: string;
          source?: string;
          category?: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          impact_level: string;
          date_identified?: string;
          source?: string;
          category?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          impact_level?: string;
          date_identified?: string;
          source?: string;
          category?: string;
        };
      };
      recommendations: {
        Row: {
          id: string;
          title: string;
          description: string;
          priority: number;
          created_at: string;
          status: string;
          category?: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          priority?: number;
          created_at?: string;
          status?: string;
          category?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          priority?: number;
          created_at?: string;
          status?: string;
          category?: string;
        };
      };
      strategy_reviews: {
        Row: {
          id: string;
          title: string;
          description?: string;
          scheduled_date: string;
          duration_minutes?: number;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          scheduled_date: string;
          duration_minutes?: number;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          scheduled_date?: string;
          duration_minutes?: number;
          created_at?: string;
          status?: string;
        };
      };
      planning_initiatives: {
        Row: {
          id: string;
          name: string;
          description?: string;
          status: string;
          progress: number;
          start_date?: string;
          end_date?: string;
          created_at: string;
          updated_at: string;
          owner_id?: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          status?: string;
          progress?: number;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
          owner_id?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          status?: string;
          progress?: number;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
          owner_id?: string;
        };
      };
      company_strategy: {
        Row: {
          id: string;
          vision?: string;
          mission?: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id?: string;
          vision?: string;
          mission?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          vision?: string;
          mission?: string;
          updated_at?: string;
          updated_by?: string;
        };
      };
    };
  };
}
