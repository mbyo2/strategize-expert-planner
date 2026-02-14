
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogIn, Loader2, Shield, BarChart3, User, Eye, Crosshair, Radar } from 'lucide-react';
import { TEST_USERS } from '@/services/testUserService';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';

const TestUserLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAuthenticated } = useSimpleAuth();

  const handleQuickLogin = async (testUser: typeof TEST_USERS[0]) => {
    setIsLoading(true);
    try {
      await signIn({ email: testUser.email, password: testUser.password });
      toast.success(`Logged in as ${testUser.name}!`);
    } catch (error: any) {
      toast.error(`Login error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'analyst': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'manager': return BarChart3;
      case 'analyst': return User;
      case 'viewer': return Eye;
      default: return User;
    }
  };

  if (isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            ✓ Already Logged In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You are currently logged in to the application.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Quick Login - Test Users</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click on any test user below to login instantly and explore role-based features.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {TEST_USERS.map((user) => {
            const IconComponent = getRoleIcon(user.role);
            const isMilitary = user.organization === 'Defense Command';
            return (
              <Card key={user.email} className={`p-4 hover:shadow-md transition-shadow ${isMilitary ? 'border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/10' : ''}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isMilitary ? <Crosshair className="h-4 w-4 text-amber-600" /> : <IconComponent className="h-4 w-4" />}
                      <h4 className="font-medium">{user.name}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      {isMilitary && (
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 text-[10px]">
                          Military
                        </Badge>
                      )}
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{user.email}</p>
                    <p>{user.organization}</p>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    variant={isMilitary ? 'outline' : 'default'}
                    onClick={() => handleQuickLogin(user)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    ) : (
                      <LogIn className="h-3 w-3 mr-2" />
                    )}
                    Login as {user.name.split(' ')[0]}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Each role has different permissions. Try logging in with different users to see how the interface and available features change based on your role.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestUserLogin;
