
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { fetchStrategicGoals, StrategicGoal } from '@/services/strategicGoalsService';
import { toast } from 'sonner';

export default function GoalProgressDashboard() {
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await fetchStrategicGoals();
        setGoals(data);
      } catch (error) {
        console.error('Failed to load goals:', error);
        toast.error('Failed to load strategic goals');
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'planned': { variant: 'secondary' as const, label: 'Planned' },
      'active': { variant: 'default' as const, label: 'Active' },
      'completed': { variant: 'default' as const, label: 'Completed' },
      'paused': { variant: 'destructive' as const, label: 'Paused' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string, progress: number) => {
    if (status === 'completed' || progress === 100) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (progress < 30) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (progress < 70) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return <TrendingUp className="h-4 w-4 text-blue-500" />;
  };

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed' || g.progress === 100).length,
    active: goals.filter(g => g.status === 'active').length,
    averageProgress: goals.length > 0 ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) : 0
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total Goals</p>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                <div className="text-2xl font-bold">{stats.active}</div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <div className="text-2xl font-bold">{stats.completed}</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <div className="text-2xl font-bold">{stats.averageProgress}%</div>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Strategic Goals</h3>
              <p className="text-muted-foreground mb-4">
                Create your first strategic goal to start tracking progress.
              </p>
              <Button>Create Goal</Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(goal.status, goal.progress)}
                      <h3 className="font-semibold">{goal.name}</h3>
                      {getStatusBadge(goal.status)}
                    </div>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    {(goal.current_value !== null && goal.target_value !== null) && (
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span>Current: {goal.current_value}</span>
                        <span>Target: {goal.target_value}</span>
                      </div>
                    )}
                    {goal.due_date && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        <span>Due: {new Date(goal.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
