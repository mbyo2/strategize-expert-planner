
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Target, Users, TrendingUp, Calendar, Bell, Plus } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import InfoCard from '@/components/InfoCard';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

const Dashboard = () => {
  const { session } = useSimpleAuth();

  const quickStats = [
    {
      title: 'Active Goals',
      value: 12,
      description: 'Goals in progress',
      icon: <Target className="h-4 w-4" />,
      trend: 'up',
      trendValue: '+2 this month'
    },
    {
      title: 'Team Members',
      value: 24,
      description: 'Across all teams',
      icon: <Users className="h-4 w-4" />,
      trend: 'up',
      trendValue: '+3 new'
    },
    {
      title: 'Planning Initiatives',
      value: 8,
      description: 'Currently active',
      icon: <BarChart3 className="h-4 w-4" />,
      trend: 'neutral',
      trendValue: 'On track'
    },
    {
      title: 'Reviews Scheduled',
      value: 5,
      description: 'This quarter',
      icon: <Calendar className="h-4 w-4" />,
      trend: 'up',
      trendValue: 'Next: March 15'
    }
  ];

  const recentActivities = [
    {
      title: 'Strategic Goal Updated',
      description: 'Market expansion goal progress updated to 65%',
      time: '2 hours ago',
      type: 'goal'
    },
    {
      title: 'New Team Member Added',
      description: 'Sarah Johnson joined the Marketing team',
      time: '5 hours ago',
      type: 'team'
    },
    {
      title: 'Industry Metric Alert',
      description: 'Customer satisfaction index increased by 8%',
      time: '1 day ago',
      type: 'metric'
    },
    {
      title: 'Planning Initiative Started',
      description: 'Digital transformation initiative launched',
      time: '2 days ago',
      type: 'planning'
    }
  ];

  return (
    <PageLayout 
      title="Dashboard"
      subtitle={`Welcome back, ${session.user?.name || 'User'}!`}
      icon={<BarChart3 className="h-6 w-6" />}
    >
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Add Team Member
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Review
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <InfoCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend as 'up' | 'down' | 'neutral'}
              trendValue={stat.trendValue}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest updates from your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-3 border-b border-border last:border-0">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Goals on Track
                </p>
                <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                  85% of strategic goals are meeting their targets
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Team Productivity
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Team collaboration up 23% this quarter
                </p>
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Market Opportunity
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                  New market segment showing 15% growth
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
