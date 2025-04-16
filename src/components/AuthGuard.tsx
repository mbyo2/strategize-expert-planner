
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';
import AccessDenied from '@/pages/AccessDenied';
import { logAuditEvent } from '@/services/auditService';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  resourceType?: string;
  resourceId?: string;
  actionType?: 'view' | 'edit' | 'delete' | 'admin';
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles = [],
  resourceType,
  resourceId,
  actionType = 'view'
}) => {
  const { isAuthenticated, user, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Log access attempt
    logAuditEvent({
      action: 'view_sensitive',
      resource: resourceType ? (resourceType as any) : 'access_control',
      resourceId,
      description: `Unauthenticated user attempted to access protected route: ${location.pathname}`,
      severity: 'medium',
    });
    
    // Redirect to login page with the return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has permission
  if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    // Log unauthorized access attempt
    logAuditEvent({
      action: 'view_sensitive',
      resource: resourceType ? (resourceType as any) : 'access_control',
      resourceId,
      description: `User attempted to access route without proper permissions: ${location.pathname}`,
      userId: user?.id,
      severity: 'high',
      metadata: {
        requiredRoles,
        userRole: user?.role,
        action: actionType
      }
    });
    
    return <AccessDenied requiredRoles={requiredRoles} />;
  }
  
  // If the user has permission, log access for audit purposes
  if (resourceType && actionType !== 'view') {
    logAuditEvent({
      action: actionType === 'edit' ? 'update' : actionType === 'delete' ? 'delete' : 'view_sensitive',
      resource: resourceType as any,
      resourceId,
      description: `User accessed ${actionType} on ${resourceType}${resourceId ? ` (ID: ${resourceId})` : ''}`,
      userId: user?.id,
      severity: actionType === 'admin' ? 'high' : 'medium'
    });
  }

  return <>{children}</>;
};

export default AuthGuard;
