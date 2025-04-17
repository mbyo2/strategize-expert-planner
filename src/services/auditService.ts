import { supabase } from '@/integrations/supabase/client';
import { User } from '@/hooks/useAuth';
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
  | 'settings_change'
  | 'feedback_submitted';

export type AuditResource = 
  | 'user' 
  | 'setting' 
  | 'security_setting' 
  | 'admin'
  | 'feedback';

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
  expiresAt?: string; // New field for data retention
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
export const logAuditEvent = async (entry: AuditLogEntry): Promise<boolean> => {
  try {
    // Get client IP if not provided
    const userIp = entry.userIp || await getClientIp();
    
    // Add timestamp and expiration if not provided
    const timestamp = entry.timestamp || new Date().toISOString();
    const expiresAt = entry.expiresAt || calculateExpirationDate(entry.severity);
    
    // Sanitize any user-provided input
    const sanitizedDescription = sanitizeData(entry.description);
    const sanitizedMetadata = entry.metadata ? sanitizeData(entry.metadata) : undefined;
    
    // Create the complete log entry
    const logEntry = {
      ...entry,
      timestamp,
      expiresAt,
      description: sanitizedDescription,
      metadata: sanitizedMetadata,
      userIp,
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
    // In a real application, this would delete expired logs
    /*
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('audit_logs')
      .delete()
      .lt('expiresAt', now);
      
    if (error) throw error;
    */
    
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
    // In a real application, this would query the database
    // For now, return mock data
    return mockAuditLogs
      .filter(log => {
        if (filters.userId && log.userId !== filters.userId) return false;
        if (filters.resource && log.resource !== filters.resource) return false;
        if (filters.resourceId && log.resourceId !== filters.resourceId) return false;
        if (filters.action && log.action !== filters.action) return false;
        if (filters.severity && log.severity !== filters.severity) return false;
        
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
    resource: 'user',
    description: 'User logged in',
    userId: '123',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: 'low',
    expiresAt: calculateExpirationDate('low')
  },
  {
    action: 'export',
    resource: 'report',
    resourceId: 'rep-123',
    description: 'User exported strategic analysis report',
    userId: '123',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    severity: 'medium',
    expiresAt: calculateExpirationDate('medium')
  },
  {
    action: 'view_sensitive',
    resource: 'analysis',
    resourceId: 'ana-456',
    description: 'User viewed confidential market analysis',
    userId: '123',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    severity: 'high',
    expiresAt: calculateExpirationDate('high')
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
    expiresAt: calculateExpirationDate('high')
  },
  {
    action: 'mfa_setup',
    resource: 'user',
    resourceId: '123',
    description: 'User enabled MFA',
    userId: '123',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    severity: 'medium',
    metadata: { 
      mfaType: 'totp'
    },
    expiresAt: calculateExpirationDate('medium')
  },
  {
    action: 'settings_change',
    resource: 'security_setting',
    description: 'IP restrictions updated',
    userId: '123',
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    severity: 'high',
    metadata: { 
      setting: 'ip_restrictions',
      action: 'update'
    },
    expiresAt: calculateExpirationDate('high')
  },
  {
    action: 'feedback_submitted',
    resource: 'feedback',
    description: 'User submitted feedback',
    userId: '123',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    severity: 'low',
    expiresAt: calculateExpirationDate('low')
  },
];
