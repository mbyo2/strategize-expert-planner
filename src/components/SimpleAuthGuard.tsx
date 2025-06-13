
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import AccessDenied from '@/pages/AccessDenied';

interface SimpleAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const SimpleAuthGuard: React.FC<SimpleAuthGuardProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, hasRole } = useSimpleAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <AccessDenied requiredRole={requiredRole} />;
  }

  return <>{children}</>;
};

export default SimpleAuthGuard;
