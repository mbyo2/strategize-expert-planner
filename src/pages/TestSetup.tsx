
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Database, Users, Settings, Target, BarChart3, Calendar, Bell } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import TestUserCreator from '@/components/TestUserCreator';
import TestUserLogin from '@/components/TestUserLogin';

const TestSetup = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    database: 'connected',
    auth: 'connected',
    storage: 'warning'
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const sampleDataSummary = [
    {
      icon: <Users className="h-4 w-4" />,
      title: 'Organizations',
      count: 2,
      description: 'Tech Corp and InnovateCo with sample teams'
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: 'Planning Initiatives',
      count: 4,
      description: 'Digital transformation, customer experience, training, and sustainability'
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      title: 'Industry Metrics',
      count: 6,
      description: 'Growth rates, market size, retention, and satisfaction scores'
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      title: 'Strategy Reviews',
      count: 4,
      description: 'Scheduled quarterly and annual strategic review sessions'
    },
    {
      icon: <Bell className="h-4 w-4" />,
      title: 'Notifications',
      count: 4,
      description: 'Sample alerts and updates for testing'
    }
  ];

  return (
    <PageLayout 
      title="Test Environment Setup"
      subtitle="Configure and manage your test environment"
      icon={<Settings className="h-6 w-6" />}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Setup</h1>
          <p className="text-muted-foreground mt-2">
            Set up test users and explore the sample data already loaded in your application.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleDataSummary.map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Database className="h-5 w-5" />
              Sample Data Loaded
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-700 dark:text-green-300">
            <p>
              Your database has been populated with sample data including organizations, teams, 
              strategic goals, industry metrics, market changes, and more. This data will help 
              you test all features of the application.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✓ Organizations & Teams
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✓ Strategic Initiatives
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✓ Industry Metrics
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✓ Market Analysis
              </Badge>
            </div>
          </CardContent>
        </Card>

        <TestUserCreator />

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mt-0.5">
                <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
              </div>
              <div>
                <p className="font-medium">Create Test Users</p>
                <p className="text-sm text-muted-foreground">
                  Use the Test User Creator above to create users with different roles
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mt-0.5">
                <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
              </div>
              <div>
                <p className="font-medium">Test Role-Based Access</p>
                <p className="text-sm text-muted-foreground">
                  Log in with different test users to see how permissions work
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mt-0.5">
                <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
              </div>
              <div>
                <p className="font-medium">Explore Sample Data</p>
                <p className="text-sm text-muted-foreground">
                  Navigate through the application to see the sample data in action
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TestSetup;
