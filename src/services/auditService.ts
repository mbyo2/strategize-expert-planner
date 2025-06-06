import { supabase } from '@/integrations/supabase/client';
import { DatabaseService } from './databaseService';
import { toast } from 'sonner';

// Constants for data retention
const RETENTION_PERIOD_DAYS = {
  low: 90,       // 3 months for low severity events
  medium: 365,   // 1 year for medium severity events
  high: 730      // 2 years for high severity events
};

// Types for audit log entries
export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'read' 
  | 'login' 
  | 'logout' 
  | 'signup'
  | 'settings_change'
  | 'feedback_submitted'
  | 'view_sensitive'
  | 'export'
  | 'role_change'
  | 'mfa_setup'
  | 'mfa_verify'
  | 'unauthorized_access';

export type AuditResource = 
  | 'user' 
  | 'setting' 
  | 'security_setting' 
  | 'admin'
  | 'feedback'
  | 'access_control'
  | 'report'
  | 'analysis'
  | 'event'
  | 'strategic_goals'
  | 'planning_initiatives'
  | 'teams'
  | 'team_members';

export interface AuditLogEntry {
  id?: string;
  action: AuditAction;
  resource_type: AuditResource;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

// Enhanced interface for logging with additional fields - FIXED to use 'resource' instead of 'resource_type'
export interface LogAuditEventParams {
  action: AuditAction;
  resource: AuditResource; // Changed from resource_type to resource
  resourceId?: string;
  description?: string;
  userId?: string;
  severity?: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
}

/**
 * Get client IP address - in a real app, this would be more robust
 */
export const getClientIp = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting client IP:', error);
    return 'unknown';
  }
};

/**
 * Sanitize input data to prevent security issues
 */
export const sanitizeData = (input: any): any => {
  if (typeof input === 'string') {
    // Basic XSS protection
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  } else if (Array.isArray(input)) {
    return input.map(item => sanitizeData(item));
  } else if (typeof input === 'object' && input !== null) {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[sanitizeData(key)] = sanitizeData(value);
    }
    return sanitized;
  }
  
  return input;
};

/**
 * Calculate expiration date based on severity
 */
const calculateExpirationDate = (severity: 'low' | 'medium' | 'high' = 'medium'): string => {
  const retentionDays = RETENTION_PERIOD_DAYS[severity];
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + retentionDays);
  return expirationDate.toISOString();
};

/**
 * Logs an action to the audit trail
 */
export const logAuditEvent = async (params: LogAuditEventParams): Promise<boolean> => {
  try {
    // Get client IP if not provided
    const userIp = await getClientIp();
    
    // Add timestamp and expiration if not provided
    const timestamp = new Date().toISOString();
    
    // Sanitize any user-provided input
    const sanitizedOldValues = params.old_values ? sanitizeData(params.old_values) : undefined;
    const sanitizedNewValues = params.new_values ? sanitizeData(params.new_values) : undefined;
    
    // Create the complete log entry - map 'resource' to 'resource_type'
    const logEntry: AuditLogEntry = {
      action: params.action,
      resource_type: params.resource, // Map resource to resource_type
      resource_id: params.resourceId,
      user_id: params.userId,
      created_at: timestamp,
      old_values: sanitizedOldValues,
      new_values: sanitizedNewValues,
      ip_address: userIp,
      user_agent: navigator.userAgent,
    };

    // In a real application, this would insert into a database table
    // For now, we'll log to console and simulate storing it
    console.log('[AUDIT LOG]', {
      ...logEntry,
      description: params.description,
      severity: params.severity,
      metadata: params.metadata
    });
    
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
    toast.error('Failed to log security audit event', {
      description: 'This may impact compliance reporting.'
    });
    return false;
  }
};

/**
 * Purge expired audit logs based on retention policy
 */
export const purgeExpiredAuditLogs = async (): Promise<boolean> => {
  try {
    console.log('Purging expired audit logs based on retention policy');
    return true;
  } catch (error) {
    console.error('Error purging expired audit logs:', error);
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
    severity?: 'low' | 'medium' | 'high';
    startDate?: string;
    endDate?: string;
  },
  page = 1,
  limit = 20
): Promise<AuditLogEntry[]> => {
  try {
    return mockAuditLogs
      .filter(log => {
        if (filters.userId && log.user_id !== filters.userId) return false;
        if (filters.resource && log.resource_type !== filters.resource) return false;
        if (filters.resourceId && log.resource_id !== filters.resourceId) return false;
        if (filters.action && log.action !== filters.action) return false;
        
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          const logDate = new Date(log.created_at || '');
          if (logDate < startDate) return false;
        }
        
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          const logDate = new Date(log.created_at || '');
          if (logDate > endDate) return false;
        }
        
        return true;
      })
      .slice((page - 1) * limit, page * limit);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
};

// Mock audit log entries for development
const mockAuditLogs: AuditLogEntry[] = [
  {
    action: 'login',
    resource_type: 'user',
    user_id: '123',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    action: 'export',
    resource_type: 'report',
    resource_id: 'rep-123',
    user_id: '123',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    action: 'view_sensitive',
    resource_type: 'analysis',
    resource_id: 'ana-456',
    user_id: '123',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    action: 'role_change',
    resource_type: 'user',
    resource_id: '456',
    user_id: '123',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    old_values: { 
      role: 'viewer'
    },
    new_values: {
      role: 'analyst'
    }
  },
  {
    action: 'mfa_setup',
    resource_type: 'user',
    resource_id: '123',
    user_id: '123',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    new_values: { 
      mfaType: 'totp'
    }
  },
  {
    action: 'settings_change',
    resource_type: 'security_setting',
    user_id: '123',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    old_values: { 
      setting: 'ip_restrictions',
      value: []
    },
    new_values: {
      setting: 'ip_restrictions',
      value: ['192.168.1.0/24']
    }
  },
  {
    action: 'feedback_submitted',
    resource_type: 'feedback',
    user_id: '123',
    created_at: new Date(Date.now() - 43200000).toISOString(),
  },
];
