import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import AccessDenied from '@/pages/AccessDenied';
import LoadingScreen from '@/components/ui/loading-screen';

interface SimpleAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const SimpleAuthGuard: React.FC<SimpleAuthGuardProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, hasRole } = useSimpleAuth();

  if (isLoading) {
    return <LoadingScreen message="Authenticating..." />;
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
