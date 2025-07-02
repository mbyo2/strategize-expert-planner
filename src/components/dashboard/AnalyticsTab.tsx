
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  DollarSign,
  Users
} from 'lucide-react';

interface AnalyticsTabProps {
  goalAnalytics: any;
  initiativeAnalytics: any;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ goalAnalytics, initiativeAnalytics }) => {
  const completionRate = goalAnalytics?.totalGoals > 0 
    ? Math.round((goalAnalytics.completedGoals / goalAnalytics.totalGoals) * 100)
    : 0;

  const initiativeCompletionRate = initiativeAnalytics?.totalInitiatives > 0
    ? Math.round((initiativeAnalytics.completedInitiatives / initiativeAnalytics.totalInitiatives) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Goal Completion</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Initiative Progress</p>
                <p className="text-2xl font-bold">{initiativeCompletionRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  ${(initiativeAnalytics?.totalBudget || 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk Items</p>
                <p className="text-2xl font-bold">
                  {goalAnalytics?.riskDistribution?.high || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Progress</span>
                <span>{Math.round(goalAnalytics?.averageProgress || 0)}%</span>
              </div>
              <Progress value={goalAnalytics?.averageProgress || 0} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Goals</p>
                <p className="text-lg font-semibold">{goalAnalytics?.totalGoals || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Completed</p>
                <p className="text-lg font-semibold text-green-600">
                  {goalAnalytics?.completedGoals || 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Active</p>
                <p className="text-lg font-semibold text-blue-600">
                  {goalAnalytics?.activeGoals || 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">High Priority</p>
                <p className="text-lg font-semibold text-orange-600">
                  {goalAnalytics?.highPriorityGoals || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Initiatives Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Progress</span>
                <span>{Math.round(initiativeAnalytics?.averageProgress || 0)}%</span>
              </div>
              <Progress value={initiativeAnalytics?.averageProgress || 0} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Initiatives</p>
                <p className="text-lg font-semibold">{initiativeAnalytics?.totalInitiatives || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Completed</p>
                <p className="text-lg font-semibold text-green-600">
                  {initiativeAnalytics?.completedInitiatives || 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Active</p>
                <p className="text-lg font-semibold text-blue-600">
                  {initiativeAnalytics?.activeInitiatives || 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Budget</p>
                <p className="text-lg font-semibold text-purple-600">
                  ${(initiativeAnalytics?.totalBudget || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      {goalAnalytics?.riskDistribution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {goalAnalytics.riskDistribution.low}
                </p>
                <p className="text-sm text-muted-foreground">Low Risk</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {goalAnalytics.riskDistribution.medium}
                </p>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {goalAnalytics.riskDistribution.high}
                </p>
                <p className="text-sm text-muted-foreground">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestone Status */}
      {initiativeAnalytics?.milestoneStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Milestone Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{initiativeAnalytics.milestoneStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Milestones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {initiativeAnalytics.milestoneStats.completed}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {initiativeAnalytics.milestoneStats.inProgress}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {initiativeAnalytics.milestoneStats.blocked}
                </p>
                <p className="text-sm text-muted-foreground">Blocked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsTab;
