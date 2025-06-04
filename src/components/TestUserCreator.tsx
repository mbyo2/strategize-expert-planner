
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Loader2 } from 'lucide-react';
import { TEST_USERS, createAllTestUsers, createTestUser } from '@/services/testUserService';

const TestUserCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<string[]>([]);

  const handleCreateAllUsers = async () => {
    setIsCreating(true);
    try {
      const results = await createAllTestUsers();
      const successful = results.filter(r => r.success).map(r => r.email);
      setCreatedUsers(successful);
    } catch (error) {
      console.error('Error creating test users:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateSingleUser = async (userIndex: number) => {
    setIsCreating(true);
    try {
      await createTestUser(TEST_USERS[userIndex]);
      setCreatedUsers([...createdUsers, TEST_USERS[userIndex].email]);
    } catch (error) {
      console.error('Error creating test user:', error);
    } finally {
      setIsCreating(false);
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Test User Creator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Create test users with different roles to explore the application functionality.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Button 
            onClick={handleCreateAllUsers} 
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Create All Test Users
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {TEST_USERS.map((user, index) => (
            <Card key={user.email} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{user.name}</h4>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Password:</strong> {user.password}</p>
                  <p><strong>Organization:</strong> {user.organization}</p>
                </div>

                {createdUsers.includes(user.email) ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    ✓ Created
                  </Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateSingleUser(index)}
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Create User'
                    )}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Role Permissions:</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li><strong>Admin:</strong> Full access to all features and settings</li>
            <li><strong>Manager:</strong> Access to team management and strategic planning</li>
            <li><strong>Analyst:</strong> Access to data analysis and reporting features</li>
            <li><strong>Viewer:</strong> Read-only access to dashboards and reports</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestUserCreator;
