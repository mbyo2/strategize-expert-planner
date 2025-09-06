import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { enhancedSessionService } from '@/services/enhancedSessionService';
import type { User, Session } from '@supabase/supabase-js';

interface SecureAuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<SecureAuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Secure sign in
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Create secure session record
      if (data.session) {
        await enhancedSessionService.createSession();
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }, []);

  // Secure sign out
  const signOut = useCallback(async () => {
    try {
      // Clean up secure session records first
      const sessions = await enhancedSessionService.getUserSessions();
      if (sessions.length > 0) {
        await enhancedSessionService.terminateSession(sessions[0].id);
      }

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }, []);

  // Update session activity
  const updateActivity = useCallback(async () => {
    if (authState.isAuthenticated) {
      await enhancedSessionService.updateSessionActivity();
    }
  }, [authState.isAuthenticated]);

  // Set up auth state change listener
  useEffect(() => {
    // Set up listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          isAuthenticated: !!session
        });

        // Handle session events
        if (event === 'SIGNED_IN' && session) {
          // Don't call createSession here as it's handled in signIn
          console.log('User signed in');
        } else if (event === 'SIGNED_OUT') {
          // Clean up expired sessions
          await enhancedSessionService.cleanupExpiredSessions();
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        isLoading: false,
        isAuthenticated: !!session
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  // Set up activity tracking
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [authState.isAuthenticated, updateActivity]);

  return {
    ...authState,
    signIn,
    signOut,
    updateActivity,
    // Secure session management
    getUserSessions: enhancedSessionService.getUserSessions,
    terminateSession: enhancedSessionService.terminateSession,
    terminateAllOtherSessions: enhancedSessionService.terminateAllOtherSessions
  };
};