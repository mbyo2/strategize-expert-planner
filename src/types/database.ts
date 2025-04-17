
import { Database as SupabaseDatabase } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

// Extend Database types with our custom tables
export interface Database extends SupabaseDatabase {
  public: {
    Tables: SupabaseDatabase['public']['Tables'] & {
      notifications: {
        Row: {
          id: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          timestamp: string;
          isRead: boolean;
          userId?: string;
          relatedEntityId?: string;
          relatedEntityType?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          timestamp?: string;
          isRead?: boolean;
          userId?: string;
          relatedEntityId?: string;
          relatedEntityType?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          timestamp?: string;
          isRead?: boolean;
          userId?: string;
          relatedEntityId?: string;
          relatedEntityType?: string;
          created_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          description?: string;
          logo_url?: string;
          website?: string;
          industry?: string;
          size?: string;
          created_at: string;
          updated_at: string;
          settings: OrganizationSettings;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          logo_url?: string;
          website?: string;
          industry?: string;
          size?: string;
          created_at?: string;
          updated_at?: string;
          settings?: OrganizationSettings;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          logo_url?: string;
          website?: string;
          industry?: string;
          size?: string;
          created_at?: string;
          updated_at?: string;
          settings?: OrganizationSettings;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          description?: string;
          created_at: string;
          updated_at?: string;
          organization_id: string;
          parent_team_id?: string;
          team_type: 'department' | 'project' | 'workgroup' | 'other';
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
          organization_id: string;
          parent_team_id?: string;
          team_type?: 'department' | 'project' | 'workgroup' | 'other';
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
          organization_id?: string;
          parent_team_id?: string;
          team_type?: 'department' | 'project' | 'workgroup' | 'other';
        };
      };
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

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  userId?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  created_at?: string;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  industry?: string;
  size?: string;
  created_at: string;
  updated_at: string;
  settings: OrganizationSettings;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  organization_id: string;
  parent_team_id?: string;
  team_type: 'department' | 'project' | 'workgroup' | 'other';
  members: TeamMember[];
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  company: string;
  department: string;
  job_title: string;
  created_at: string;
  updated_at: string;
  date_format: string;
  app_notifications: boolean;
  email_notifications: boolean;
  weekly_digest: boolean;
  language?: string;
  timezone?: string;
  theme?: string;
  mfa_enabled: boolean;
  ip_restrictions: string[];
  session_timeout_minutes: number;
  require_mfa_for_admin: boolean;
  organization_id?: string;
  primary_team_id?: string;
}

// Organization-related interfaces
export interface OrganizationSettings {
  sso_enabled: boolean;
  sso_provider?: 'saml' | 'oidc' | 'none';
  sso_domain?: string;
  sso_config?: any;
  default_user_role: UserRole;
  allowed_email_domains?: string[];
  enforce_mfa: boolean;
  session_duration_minutes: number;
  ip_restrictions_enabled: boolean;
  allowed_ip_ranges?: string[];
  compliance_mode: 'standard' | 'hipaa' | 'gdpr' | 'custom';
  data_retention_days: number;
  api_rate_limit_per_minute: number;
  webhook_urls?: string[];
  default_timezone?: string;
  default_language?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
  position?: string;
  joinedDate: string;
}

// Role types
export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer';
