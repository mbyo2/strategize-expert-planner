
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { SimpleSecurity } from '@/utils/simpleSecurity';

interface SimpleAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requireAuth?: boolean;
  redirectTo?: string;
}

const SimpleAuthGuard: React.FC<SimpleAuthGuardProps> = ({
  children,
  requiredRole,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { session, isLoading, hasRole } = useSimpleAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !session.user) {
    // Log unauthorized access attempt
    SimpleSecurity.logSecurityEvent(
      'unauthorized_access',
      `Unauthenticated access attempt to ${location.pathname}`,
      undefined,
      { path: location.pathname }
    );
    
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    // Log insufficient permissions
    SimpleSecurity.logSecurityEvent(
      'insufficient_permissions',
      `User attempted to access ${location.pathname} without required role: ${requiredRole}`,
      session.user?.id,
      { 
        path: location.pathname, 
        requiredRole, 
        userRole: session.user?.role 
      }
    );
    
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

export default SimpleAuthGuard;
