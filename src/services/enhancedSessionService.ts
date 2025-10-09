import { supabase } from '@/integrations/supabase/client';
import { logAuditEvent } from './auditService';

export interface SessionInfo {
  id: string;
  user_id: string;
  session_hash?: string; // Changed from session_token for security
  ip_address?: string;
  user_agent?: string;
  is_active: boolean | null;
  last_activity: string | null;
  expires_at: string;
  created_at: string | null;
}

export const enhancedSessionService = {
  /**
   * Get all active sessions for the current user
   * Uses safe view that excludes session_token for security
   */
  async getUserSessions(): Promise<SessionInfo[]> {
    const { data, error } = await supabase
      .from('user_sessions_safe')
      .select('*')
      .eq('is_active', true)
      .order('last_activity', { ascending: false });

    if (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }

    return (data || []) as SessionInfo[];
  },

  /**
   * Create a new secure session
   */
  async createSession(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Generate secure session hash using database function
      const { data: hashData, error: hashError } = await supabase
        .rpc('create_secure_session_hash', { user_id_param: user.id });

      if (hashError || !hashData) {
        console.error('Error creating session hash:', hashError);
        return false;
      }

      const sessionData = {
        user_id: user.id,
        session_hash: hashData, // Store hash instead of token
        ip_address: await this.getClientIP(),
        user_agent: this.sanitizeUserAgent(navigator.userAgent),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };

      const { error } = await supabase
        .from('user_sessions')
        .insert(sessionData);

      if (error) {
        console.error('Error creating session:', error);
        return false;
      }

      // Store hash in localStorage for validation
      localStorage.setItem('session_hash', hashData);

      // Log session creation using secure function
      await supabase.rpc('create_audit_log', {
        p_action: 'login',
        p_resource_type: 'user',
        p_resource_id: user.id
      });

      return true;
    } catch (error) {
      console.error('Session creation failed:', error);
      return false;
    }
  },

  /**
   * Update session activity timestamp
   */
  async updateSessionActivity(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          last_activity: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error updating session activity:', error);
      }
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  },

  /**
   * Terminate a specific session
   */
  async terminateSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          is_active: false 
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error terminating session:', error);
        return false;
      }

      // Log session termination using secure function
      await supabase.rpc('create_audit_log', {
        p_action: 'logout',
        p_resource_type: 'user',
        p_resource_id: sessionId
      });

      return true;
    } catch (error) {
      console.error('Failed to terminate session:', error);
      return false;
    }
  },

  /**
   * Terminate all sessions except current one
   */
  async terminateAllOtherSessions(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Get current session hash
      const sessions = await this.getUserSessions();
      const currentSession = sessions[0]; // Most recent session

      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          is_active: false 
        })
        .eq('user_id', user.id)
        .neq('id', currentSession?.id);

      if (error) {
        console.error('Error terminating sessions:', error);
        return false;
      }

      // Log mass session termination using secure function
      await supabase.rpc('create_audit_log', {
        p_action: 'logout',
        p_resource_type: 'user'
      });

      return true;
    } catch (error) {
      console.error('Failed to terminate other sessions:', error);
      return false;
    }
  },

  /**
   * Validate session is still active and not expired
   */
  async validateSession(sessionHash: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('validate_session_hash', { hash: sessionHash });

      if (error) {
        console.error('Error validating session:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  },

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('cleanup_expired_sessions');

      if (error) {
        console.error('Error cleaning up expired sessions:', error);
      }
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
    }
  },

  /**
   * Get client IP address (security risk removed)
   */
  async getClientIP(): Promise<string | null> {
    // Removed external IP collection for security - use server-side headers instead
    console.warn('Client IP collection disabled for security');
    return null;
  },

  /**
   * Sanitize user agent string to remove sensitive info
   */
  sanitizeUserAgent(userAgent: string): string {
    // Remove potentially sensitive information while keeping useful browser info
    return userAgent
      .replace(/\(([^)]*)\)/g, '(sanitized)')
      .substring(0, 200); // Limit length
  }
};
