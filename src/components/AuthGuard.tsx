
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has permission
  if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-2">
          You don't have the required permissions to access this page.
        </p>
        <p className="text-muted-foreground">
          Current role: <span className="font-medium">{user?.role}</span>
        </p>
        <p className="text-muted-foreground mt-4">
          Required role: <span className="font-medium">{requiredRoles.join(' or ')}</span>
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
