
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Target, Users, TrendingUp, Calendar, Bell, Plus, Loader2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import InfoCard from '@/components/InfoCard';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { session } = useSimpleAuth();
  const { stats, activities, isLoading } = useDashboardData();
  const navigate = useNavigate();

  const quickStats = [
    {
      title: 'Active Goals',
      value: stats.activeGoals,
      description: 'Goals in progress',
      icon: <Target className="h-4 w-4" />,
      trend: 'up' as const,
      trendValue: stats.activeGoals > 0 ? `${stats.activeGoals} active` : 'No active goals'
    },
    {
      title: 'Team Members',
      value: stats.teamMembers,
      description: 'Across all teams',
      icon: <Users className="h-4 w-4" />,
      trend: 'neutral' as const,
      trendValue: `${stats.teamMembers} total`
    },
    {
      title: 'Planning Initiatives',
      value: stats.planningInitiatives,
      description: 'Currently active',
      icon: <BarChart3 className="h-4 w-4" />,
      trend: 'neutral' as const,
      trendValue: stats.planningInitiatives > 0 ? 'On track' : 'None active'
    },
    {
      title: 'Reviews Scheduled',
      value: stats.reviewsScheduled,
      description: 'Upcoming',
      icon: <Calendar className="h-4 w-4" />,
      trend: 'up' as const,
      trendValue: stats.reviewsScheduled > 0 ? `${stats.reviewsScheduled} scheduled` : 'None scheduled'
    }
  ];

  if (isLoading) {
    return (
      <PageLayout 
        title="Dashboard"
        subtitle="Loading your dashboard..."
        icon={<BarChart3 className="h-6 w-6" />}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Dashboard"
      subtitle={`Welcome back, ${session?.user?.email || 'User'}!`}
      icon={<BarChart3 className="h-6 w-6" />}
    >
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/goals')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
          <Button onClick={() => navigate('/teams')} variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Manage Teams
          </Button>
          <Button onClick={() => navigate('/planning')} variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Planning
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
                {activities.length > 0 ? activities.map((activity, index) => (
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
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activities
                  </p>
                )}
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
                Active Goals
              </p>
              <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                {stats.activeGoals > 0 
                  ? `${stats.activeGoals} strategic goal${stats.activeGoals !== 1 ? 's' : ''} in progress`
                  : 'No active goals - create one to get started'}
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Team Overview
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                {stats.teamMembers > 0
                  ? `${stats.teamMembers} team member${stats.teamMembers !== 1 ? 's' : ''} across your organization`
                  : 'Invite team members to collaborate'}
              </p>
            </div>
            
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Planning Status
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                {stats.planningInitiatives > 0
                  ? `${stats.planningInitiatives} initiative${stats.planningInitiatives !== 1 ? 's' : ''} currently active`
                  : 'Start planning to track initiatives'}
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
