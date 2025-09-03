import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logAuditEvent } from '@/services/auditService';
import { sessionService } from '@/services/sessionService';

interface UnifiedAuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useUnifiedAuth = () => {
  const [authState, setAuthState] = useState<UnifiedAuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false
  });

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      await logAuditEvent({
        action: 'login',
        resource: 'user',
        resourceId: data.user?.id
      });

      // Create session record
      await sessionService.createSession();

      return { data, error: null };
    } catch (error: any) {
      await logAuditEvent({
        action: 'unauthorized_access',
        resource: 'user'
      });
      return { data: null, error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logAuditEvent({
        action: 'logout',
        resource: 'user'
      });

      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const updateActivity = useCallback(async () => {
    if (authState.isAuthenticated) {
      await sessionService.updateSessionActivity();
    }
  }, [authState.isAuthenticated]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          isAuthenticated: !!session?.user
        });

        if (event === 'SIGNED_OUT') {
          // Clean up session records
          await sessionService.cleanupExpiredSessions();
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        isLoading: false,
        isAuthenticated: !!session?.user
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  // Set up activity tracking
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    let activityTimer: NodeJS.Timeout;

    const handleActivity = () => {
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        updateActivity();
      }, 30000); // Update activity every 30 seconds of inactivity
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      clearTimeout(activityTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [authState.isAuthenticated, updateActivity]);

  return {
    ...authState,
    signIn,
    signOut,
    updateActivity
  };
};