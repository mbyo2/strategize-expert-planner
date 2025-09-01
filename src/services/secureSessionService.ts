import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SecureUserSession {
  id: string;
  user_id: string;
  session_hash: string; // Hashed session identifier instead of raw token
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
  last_activity: string;
  expires_at: string;
  created_at: string;
}

// Secure session service that doesn't store raw access tokens
export const secureSessionService = {
  // Get user's active sessions
  async getUserSessions(): Promise<SecureUserSession[]> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;
      return (data || []).map(session => ({
        id: session.id,
        user_id: session.user_id,
        session_hash: session.session_token,
        ip_address: session.ip_address ? secureSessionService.redactIpAddress(String(session.ip_address)) : undefined,
        user_agent: session.user_agent,
        is_active: session.is_active,
        last_activity: session.last_activity,
        expires_at: session.expires_at,
        created_at: session.created_at
      }));
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  },

  // Create new session record with secure hash
  async createSession(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      // Create a secure session hash instead of storing raw token
      const sessionHash = await this.createSessionHash(session.user.id);
      const userAgent = this.sanitizeUserAgent(navigator.userAgent);
      
      // Calculate expiration (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: session.user.id,
          session_token: sessionHash,
          user_agent: userAgent,
          is_active: true,
          last_activity: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating session:', error);
      return false;
    }
  },

  // Update session activity
  async updateSessionActivity(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Use user ID instead of access token for updates
      await supabase
        .from('user_sessions')
        .update({
          last_activity: new Date().toISOString()
        })
        .eq('user_id', session.user.id)
        .eq('is_active', true);
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  },

  // Terminate session
  async terminateSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          is_active: false
        })
        .eq('id', sessionId);

      if (error) throw error;
      
      toast.success('Session terminated successfully');
      return true;
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
      return false;
    }
  },

  // Terminate all other sessions
  async terminateAllOtherSessions(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      const currentSessionHash = await this.createSessionHash(session.user.id);

      const { error } = await supabase
        .from('user_sessions')
        .update({
          is_active: false
        })
        .eq('user_id', session.user.id)
        .neq('session_token', currentSessionHash);

      if (error) throw error;
      
      toast.success('All other sessions terminated');
      return true;
    } catch (error) {
      console.error('Error terminating other sessions:', error);
      toast.error('Failed to terminate other sessions');
      return false;
    }
  },

  // Clean up expired sessions
  async cleanupExpiredSessions(): Promise<void> {
    try {
      await supabase
        .from('user_sessions')
        .update({
          is_active: false
        })
        .lt('expires_at', new Date().toISOString());
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  },

  // Helper methods
  async createSessionHash(userId: string): Promise<string> {
    const timestamp = Date.now();
    const randomValue = Math.random().toString(36);
    const dataToHash = `${userId}_${timestamp}_${randomValue}`;
    
    // Use Web Crypto API for secure hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(dataToHash);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  sanitizeUserAgent(userAgent: string): string {
    // Remove potentially sensitive information from user agent
    return userAgent.replace(/\([^)]*\)/g, '(...)').substring(0, 200);
  },

  redactIpAddress(ip: string): string {
    // Redact last octet of IP for privacy
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = 'xxx';
      return parts.join('.');
    }
    return 'xxx.xxx.xxx.xxx';
  }
};