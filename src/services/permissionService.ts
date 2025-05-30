
import { customSupabase } from "@/integrations/supabase/customClient";

export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer';

export interface Permission {
  resource: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'admin';
  granted: boolean;
}

// Role-based permissions matrix
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: '*', action: 'view', granted: true },
    { resource: '*', action: 'create', granted: true },
    { resource: '*', action: 'edit', granted: true },
    { resource: '*', action: 'delete', granted: true },
    { resource: '*', action: 'admin', granted: true },
  ],
  manager: [
    { resource: 'strategic_goals', action: 'view', granted: true },
    { resource: 'strategic_goals', action: 'create', granted: true },
    { resource: 'strategic_goals', action: 'edit', granted: true },
    { resource: 'strategic_goals', action: 'delete', granted: true },
    { resource: 'planning_initiatives', action: 'view', granted: true },
    { resource: 'planning_initiatives', action: 'create', granted: true },
    { resource: 'planning_initiatives', action: 'edit', granted: true },
    { resource: 'strategy_reviews', action: 'view', granted: true },
    { resource: 'strategy_reviews', action: 'create', granted: true },
    { resource: 'strategy_reviews', action: 'edit', granted: true },
    { resource: 'teams', action: 'view', granted: true },
    { resource: 'teams', action: 'edit', granted: true },
    { resource: 'analytics', action: 'view', granted: true },
  ],
  analyst: [
    { resource: 'strategic_goals', action: 'view', granted: true },
    { resource: 'strategic_goals', action: 'edit', granted: true },
    { resource: 'planning_initiatives', action: 'view', granted: true },
    { resource: 'planning_initiatives', action: 'edit', granted: true },
    { resource: 'strategy_reviews', action: 'view', granted: true },
    { resource: 'industry_metrics', action: 'view', granted: true },
    { resource: 'market_changes', action: 'view', granted: true },
    { resource: 'analytics', action: 'view', granted: true },
    { resource: 'recommendations', action: 'view', granted: true },
    { resource: 'recommendations', action: 'create', granted: true },
  ],
  viewer: [
    { resource: 'strategic_goals', action: 'view', granted: true },
    { resource: 'planning_initiatives', action: 'view', granted: true },
    { resource: 'strategy_reviews', action: 'view', granted: true },
    { resource: 'industry_metrics', action: 'view', granted: true },
    { resource: 'market_changes', action: 'view', granted: true },
    { resource: 'analytics', action: 'view', granted: true },
    { resource: 'recommendations', action: 'view', granted: true },
  ],
};

export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const { data, error } = await customSupabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data.role as UserRole;
  } catch (error) {
    console.error('Failed to get user role:', error);
    return null;
  }
};

export const hasPermission = (
  userRole: UserRole,
  resource: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'admin'
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  
  // Check for wildcard permission first (admin)
  const wildcardPermission = rolePermissions.find(
    p => p.resource === '*' && p.action === action
  );
  
  if (wildcardPermission) {
    return wildcardPermission.granted;
  }
  
  // Check for specific resource permission
  const specificPermission = rolePermissions.find(
    p => p.resource === resource && p.action === action
  );
  
  return specificPermission?.granted || false;
};

export const getUserPermissions = async (userId: string): Promise<Permission[]> => {
  const role = await getUserRole(userId);
  if (!role) {
    return [];
  }
  
  return ROLE_PERMISSIONS[role] || [];
};

export const updateUserRole = async (userId: string, newRole: UserRole) => {
  try {
    const { data, error } = await customSupabase
      .from('user_roles')
      .upsert({ user_id: userId, role: newRole })
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;
  }
};

export const checkResourceAccess = async (
  userId: string,
  resource: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'admin'
): Promise<boolean> => {
  const role = await getUserRole(userId);
  if (!role) {
    return false;
  }
  
  return hasPermission(role, resource, action);
};
