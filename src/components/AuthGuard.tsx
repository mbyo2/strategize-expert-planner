
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';
import AccessDenied from '@/pages/AccessDenied';

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
    return <AccessDenied requiredRoles={requiredRoles} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
