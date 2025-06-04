
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogIn, Loader2 } from 'lucide-react';
import { TEST_USERS } from '@/services/testUserService';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';

const TestUserLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { signIn } = useSimpleAuth();

  const handleTestLogin = async (email: string, password: string, name: string) => {
    setIsLoggingIn(true);
    try {
      await signIn({ email, password });
      toast.success(`Logged in as ${name}`);
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setIsLoggingIn(false);
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="h-5 w-5" />
          Quick Test Login
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Log in quickly with test users to explore different role permissions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {TEST_USERS.map((user) => (
          <Card key={user.email} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{user.name}</h4>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              
              <Button 
                size="sm"
                onClick={() => handleTestLogin(user.email, user.password, user.name)}
                disabled={isLoggingIn}
                className="flex items-center gap-2"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <LogIn className="h-3 w-3" />
                )}
                Login
              </Button>
            </div>
          </Card>
        ))}

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Note:</strong> Make sure to create the test users first using the Test User Creator 
            above before trying to log in with them.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestUserLogin;
