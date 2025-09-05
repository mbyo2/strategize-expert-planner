export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          description: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          organization_id: string | null
          resource_id: string | null
          resource_type: string
          team_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type: string
          team_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string
          team_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
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
      erp_entities: {
        Row: {
          created_at: string
          created_by: string | null
          entity_data: Json
          entity_type: string
          id: string
          metadata: Json
          module_key: string
          organization_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entity_data?: Json
          entity_type: string
          id?: string
          metadata?: Json
          module_key: string
          organization_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entity_data?: Json
          entity_type?: string
          id?: string
          metadata?: Json
          module_key?: string
          organization_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      erp_modules: {
        Row: {
          created_at: string
          dependencies: string[] | null
          description: string | null
          id: string
          industry_category: string | null
          is_core_module: boolean
          module_key: string
          name: string
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          id?: string
          industry_category?: string | null
          is_core_module?: boolean
          module_key: string
          name: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          id?: string
          industry_category?: string | null
          is_core_module?: boolean
          module_key?: string
          name?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      erp_strategic_links: {
        Row: {
          created_at: string
          erp_entity_id: string
          id: string
          impact_weight: number | null
          link_type: string
          metadata: Json | null
          organization_id: string
          planning_initiative_id: string | null
          strategic_goal_id: string | null
        }
        Insert: {
          created_at?: string
          erp_entity_id: string
          id?: string
          impact_weight?: number | null
          link_type: string
          metadata?: Json | null
          organization_id: string
          planning_initiative_id?: string | null
          strategic_goal_id?: string | null
        }
        Update: {
          created_at?: string
          erp_entity_id?: string
          id?: string
          impact_weight?: number | null
          link_type?: string
          metadata?: Json | null
          organization_id?: string
          planning_initiative_id?: string | null
          strategic_goal_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_erp_entity"
            columns: ["erp_entity_id"]
            isOneToOne: false
            referencedRelation: "erp_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_erp_planning_initiative"
            columns: ["planning_initiative_id"]
            isOneToOne: false
            referencedRelation: "planning_initiatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_erp_strategic_goal"
            columns: ["strategic_goal_id"]
            isOneToOne: false
            referencedRelation: "strategic_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          goal_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          goal_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          goal_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_attachments_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "strategic_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_comments: {
        Row: {
          content: string
          created_at: string | null
          goal_id: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          goal_id: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          goal_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_comments_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "strategic_goals"
            referencedColumns: ["id"]
          },
        ]
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
      initiative_milestones: {
        Row: {
          assigned_to: string | null
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          initiative_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          initiative_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          initiative_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "initiative_milestones_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "planning_initiatives"
            referencedColumns: ["id"]
          },
        ]
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
          is_public: boolean | null
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
          is_public?: boolean | null
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
          is_public?: boolean | null
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
      oauth_connections: {
        Row: {
          connected_at: string | null
          id: string
          provider: string
          provider_data: Json | null
          provider_email: string | null
          provider_user_id: string
          user_id: string
        }
        Insert: {
          connected_at?: string | null
          id?: string
          provider: string
          provider_data?: Json | null
          provider_email?: string | null
          provider_user_id: string
          user_id: string
        }
        Update: {
          connected_at?: string | null
          id?: string
          provider?: string
          provider_data?: Json | null
          provider_email?: string | null
          provider_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          email: string | null
          id: string
          metadata: Json | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      organization_erp_config: {
        Row: {
          active_modules: string[]
          created_at: string
          id: string
          integration_settings: Json
          module_settings: Json
          organization_id: string
          updated_at: string
        }
        Insert: {
          active_modules?: string[]
          created_at?: string
          id?: string
          integration_settings?: Json
          module_settings?: Json
          organization_id: string
          updated_at?: string
        }
        Update: {
          active_modules?: string[]
          created_at?: string
          id?: string
          integration_settings?: Json
          module_settings?: Json
          organization_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      organization_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string
          role: string
          token: string
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id: string
          role?: string
          token?: string
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          role?: string
          token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string | null
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
          budget: number | null
          created_at: string
          currency: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          owner_id: string | null
          priority: string | null
          progress: number
          resources_required: Json | null
          risks: Json | null
          stakeholders: Json | null
          start_date: string | null
          status: string
          success_metrics: Json | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner_id?: string | null
          priority?: string | null
          progress?: number
          resources_required?: Json | null
          risks?: Json | null
          stakeholders?: Json | null
          start_date?: string | null
          status?: string
          success_metrics?: Json | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          priority?: string | null
          progress?: number
          resources_required?: Json | null
          risks?: Json | null
          stakeholders?: Json | null
          start_date?: string | null
          status?: string
          success_metrics?: Json | null
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
          last_login_at: string | null
          mfa_enabled: boolean | null
          name: string | null
          onboarding_completed: boolean | null
          organization_id: string | null
          primary_team_id: string | null
          require_mfa: boolean | null
          require_mfa_for_admin: boolean | null
          role: string | null
          session_timeout_minutes: number | null
          status: string | null
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
          last_login_at?: string | null
          mfa_enabled?: boolean | null
          name?: string | null
          onboarding_completed?: boolean | null
          organization_id?: string | null
          primary_team_id?: string | null
          require_mfa?: boolean | null
          require_mfa_for_admin?: boolean | null
          role?: string | null
          session_timeout_minutes?: number | null
          status?: string | null
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
          last_login_at?: string | null
          mfa_enabled?: boolean | null
          name?: string | null
          onboarding_completed?: boolean | null
          organization_id?: string | null
          primary_team_id?: string | null
          require_mfa?: boolean | null
          require_mfa_for_admin?: boolean | null
          role?: string | null
          session_timeout_minutes?: number | null
          status?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          weekly_digest?: boolean | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          category: string
          confidence_score: number | null
          created_at: string
          description: string
          expires_at: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          confidence_score?: number | null
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          confidence_score?: number | null
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      strategic_goals: {
        Row: {
          category: string | null
          created_at: string
          current_value: number | null
          dependencies: Json | null
          description: string | null
          due_date: string | null
          id: string
          milestones: Json | null
          name: string
          owner_id: string | null
          priority: string | null
          progress: number
          risk_level: string | null
          start_date: string | null
          status: string
          target_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          current_value?: number | null
          dependencies?: Json | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestones?: Json | null
          name: string
          owner_id?: string | null
          priority?: string | null
          progress?: number
          risk_level?: string | null
          start_date?: string | null
          status?: string
          target_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          current_value?: number | null
          dependencies?: Json | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestones?: Json | null
          name?: string
          owner_id?: string | null
          priority?: string | null
          progress?: number
          risk_level?: string | null
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
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
          weight?: number | null
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
      support_ticket_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          ticket_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          category: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          priority: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          category?: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          priority?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          priority?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
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
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: string
          team_id: string
          token: string
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
          team_id: string
          token?: string
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
          team_id?: string
          token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          department: string | null
          id: string
          invited_by: string | null
          joined_date: string
          position: string | null
          role: string
          status: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          department?: string | null
          id?: string
          invited_by?: string | null
          joined_date?: string
          position?: string | null
          role: string
          status?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          department?: string | null
          id?: string
          invited_by?: string | null
          joined_date?: string
          position?: string | null
          role?: string
          status?: string | null
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
      team_messages: {
        Row: {
          content: string
          created_at: string
          edited_at: string | null
          id: string
          message_type: string
          metadata: Json | null
          reactions: Json | null
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          edited_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          reactions?: Json | null
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          reactions?: Json | null
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_tasks: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          tags: string[] | null
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          tags?: string[] | null
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          tags?: string[] | null
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      user_mfa_methods: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          method_type: string
          phone_number: string | null
          secret: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          method_type: string
          phone_number?: string | null
          secret?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          method_type?: string
          phone_number?: string | null
          secret?: string | null
          updated_at?: string | null
          user_id?: string
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
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_secure_session_hash: {
        Args: { user_id_param: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      has_role_level: {
        Args: { required_role: string; user_uuid: string }
        Returns: boolean
      }
      is_session_valid: {
        Args: { session_hash: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "manager" | "analyst" | "viewer" | "superuser"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "manager", "analyst", "viewer", "superuser"],
    },
  },
} as const
