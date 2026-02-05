import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  avatar?: string;
  created_at?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user_id?: string;
  user_email?: string;
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  resource_type: string;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalGoals: number;
  activeGoals: number;
  totalTeams: number;
  systemUptime: string;
}

async function fetchAdminUsers(): Promise<AdminUser[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  // Get user roles
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('user_id, role');

  const rolesMap = new Map(userRoles?.map(r => [r.user_id, r.role]) || []);

  return (profiles || []).map(profile => ({
    id: profile.id,
    name: profile.name || 'Unknown',
    email: profile.email || '',
    role: rolesMap.get(profile.id) || 'viewer',
    status: 'active' as const, // Default to active
    avatar: profile.avatar,
    created_at: profile.created_at,
  }));
}

async function fetchAuditLogs(): Promise<AuditLogEntry[]> {
  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  // Get profile emails for user IDs
  const userIds = [...new Set((logs || []).map(l => l.user_id).filter(Boolean))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', userIds);

  const emailMap = new Map(profiles?.map(p => [p.id, p.email]) || []);

  return (logs || []).map(log => ({
    id: log.id,
    action: log.action,
    user_id: log.user_id || undefined,
    user_email: log.user_id ? emailMap.get(log.user_id) || 'Unknown' : 'System',
    timestamp: log.created_at,
    details: JSON.stringify(log.new_values || log.old_values || {}),
    severity: determineSeverity(log.action),
    resource_type: log.resource_type,
  }));
}

function determineSeverity(action: string): 'low' | 'medium' | 'high' {
  const highSeverity = ['delete', 'remove', 'failed', 'error', 'security'];
  const mediumSeverity = ['update', 'edit', 'modify', 'change'];
  
  const actionLower = action.toLowerCase();
  
  if (highSeverity.some(s => actionLower.includes(s))) return 'high';
  if (mediumSeverity.some(s => actionLower.includes(s))) return 'medium';
  return 'low';
}

async function fetchSystemStats(): Promise<SystemStats> {
  // Fetch counts from various tables
  const [profilesResult, goalsResult, teamsResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('strategic_goals').select('id, status', { count: 'exact' }),
    supabase.from('teams').select('id', { count: 'exact', head: true }),
  ]);

  const totalUsers = profilesResult.count || 0;
  const goals = goalsResult.data || [];
  const totalGoals = goalsResult.count || goals.length;
  const activeGoals = goals.filter(g => g.status === 'active' || g.status === 'in-progress').length;
  const totalTeams = teamsResult.count || 0;

  return {
    totalUsers,
    activeUsers: Math.round(totalUsers * 0.75), // Estimate active users
    totalGoals,
    activeGoals,
    totalTeams,
    systemUptime: '99.9%', // This would come from monitoring in production
  };
}

export const useAdminData = () => {
  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAdminUsers,
  });

  const auditLogsQuery = useQuery({
    queryKey: ['audit-logs'],
    queryFn: fetchAuditLogs,
  });

  const statsQuery = useQuery({
    queryKey: ['system-stats'],
    queryFn: fetchSystemStats,
  });

  return {
    users: usersQuery.data || [],
    usersLoading: usersQuery.isLoading,
    auditLogs: auditLogsQuery.data || [],
    auditLogsLoading: auditLogsQuery.isLoading,
    systemStats: statsQuery.data || {
      totalUsers: 0,
      activeUsers: 0,
      totalGoals: 0,
      activeGoals: 0,
      totalTeams: 0,
      systemUptime: '0%',
    },
    statsLoading: statsQuery.isLoading,
    refetchUsers: usersQuery.refetch,
    refetchLogs: auditLogsQuery.refetch,
    refetchStats: statsQuery.refetch,
  };
};
