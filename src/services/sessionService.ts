
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
  last_activity: string;
  expires_at: string;
  created_at: string;
}

export const sessionService = {
  // Get user's active sessions
  async getUserSessions(): Promise<UserSession[]> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  },

  // Create new session record
  async createSession(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      // Get client info
      const userAgent = navigator.userAgent;
      const sessionToken = session.access_token;
      
      // Calculate expiration (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: session.user.id,
          session_token: sessionToken,
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
      if (!session?.access_token) return;

      await supabase
        .from('user_sessions')
        .update({
          last_activity: new Date().toISOString()
        })
        .eq('session_token', session.access_token);
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
      if (!session?.access_token) return false;

      const { error } = await supabase
        .from('user_sessions')
        .update({
          is_active: false
        })
        .neq('session_token', session.access_token);

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
  }
};
