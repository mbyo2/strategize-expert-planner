export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          affected_units: string[] | null
          confidence_score: number | null
          coordinates: Json | null
          created_at: string
          description: string
          expires_at: string | null
          id: string
          priority: string
          recommendation_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          affected_units?: string[] | null
          confidence_score?: number | null
          coordinates?: Json | null
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          priority?: string
          recommendation_type: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          affected_units?: string[] | null
          confidence_score?: number | null
          coordinates?: Json | null
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          priority?: string
          recommendation_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          page_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      company_strategy: {
        Row: {
          id: string
          mission: string | null
          updated_at: string
          updated_by: string | null
          vision: string | null
        }
        Insert: {
          id?: string
          mission?: string | null
          updated_at?: string
          updated_by?: string | null
          vision?: string | null
        }
        Update: {
          id?: string
          mission?: string | null
          updated_at?: string
          updated_by?: string | null
          vision?: string | null
        }
        Relationships: []
      }
      data_imports: {
        Row: {
          completed_at: string | null
          created_at: string
          error_log: Json | null
          failed_records: number | null
          file_name: string
          file_size: number | null
          id: string
          import_type: string
          processed_records: number | null
          status: string
          total_records: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_log?: Json | null
          failed_records?: number | null
          file_name: string
          file_size?: number | null
          id?: string
          import_type: string
          processed_records?: number | null
          status?: string
          total_records?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_log?: Json | null
          failed_records?: number | null
          file_name?: string
          file_size?: number | null
          id?: string
          import_type?: string
          processed_records?: number | null
          status?: string
          total_records?: number | null
          user_id?: string
        }
        Relationships: []
      }
      drones: {
        Row: {
          altitude: number
          battery_level: number
          camera_feed_url: string | null
          created_at: string
          drone_id: string
          id: string
          last_telemetry: string
          latitude: number
          longitude: number
          mission_type: string | null
          model: string
          operator_id: string | null
          status: string
          target_coordinates: Json | null
          updated_at: string
        }
        Insert: {
          altitude: number
          battery_level?: number
          camera_feed_url?: string | null
          created_at?: string
          drone_id: string
          id?: string
          last_telemetry?: string
          latitude: number
          longitude: number
          mission_type?: string | null
          model: string
          operator_id?: string | null
          status?: string
          target_coordinates?: Json | null
          updated_at?: string
        }
        Update: {
          altitude?: number
          battery_level?: number
          camera_feed_url?: string | null
          created_at?: string
          drone_id?: string
          id?: string
          last_telemetry?: string
          latitude?: number
          longitude?: number
          mission_type?: string | null
          model?: string
          operator_id?: string | null
          status?: string
          target_coordinates?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      industry_metrics: {
        Row: {
          category: string
          change_percentage: number | null
          id: string
          name: string
          previous_value: number | null
          source: string | null
          trend: string | null
          updated_at: string
          value: number
        }
        Insert: {
          category: string
          change_percentage?: number | null
          id?: string
          name: string
          previous_value?: number | null
          source?: string | null
          trend?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          category?: string
          change_percentage?: number | null
          id?: string
          name?: string
          previous_value?: number | null
          source?: string | null
          trend?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      market_changes: {
        Row: {
          category: string | null
          date_identified: string
          description: string
          id: string
          impact_level: string
          source: string | null
          title: string
        }
        Insert: {
          category?: string | null
          date_identified?: string
          description: string
          id?: string
          impact_level: string
          source?: string | null
          title: string
        }
        Update: {
          category?: string | null
          date_identified?: string
          description?: string
          id?: string
          impact_level?: string
          source?: string | null
          title?: string
        }
        Relationships: []
      }
      mission_objectives: {
        Row: {
          assigned_units: string[] | null
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          latitude: number
          longitude: number
          objective_id: string
          objective_type: string
          priority: string
          radius: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_units?: string[] | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          latitude: number
          longitude: number
          objective_id: string
          objective_type: string
          priority?: string
          radius?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_units?: string[] | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          latitude?: number
          longitude?: number
          objective_id?: string
          objective_type?: string
          priority?: string
          radius?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          isRead: boolean
          message: string
          relatedEntityId: string | null
          relatedEntityType: string | null
          timestamp: string
          type: string
          userId: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          isRead?: boolean
          message: string
          relatedEntityId?: string | null
          relatedEntityType?: string | null
          timestamp?: string
          type: string
          userId?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          isRead?: boolean
          message?: string
          relatedEntityId?: string | null
          relatedEntityType?: string | null
          timestamp?: string
          type?: string
          userId?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          settings: Json
          size: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          settings?: Json
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          settings?: Json
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      planning_initiatives: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          owner_id: string | null
          progress: number
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner_id?: string | null
          progress?: number
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          progress?: number
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          app_notifications: boolean | null
          avatar: string | null
          bio: string | null
          company: string | null
          created_at: string
          date_format: string | null
          department: string | null
          email: string | null
          email_notifications: boolean | null
          id: string
          ip_restrictions: string[] | null
          job_title: string | null
          language: string | null
          mfa_enabled: boolean | null
          name: string | null
          organization_id: string | null
          primary_team_id: string | null
          require_mfa_for_admin: boolean | null
          session_timeout_minutes: number | null
          theme: string | null
          timezone: string | null
          updated_at: string
          weekly_digest: boolean | null
        }
        Insert: {
          app_notifications?: boolean | null
          avatar?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          date_format?: string | null
          department?: string | null
          email?: string | null
          email_notifications?: boolean | null
          id: string
          ip_restrictions?: string[] | null
          job_title?: string | null
          language?: string | null
          mfa_enabled?: boolean | null
          name?: string | null
          organization_id?: string | null
          primary_team_id?: string | null
          require_mfa_for_admin?: boolean | null
          session_timeout_minutes?: number | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          weekly_digest?: boolean | null
        }
        Update: {
          app_notifications?: boolean | null
          avatar?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          date_format?: string | null
          department?: string | null
          email?: string | null
          email_notifications?: boolean | null
          id?: string
          ip_restrictions?: string[] | null
          job_title?: string | null
          language?: string | null
          mfa_enabled?: boolean | null
          name?: string | null
          organization_id?: string | null
          primary_team_id?: string | null
          require_mfa_for_admin?: boolean | null
          session_timeout_minutes?: number | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          weekly_digest?: boolean | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          category: string | null
          created_at: string
          description: string
          id: string
          priority: number
          status: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: number
          status?: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: number
          status?: string
          title?: string
        }
        Relationships: []
      }
      strategic_goals: {
        Row: {
          created_at: string
          current_value: number | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          progress: number
          start_date: string | null
          status: string
          target_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          progress?: number
          start_date?: string | null
          status?: string
          target_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          progress?: number
          start_date?: string | null
          status?: string
          target_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      strategic_pillars: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      strategy_reviews: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          scheduled_date: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          scheduled_date: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          scheduled_date?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      tactical_units: {
        Row: {
          altitude: number | null
          callsign: string
          created_at: string
          heading: number | null
          id: string
          last_contact: string
          latitude: number
          longitude: number
          metadata: Json | null
          status: string
          unit_id: string
          unit_type: string
          updated_at: string
        }
        Insert: {
          altitude?: number | null
          callsign: string
          created_at?: string
          heading?: number | null
          id?: string
          last_contact?: string
          latitude: number
          longitude: number
          metadata?: Json | null
          status?: string
          unit_id: string
          unit_type: string
          updated_at?: string
        }
        Update: {
          altitude?: number | null
          callsign?: string
          created_at?: string
          heading?: number | null
          id?: string
          last_contact?: string
          latitude?: number
          longitude?: number
          metadata?: Json | null
          status?: string
          unit_id?: string
          unit_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          department: string | null
          id: string
          joined_date: string
          position: string | null
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          department?: string | null
          id?: string
          joined_date?: string
          position?: string | null
          role: string
          team_id: string
          user_id: string
        }
        Update: {
          department?: string | null
          id?: string
          joined_date?: string
          position?: string | null
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string | null
          parent_team_id: string | null
          team_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          parent_team_id?: string | null
          team_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          parent_team_id?: string | null
          team_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      threat_intelligence: {
        Row: {
          created_at: string
          description: string
          expires_at: string | null
          id: string
          latitude: number
          longitude: number
          radius: number
          reported_by: string | null
          severity: string
          source: string
          threat_type: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          latitude: number
          longitude: number
          radius?: number
          reported_by?: string | null
          severity?: string
          source: string
          threat_type: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          radius?: number
          reported_by?: string | null
          severity?: string
          source?: string
          threat_type?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "manager" | "analyst" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "manager", "analyst", "viewer"],
    },
  },
} as const
