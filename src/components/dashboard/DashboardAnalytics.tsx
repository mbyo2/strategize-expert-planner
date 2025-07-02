
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, BarChart3 } from 'lucide-react';

interface DashboardAnalyticsProps {
  goalAnalytics: any;
  initiativeAnalytics: any;
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ goalAnalytics, initiativeAnalytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Goals</p>
              <p className="text-2xl font-bold">{goalAnalytics?.totalGoals || 0}</p>
            </div>
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Goals</p>
              <p className="text-2xl font-bold">{goalAnalytics?.completedGoals || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Initiatives</p>
              <p className="text-2xl font-bold">{initiativeAnalytics?.activeInitiatives || 0}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
              <p className="text-2xl font-bold">{Math.round(goalAnalytics?.averageProgress || 0)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAnalytics;
