
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
    let initComplete = false;

    console.log('[useSimpleAuth] Effect starting');

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, supabaseSession) => {
        if (!isMounted) return;
        
        console.log('[useSimpleAuth] Auth state changed:', event, supabaseSession?.user?.email);
        
        // Skip INITIAL_SESSION event if we haven't finished init - let initSession handle it
        if (event === 'INITIAL_SESSION' && !initComplete) {
          console.log('[useSimpleAuth] Skipping INITIAL_SESSION, will be handled by initSession');
          return;
        }
        
        if (supabaseSession?.user) {
          try {
            // Get user profile and role
            const [profileResult, roleResult] = await Promise.all([
              supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseSession.user.id)
                .maybeSingle(),
              supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', supabaseSession.user.id)
                .maybeSingle()
            ]);

            if (!isMounted) return;

            setSession({
              user: {
                id: supabaseSession.user.id,
                email: supabaseSession.user.email || '',
                name: profileResult.data?.name || supabaseSession.user.user_metadata?.name || 'User',
                role: roleResult.data?.role || 'viewer',
                avatar: profileResult.data?.avatar
              }
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
            if (!isMounted) return;
            setSession({
              user: {
                id: supabaseSession.user.id,
                email: supabaseSession.user.email || '',
                name: supabaseSession.user.user_metadata?.name || 'User',
                role: 'viewer',
              }
            });
          }
        } else {
          setSession({ user: null });
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    const initSession = async () => {
      try {
        console.log('[useSimpleAuth] Checking existing session');
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        initComplete = true;
        
        if (supabaseSession?.user) {
          console.log('[useSimpleAuth] Found existing session for:', supabaseSession.user.email);
          // Fetch profile and role for existing session
          const [profileResult, roleResult] = await Promise.all([
            supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseSession.user.id)
              .maybeSingle(),
            supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', supabaseSession.user.id)
              .maybeSingle()
          ]);

          if (!isMounted) return;

          setSession({
            user: {
              id: supabaseSession.user.id,
              email: supabaseSession.user.email || '',
              name: profileResult.data?.name || supabaseSession.user.user_metadata?.name || 'User',
              role: roleResult.data?.role || 'viewer',
              avatar: profileResult.data?.avatar
            }
          });
        } else {
          console.log('[useSimpleAuth] No existing session');
          setSession({ user: null });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting session:', error);
        if (isMounted) {
          setSession({ user: null });
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
