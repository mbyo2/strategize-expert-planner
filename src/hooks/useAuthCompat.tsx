
import { useSimpleAuth } from './useSimpleAuth';

// Compatibility bridge for components still using the old auth interface
export const useAuth = () => {
  const { session, isLoading, signIn, signUp, signOut, isAuthenticated, hasRole } = useSimpleAuth();
  
  return {
    user: session.user,
    isLoading,
    isAuthenticated,
    login: signIn,
    signup: signUp,
    logout: signOut,
    hasPermission: (roles: string[]) => {
      if (!session.user) return false;
      return roles.some(role => hasRole(role));
    }
  };
};

// For backward compatibility
export const withAuth = (requiredRoles: string[] = []) => {
  return (Component: React.ComponentType) => {
    return (props: any) => {
      // This is now handled by SimpleAuthGuard in the routes
      return <Component {...props} />;
    };
  };
};

export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer';
export type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};
