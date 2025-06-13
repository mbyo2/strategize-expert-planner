
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { User, Shield, Eye, BarChart3 } from 'lucide-react';

const testUsers = [
  {
    email: 'admin@test.com',
    password: 'admin123',
    role: 'Admin',
    name: 'Test Admin',
    icon: Shield,
    description: 'Full system access'
  },
  {
    email: 'manager@test.com', 
    password: 'manager123',
    role: 'Manager',
    name: 'Test Manager',
    icon: BarChart3,
    description: 'Team management access'
  },
  {
    email: 'user@test.com',
    password: 'user123', 
    role: 'User',
    name: 'Test User',
    icon: User,
    description: 'Standard user access'
  },
  {
    email: 'viewer@test.com',
    password: 'viewer123',
    role: 'Viewer', 
    name: 'Test Viewer',
    icon: Eye,
    description: 'Read-only access'
  }
];

const TestUserLogin = () => {
  const { signIn } = useSimpleAuth();

  const handleTestLogin = async (email: string, password: string) => {
    try {
      await signIn({ email, password });
    } catch (error) {
      console.error('Test login error:', error);
    }
  };

  return (
    <div className="space-y-3">
      {testUsers.map((user) => {
        const IconComponent = user.icon;
        return (
          <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg">
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
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={() => handleTestLogin(user.email, user.password)}
            >
              Login
            </Button>
          </div>
        );
      })}
      
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> These are test accounts for demo purposes. 
          In production, you would create real user accounts.
        </p>
      </div>
    </div>
  );
};

export default TestUserLogin;
