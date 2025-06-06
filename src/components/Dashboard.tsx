
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, TrendingUp, Calendar } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

const Dashboard = () => {
  const { session } = useSimpleAuth();
  const user = session.user;

  const dashboardCards = [
    {
      title: 'Active Goals',
      value: '12',
      icon: Target,
      description: 'Strategic objectives in progress'
    },
    {
      title: 'Team Members',
      value: '8',
      icon: Users,
      description: 'Active team members'
    },
    {
      title: 'Performance',
      value: '+15%',
      icon: TrendingUp,
      description: 'Overall progress this quarter'
    },
    {
      title: 'Reviews',
      value: '3',
      icon: Calendar,
      description: 'Upcoming strategy reviews'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!
        </h1>
        <div className="text-sm text-muted-foreground">
          Role: {user?.role || 'viewer'}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New strategic goal created</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Initiative milestone completed</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Strategy review scheduled</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-2 rounded hover:bg-muted text-sm">
                Create new strategic goal
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-muted text-sm">
                Schedule strategy review
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-muted text-sm">
                View team performance
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-muted text-sm">
                Generate progress report
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
