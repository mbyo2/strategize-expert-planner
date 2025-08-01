import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'viewer' | 'analyst' | 'manager' | 'admin' | 'superuser';

export interface RolePermissions {
  canViewAnalytics: boolean;
  canCreateGoals: boolean;
  canEditGoals: boolean;
  canDeleteGoals: boolean;
  canCreateInitiatives: boolean;
  canEditInitiatives: boolean;
  canDeleteInitiatives: boolean;
  canCreateTeams: boolean;
  canManageTeams: boolean;
  canManageUsers: boolean;
  canAccessAdmin: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canImportData: boolean;
  canManageOrganization: boolean;
}

export class RolePermissionService {
  // Role hierarchy (higher index = more permissions)
  private static readonly ROLE_HIERARCHY: UserRole[] = [
    'viewer',
    'analyst', 
    'manager',
    'admin',
    'superuser'
  ];

  static async getCurrentUserRole(): Promise<UserRole | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error || !data) return 'viewer'; // Default role
      return data.role as UserRole;
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'viewer';
    }
  }

  static async getUserPermissions(role?: UserRole): Promise<RolePermissions> {
    const userRole = role || await this.getCurrentUserRole() || 'viewer';
    
    return {
      // Viewer permissions
      canViewAnalytics: this.hasMinimumRole(userRole, 'viewer'),
      canViewReports: this.hasMinimumRole(userRole, 'viewer'),
      
      // Analyst permissions
      canCreateGoals: this.hasMinimumRole(userRole, 'analyst'),
      canEditGoals: this.hasMinimumRole(userRole, 'analyst'),
      canExportData: this.hasMinimumRole(userRole, 'analyst'),
      
      // Manager permissions
      canDeleteGoals: this.hasMinimumRole(userRole, 'manager'),
      canCreateInitiatives: this.hasMinimumRole(userRole, 'manager'),
      canEditInitiatives: this.hasMinimumRole(userRole, 'manager'),
      canCreateTeams: this.hasMinimumRole(userRole, 'manager'),
      canManageTeams: this.hasMinimumRole(userRole, 'manager'),
      canImportData: this.hasMinimumRole(userRole, 'manager'),
      
      // Admin permissions
      canDeleteInitiatives: this.hasMinimumRole(userRole, 'admin'),
      canManageUsers: this.hasMinimumRole(userRole, 'admin'),
      canAccessAdmin: this.hasMinimumRole(userRole, 'admin'),
      canManageOrganization: this.hasMinimumRole(userRole, 'admin'),
    };
  }

  static hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const userRoleIndex = this.ROLE_HIERARCHY.indexOf(userRole);
    const requiredRoleIndex = this.ROLE_HIERARCHY.indexOf(requiredRole);
    return userRoleIndex >= requiredRoleIndex;
  }

  static async canAccessResource(resource: string, action: string): Promise<boolean> {
    const permissions = await this.getUserPermissions();
    
    switch (resource) {
      case 'analytics':
        return action === 'view' ? permissions.canViewAnalytics : false;
      
      case 'goals':
        switch (action) {
          case 'create': return permissions.canCreateGoals;
          case 'edit': return permissions.canEditGoals;
          case 'delete': return permissions.canDeleteGoals;
          case 'view': return permissions.canViewAnalytics;
          default: return false;
        }
      
      case 'initiatives':
        switch (action) {
          case 'create': return permissions.canCreateInitiatives;
          case 'edit': return permissions.canEditInitiatives;
          case 'delete': return permissions.canDeleteInitiatives;
          case 'view': return permissions.canViewAnalytics;
          default: return false;
        }
      
      case 'teams':
        switch (action) {
          case 'create': return permissions.canCreateTeams;
          case 'manage': return permissions.canManageTeams;
          case 'view': return permissions.canViewAnalytics;
          default: return false;
        }
      
      case 'admin':
        return permissions.canAccessAdmin;
      
      case 'data':
        switch (action) {
          case 'export': return permissions.canExportData;
          case 'import': return permissions.canImportData;
          default: return false;
        }
      
      default:
        return false;
    }
  }

  static getRoleLabel(role: UserRole): string {
    switch (role) {
      case 'viewer': return 'Viewer';
      case 'analyst': return 'Analyst';
      case 'manager': return 'Manager';
      case 'admin': return 'Administrator';
      case 'superuser': return 'Super User';
      default: return 'Unknown';
    }
  }

  static getRoleDescription(role: UserRole): string {
    switch (role) {
      case 'viewer': 
        return 'Can view dashboards, analytics, and reports. Cannot create or modify data.';
      case 'analyst': 
        return 'Can create and edit goals, view analytics, and export data. Cannot manage teams or users.';
      case 'manager': 
        return 'Can manage teams, create initiatives, and import data. Has full access to strategic planning features.';
      case 'admin': 
        return 'Can manage users, organizations, and all system settings. Has administrative access.';
      case 'superuser': 
        return 'Has complete system access including user role management and system configuration.';
      default: 
        return 'Unknown role with undefined permissions.';
    }
  }

  static getAllRoles(): UserRole[] {
    return [...this.ROLE_HIERARCHY];
  }

  static async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    try {
      const currentRole = await this.getCurrentUserRole();
      if (!currentRole || !this.hasMinimumRole(currentRole, 'admin')) {
        throw new Error('Insufficient permissions to update user roles');
      }

      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }

  // Team-specific permissions
  static async getTeamRole(teamId: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();

      if (error) return null;
      return data?.role || null;
    } catch (error) {
      console.error('Error getting team role:', error);
      return null;
    }
  }

  static async canManageTeamMembers(teamId: string): Promise<boolean> {
    const teamRole = await this.getTeamRole(teamId);
    const systemRole = await this.getCurrentUserRole();
    
    return (
      teamRole === 'admin' || 
      teamRole === 'manager' ||
      (systemRole && this.hasMinimumRole(systemRole, 'admin'))
    );
  }

  static async canCreateTeamTasks(teamId: string): Promise<boolean> {
    const teamRole = await this.getTeamRole(teamId);
    return teamRole !== null; // Any team member can create tasks
  }

  static async canEditTeamTasks(teamId: string, taskCreatorId?: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const teamRole = await this.getTeamRole(teamId);
    const systemRole = await this.getCurrentUserRole();
    
    return (
      user.id === taskCreatorId || // Task creator
      teamRole === 'admin' || 
      teamRole === 'manager' ||
      (systemRole && this.hasMinimumRole(systemRole, 'manager'))
    );
  }
}