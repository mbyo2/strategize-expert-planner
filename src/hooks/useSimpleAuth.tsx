
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthSession, AuthCredentials } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

interface SimpleAuthContextType {
  session: AuthSession;
  isLoading: boolean;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession>({ user: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let initialLoadComplete = false;

    console.log('[useSimpleAuth] Effect starting');

    const fetchUserData = async (userId: string, email: string, metadata: any) => {
      try {
        const [profileResult, roleResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle(),
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .maybeSingle()
        ]);

        if (!isMounted) return null;

        return {
          user: {
            id: userId,
            email: email || '',
            name: profileResult.data?.name || metadata?.name || 'User',
            role: roleResult.data?.role || 'viewer',
            avatar: profileResult.data?.avatar
          }
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
        return {
          user: {
            id: userId,
            email: email || '',
            name: metadata?.name || 'User',
            role: 'viewer',
          }
        };
      }
    };

    // Listener for ONGOING auth changes (does NOT control isLoading after initial load)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, supabaseSession) => {
        if (!isMounted) return;
        
        console.log('[useSimpleAuth] Auth state changed:', event, supabaseSession?.user?.email);
        
        // Skip INITIAL_SESSION - let initSession handle it
        if (event === 'INITIAL_SESSION') {
          console.log('[useSimpleAuth] Skipping INITIAL_SESSION, handled by initSession');
          return;
        }
        
        // For ongoing changes after initial load, update state but don't control loading
        if (supabaseSession?.user) {
          // Fire and forget - don't await to avoid blocking
          fetchUserData(
            supabaseSession.user.id,
            supabaseSession.user.email || '',
            supabaseSession.user.user_metadata
          ).then(sessionData => {
            if (isMounted && sessionData) {
              setSession(sessionData);
            }
          });
        } else {
          setSession({ user: null });
        }
      }
    );

    // INITIAL load (controls isLoading)
    const initSession = async () => {
      try {
        console.log('[useSimpleAuth] Checking existing session');
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        if (supabaseSession?.user) {
          console.log('[useSimpleAuth] Found existing session for:', supabaseSession.user.email);
          
          // Await user data BEFORE setting loading false
          const sessionData = await fetchUserData(
            supabaseSession.user.id,
            supabaseSession.user.email || '',
            supabaseSession.user.user_metadata
          );

          if (!isMounted) return;

          if (sessionData) {
            setSession(sessionData);
          }
        } else {
          console.log('[useSimpleAuth] No existing session');
          setSession({ user: null });
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (isMounted) {
          setSession({ user: null });
        }
      } finally {
        // Only set loading false after ALL initial fetches complete
        if (isMounted) {
          initialLoadComplete = true;
          setIsLoading(false);
        }
      }
    };
    
    initSession();

    return () => {
      console.log('[useSimpleAuth] Cleanup');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    try {
      await authService.signIn(credentials);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    try {
      await authService.signUp(credentials);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const value: SimpleAuthContextType = {
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!session.user,
    hasRole: (role: string) => {
      const userRole = session.user?.role;
      if (!userRole) return false;
      
      const roleHierarchy = ['viewer', 'analyst', 'manager', 'admin', 'superuser'];
      const userRoleIndex = roleHierarchy.indexOf(userRole);
      const requiredRoleIndex = roleHierarchy.indexOf(role);
      
      return userRoleIndex >= requiredRoleIndex;
    },
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};
