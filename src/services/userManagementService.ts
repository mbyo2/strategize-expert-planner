import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Organization = Database['public']['Tables']['organizations']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];

export interface UserWithDetails extends Profile {
  organizations?: Organization[];
  teams?: Team[];
  activity_count?: number;
}

export interface OrganizationInvitation {
  id: string;
  organization_id: string;
  email: string;
  role: string;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
  organization?: Organization;
  inviter?: Profile;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  role: string;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
  team?: Team;
  inviter?: Profile;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  organization_id?: string;
  team_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  description: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: Profile;
  organization?: Organization;
  team?: Team;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  invited_by?: string;
  user?: Profile;
  organization?: Organization;
}

export class UserManagementService {
  // User Management
  static async getAllUsers(page: number = 1, limit: number = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      users: data as UserWithDetails[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  static async getUserById(userId: string): Promise<UserWithDetails | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as UserWithDetails;
  }

  static async updateUserStatus(userId: string, status: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUserRole(userId: string, role: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Organization Management
  static async getOrganizations(page: number = 1, limit: number = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('organizations')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      organizations: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  static async createOrganization(organizationData: { name: string; description?: string; industry?: string; size?: string; website?: string }) {
    const { data, error } = await supabase
      .from('organizations')
      .insert(organizationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateOrganization(id: string, updates: Partial<Pick<Organization, 'name' | 'description' | 'industry' | 'size' | 'website'>>) {
    const { data, error } = await supabase
      .from('organizations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteOrganization(id: string) {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Organization Members
  static async getOrganizationMembers(organizationId: string) {
    const { data, error } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', organizationId)
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async addOrganizationMember(organizationId: string, userId: string, role: string = 'viewer') {
    const { data, error } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        role
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateOrganizationMemberRole(organizationId: string, userId: string, role: string) {
    const { data, error } = await supabase
      .from('organization_members')
      .update({ role })
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeOrganizationMember(organizationId: string, userId: string) {
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('organization_id', organizationId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Invitations
  static async inviteToOrganization(organizationId: string, email: string, role: string = 'viewer') {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('organization_invitations')
      .insert({
        organization_id: organizationId,
        email,
        role,
        invited_by: currentUser.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async inviteToTeam(teamId: string, email: string, role: string = 'member') {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('team_invitations')
      .insert({
        team_id: teamId,
        email,
        role,
        invited_by: currentUser.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getOrganizationInvitations(organizationId: string) {
    const { data, error } = await supabase
      .from('organization_invitations')
      .select('*')
      .eq('organization_id', organizationId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getTeamInvitations(teamId: string) {
    const { data, error } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('team_id', teamId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async acceptOrganizationInvitation(token: string) {
    const { data, error } = await supabase
      .from('organization_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async acceptTeamInvitation(token: string) {
    const { data, error } = await supabase
      .from('team_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Activity Logs
  static async logActivity(
    action: string,
    resourceType: string,
    description: string,
    options: {
      resourceId?: string;
      organizationId?: string;
      teamId?: string;
      metadata?: Record<string, any>;
    } = {}
  ) {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: currentUser.user.id,
        action,
        resource_type: resourceType,
        description,
        resource_id: options.resourceId,
        organization_id: options.organizationId,
        team_id: options.teamId,
        metadata: options.metadata || {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getActivityLogs(
    filters: {
      userId?: string;
      organizationId?: string;
      teamId?: string;
      resourceType?: string;
    } = {},
    page: number = 1,
    limit: number = 50
  ) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('activity_logs')
      .select('*', { count: 'exact' });

    if (filters.userId) query = query.eq('user_id', filters.userId);
    if (filters.organizationId) query = query.eq('organization_id', filters.organizationId);
    if (filters.teamId) query = query.eq('team_id', filters.teamId);
    if (filters.resourceType) query = query.eq('resource_type', filters.resourceType);

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      activities: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }
}