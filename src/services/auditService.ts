
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/hooks/useAuth';

// Types for audit log entries
export type AuditAction = 
  | 'login' 
  | 'logout' 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'export' 
  | 'view_sensitive' 
  | 'role_change'
  | 'settings_change';

export type AuditResource = 
  | 'user'
  | 'goal'
  | 'team'
  | 'strategy'
  | 'report'
  | 'analysis'
  | 'setting'
  | 'document'
  | 'access_control';

export interface AuditLogEntry {
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  description: string;
  metadata?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high';
  userId?: string;
  userIp?: string;
  userAgent?: string;
  timestamp?: string;
}

/**
 * Logs an action to the audit trail
 */
export const logAuditEvent = async (entry: AuditLogEntry): Promise<boolean> => {
  try {
    // Add timestamp if not provided
    const logEntry = {
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
      userIp: entry.userIp || 'unknown',
      userAgent: entry.userAgent || navigator.userAgent,
    };

    // In a real application, this would insert into a database table
    // For now, we'll log to console and simulate storing it
    console.log('[AUDIT LOG]', logEntry);
    
    // In a production environment, you would store this in Supabase
    // Commented out to avoid creating schema changes
    /*
    const { error } = await supabase
      .from('audit_logs')
      .insert(logEntry);
      
    if (error) throw error;
    */
    
    return true;
  } catch (error) {
    console.error('Error logging audit event:', error);
    return false;
  }
};

/**
 * Gets audit logs for a specific user or resource
 */
export const getAuditLogs = async (
  filters: {
    userId?: string;
    resource?: AuditResource;
    resourceId?: string;
    action?: AuditAction;
    startDate?: string;
    endDate?: string;
  },
  page = 1,
  limit = 20
): Promise<AuditLogEntry[]> => {
  try {
    // In a real application, this would query the database
    // For now, return mock data
    return mockAuditLogs.filter(log => {
      if (filters.userId && log.userId !== filters.userId) return false;
      if (filters.resource && log.resource !== filters.resource) return false;
      if (filters.resourceId && log.resourceId !== filters.resourceId) return false;
      if (filters.action && log.action !== filters.action) return false;
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        const logDate = new Date(log.timestamp || '');
        if (logDate < startDate) return false;
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        const logDate = new Date(log.timestamp || '');
        if (logDate > endDate) return false;
      }
      
      return true;
    }).slice((page - 1) * limit, page * limit);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
};

// Mock audit log entries for development
const mockAuditLogs: AuditLogEntry[] = [
  {
    action: 'login',
    resource: 'user',
    description: 'User logged in',
    userId: '123',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: 'low',
  },
  {
    action: 'export',
    resource: 'report',
    resourceId: 'rep-123',
    description: 'User exported strategic analysis report',
    userId: '123',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    severity: 'medium',
  },
  {
    action: 'view_sensitive',
    resource: 'analysis',
    resourceId: 'ana-456',
    description: 'User viewed confidential market analysis',
    userId: '123',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    severity: 'high',
  },
  {
    action: 'role_change',
    resource: 'user',
    resourceId: '456',
    description: 'User role changed from viewer to analyst',
    userId: '123',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    severity: 'high',
    metadata: { 
      previousRole: 'viewer', 
      newRole: 'analyst' 
    },
  },
];
