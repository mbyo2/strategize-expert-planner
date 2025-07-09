
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

    // Initialize session
    const initializeAuth = async () => {
      try {
        const currentSession = await authService.getCurrentSession();
        if (isMounted) {
          setSession(currentSession);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, supabaseSession) => {
        if (!isMounted) return;
        
        if (supabaseSession?.user) {
          const currentSession = await authService.getCurrentSession();
          setSession(currentSession);
        } else {
          setSession({ user: null });
        }
        setIsLoading(false);
      }
    );

    // Listen for session changes from auth service
    const unsubscribeFromService = authService.onSessionChange((newSession) => {
      if (isMounted) {
        setSession(newSession);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      unsubscribeFromService();
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
