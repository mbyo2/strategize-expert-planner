
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { User, Shield, Eye, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const testUsers = [
  {
    email: 'admin@techcorp.com',
    password: 'password123',
    role: 'Admin',
    name: 'Alex Admin',
    icon: Shield,
    description: 'Full system access with sample data'
  },
  {
    email: 'manager@techcorp.com', 
    password: 'password123',
    role: 'Manager',
    name: 'Morgan Manager',
    icon: BarChart3,
    description: 'Team management with initiatives'
  },
  {
    email: 'analyst@techcorp.com',
    password: 'password123', 
    role: 'Analyst',
    name: 'Ana Analyst',
    icon: User,
    description: 'Analysis access with market data'
  },
  {
    email: 'viewer@techcorp.com',
    password: 'password123',
    role: 'Viewer', 
    name: 'Victor Viewer',
    icon: Eye,
    description: 'Read-only access to goals'
  }
];

const TestUserLogin = () => {
  const { signIn, isLoading } = useSimpleAuth();

  const handleTestLogin = async (email: string, password: string, name: string) => {
    try {
      toast.loading(`Signing in as ${name}...`);
      await signIn({ email, password });
      toast.success(`Successfully signed in as ${name}`);
    } catch (error: any) {
      console.error('Test login error:', error);
      toast.error(`Login failed: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-3">
      {testUsers.map((user) => {
        const IconComponent = user.icon;
        return (
          <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <IconComponent className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{user.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{user.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Email: {user.email} • Password: {user.password}
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={() => handleTestLogin(user.email, user.password, user.name)}
              disabled={isLoading}
              className="min-w-[60px]"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </div>
        );
      })}
      
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> These are test accounts for demo purposes. 
          In production, you would create real user accounts through the signup flow.
        </p>
      </div>
    </div>
  );
};

export default TestUserLogin;
