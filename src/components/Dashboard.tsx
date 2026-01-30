
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Users, Calendar, BarChart3, CheckCircle, Shield, LogOut, User, Eye, Settings } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { session, signOut, hasRole } = useSimpleAuth();
  const { stats, activities, isLoading } = useDashboardData();
  const navigate = useNavigate();
  const user = session?.user;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
      case 'superuser':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'analyst':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'superuser':
        return Shield;
      case 'manager':
        return BarChart3;
      case 'analyst':
        return User;
      case 'viewer':
        return Eye;
      default:
        return User;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const metrics = [
    {
      title: "Active Goals",
      value: stats.activeGoals.toString(),
      change: stats.activeGoals > 0 ? `${stats.activeGoals} in progress` : 'No active goals',
      icon: Target,
      trend: "up"
    },
    {
      title: "Team Members",
      value: stats.teamMembers.toString(),
      change: `${stats.teamMembers} total`,
      icon: Users,
      trend: "up"
    },
    {
      title: "Planning Initiatives",
      value: stats.planningInitiatives.toString(),
      change: stats.planningInitiatives > 0 ? 'Currently active' : 'None active',
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Reviews Scheduled",
      value: stats.reviewsScheduled.toString(),
      change: stats.reviewsScheduled > 0 ? `${stats.reviewsScheduled} upcoming` : 'None scheduled',
      icon: Calendar,
      trend: "neutral"
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const RoleIcon = user?.role ? getRoleIcon(user.role) : User;

  return (
    <div className="p-6 space-y-6">
      {/* User Welcome Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <RoleIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}!</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge className={getRoleBadgeColor(user?.role || 'viewer')}>
                    {user?.role || 'viewer'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="destructive" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/goals')}>
              <Target className="h-4 w-4 mr-2" />
              View Goals
            </Button>
            {hasRole('analyst') && (
              <Button variant="outline" onClick={() => navigate('/analytics')}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            )}
            {hasRole('manager') && (
              <>
                <Button variant="outline" onClick={() => navigate('/teams')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Teams
                </Button>
                <Button variant="outline" onClick={() => navigate('/planning')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Planning
                </Button>
              </>
            )}
            {hasRole('admin') && (
              <>
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
                <Button variant="outline" onClick={() => navigate('/user-management')}>
                  <User className="h-4 w-4 mr-2" />
                  User Management
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.length > 0 ? activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Badge variant="outline">{activity.type}</Badge>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activities
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Your Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 border rounded-lg ${true ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-900/20'}`}>
                <span className="text-sm">View Goals & Analytics</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className={`flex items-center justify-between p-3 border rounded-lg ${hasRole('analyst') ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-900/20'}`}>
                <span className="text-sm">Create & Edit Goals</span>
                {hasRole('analyst') ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="text-xs text-muted-foreground">Analyst+</span>
                )}
              </div>
              <div className={`flex items-center justify-between p-3 border rounded-lg ${hasRole('manager') ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-900/20'}`}>
                <span className="text-sm">Manage Teams & Planning</span>
                {hasRole('manager') ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="text-xs text-muted-foreground">Manager+</span>
                )}
              </div>
              <div className={`flex items-center justify-between p-3 border rounded-lg ${hasRole('admin') ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-900/20'}`}>
                <span className="text-sm">Admin & User Management</span>
                {hasRole('admin') ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="text-xs text-muted-foreground">Admin only</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Quick Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.activeGoals > 0 ? Math.round((stats.activeGoals / (stats.activeGoals + 2)) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">Goals On Track</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.teamMembers}</div>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.planningInitiatives}</div>
              <p className="text-sm text-muted-foreground">Active Initiatives</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
