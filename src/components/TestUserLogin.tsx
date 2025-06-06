
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { TEST_USERS, createTestUser } from '@/services/testUserService';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';

const TestUserLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [creatingUser, setCreatingUser] = useState<string | null>(null);
  const { signIn } = useSimpleAuth();

  const handleTestLogin = async (email: string, password: string, name: string) => {
    setIsLoggingIn(true);
    try {
      console.log(`Attempting to login with: ${email}`);
      await signIn({ email, password });
      toast.success(`Logged in as ${name}`);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // If login fails, try to create the user first
      if (error.message?.includes('Invalid login credentials') || error.message?.includes('Invalid credentials')) {
        toast.error(`User doesn't exist. Click "Create & Login" to create this test user first.`);
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateAndLogin = async (email: string, password: string, name: string, role: string) => {
    setCreatingUser(email);
    try {
      console.log(`Creating and logging in user: ${email}`);
      
      // Find the full test user data
      const testUser = TEST_USERS.find(user => user.email === email);
      if (!testUser) {
        throw new Error('Test user configuration not found');
      }

      // Create the user first
      await createTestUser(testUser);
      toast.success(`Created test user: ${name}`);
      
      // Small delay to ensure user is created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Then log in
      await signIn({ email, password });
      toast.success(`Logged in as ${name}`);
    } catch (error: any) {
      console.error('Create and login error:', error);
      
      if (error.message?.includes('already registered')) {
        // User exists, try to login
        try {
          await signIn({ email, password });
          toast.success(`Logged in as ${name}`);
        } catch (loginError: any) {
          toast.error(`Login failed even after user creation: ${loginError.message}`);
        }
      } else {
        toast.error(`Failed to create user: ${error.message}`);
      }
    } finally {
      setCreatingUser(null);
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
    <div className="space-y-4">
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
              <p className="text-xs text-muted-foreground">Password: {user.password}</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                size="sm"
                onClick={() => handleTestLogin(user.email, user.password, user.name)}
                disabled={isLoggingIn || creatingUser === user.email}
                className="flex items-center gap-2"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <LogIn className="h-3 w-3" />
                )}
                Login
              </Button>
              
              <Button 
                size="sm"
                variant="outline"
                onClick={() => handleCreateAndLogin(user.email, user.password, user.name, user.role)}
                disabled={isLoggingIn || creatingUser === user.email}
                className="flex items-center gap-2"
              >
                {creatingUser === user.email ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                Create & Login
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Note:</strong> If login fails with "Invalid credentials", click "Create & Login" 
          to create the test user first, then use the regular "Login" button.
        </p>
      </div>
    </div>
  );
};

export default TestUserLogin;
