
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/hooks/useAuth';

interface AccessDeniedProps {
  requiredRoles?: UserRole[];
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredRoles = [] }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <Shield className="h-16 w-16 text-muted" />
            <Lock className="h-8 w-8 text-destructive absolute bottom-0 right-0" />
          </div>
        </div>
        
        <h1 className="mt-2 text-3xl font-bold">Access Denied</h1>
        
        <p className="mt-2 text-muted-foreground">
          You don't have the required permissions to access this page.
        </p>
        
        <div className="bg-card p-4 rounded-md mt-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Your current role:</p>
            <div className="bg-background p-2 rounded flex items-center justify-center">
              <span className="font-semibold text-primary">
                {user?.role || 'No role assigned'}
              </span>
            </div>
            
            {requiredRoles.length > 0 && (
              <>
                <p className="text-sm font-medium mt-4">Required roles:</p>
                <div className="bg-background p-2 rounded flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {requiredRoles.join(' or ')}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate('/')} className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
