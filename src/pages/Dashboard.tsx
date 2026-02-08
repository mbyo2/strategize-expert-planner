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
      trendValue: stats.activeGoals > 0 ? `${stats.activeGoals} active` : 'None yet'
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
      title: 'Initiatives',
      value: stats.planningInitiatives,
      description: 'Currently active',
      icon: <BarChart3 className="h-4 w-4" />,
      trend: 'neutral' as const,
      trendValue: stats.planningInitiatives > 0 ? 'On track' : 'None active'
    },
    {
      title: 'Reviews',
      value: stats.reviewsScheduled,
      description: 'Upcoming',
      icon: <Calendar className="h-4 w-4" />,
      trend: 'up' as const,
      trendValue: stats.reviewsScheduled > 0 ? `${stats.reviewsScheduled} scheduled` : 'None'
    }
  ];

  if (isLoading) {
    return (
      <PageLayout title="Dashboard" subtitle="Loading..." icon={<BarChart3 className="h-5 w-5" />}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Dashboard"
      subtitle={`Welcome back, ${session?.user?.email?.split('@')[0] || 'User'}`}
      icon={<BarChart3 className="h-5 w-5" />}
      actions={
        <div className="flex gap-2">
          <Button onClick={() => navigate('/goals')} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Goal
          </Button>
          <Button onClick={() => navigate('/planning')} variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Planning
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <InfoCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
              trendValue={stat.trendValue}
            />
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-muted-foreground" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates from your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.length > 0 ? activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{activity.time}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">{activity.type}</Badge>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No recent activities</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 border border-emerald-100 dark:border-emerald-900">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Active Goals</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {stats.activeGoals > 0
                    ? `${stats.activeGoals} strategic goal${stats.activeGoals !== 1 ? 's' : ''} in progress`
                    : 'Create your first goal to get started'}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 border border-blue-100 dark:border-blue-900">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Team Overview</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                  {stats.teamMembers > 0
                    ? `${stats.teamMembers} member${stats.teamMembers !== 1 ? 's' : ''} across your organization`
                    : 'Invite team members to collaborate'}
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 border border-amber-100 dark:border-amber-900">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Planning</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  {stats.planningInitiatives > 0
                    ? `${stats.planningInitiatives} initiative${stats.planningInitiatives !== 1 ? 's' : ''} active`
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
