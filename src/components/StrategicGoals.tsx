
import React, { useState } from 'react';
import { Target, Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface StrategicGoal {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'active' | 'completed' | 'paused';
  progress: number;
  target_value?: number;
  current_value?: number;
  start_date?: string;
  due_date?: string;
}

const StrategicGoals: React.FC = () => {
  const [goals, setGoals] = useState<StrategicGoal[]>([
    {
      id: '1',
      name: 'Increase Market Share',
      description: 'Grow market share by 15% in the next quarter',
      status: 'active',
      progress: 65,
      target_value: 15,
      current_value: 9.75,
      start_date: '2024-01-01',
      due_date: '2024-03-31'
    },
    {
      id: '2',
      name: 'Digital Transformation',
      description: 'Complete digital transformation initiative',
      status: 'active',
      progress: 40,
      start_date: '2024-01-15',
      due_date: '2024-06-30'
    }
  ]);

  const getStatusColor = (status: StrategicGoal['status']) => {
    switch (status) {
      case 'planned': return 'bg-gray-500';
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: StrategicGoal['status']) => {
    switch (status) {
      case 'planned': return 'Planned';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'paused': return 'Paused';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategic Goals</h2>
          <p className="text-muted-foreground">Track and manage your strategic objectives</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="grid gap-6">
        {goals.map(goal => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {goal.name}
                  </CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(goal.status)}>
                    {getStatusText(goal.status)}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>

              {goal.target_value && goal.current_value && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Current: {goal.current_value}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target: {goal.target_value}%</span>
                  </div>
                </div>
              )}

              {(goal.start_date || goal.due_date) && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {goal.start_date && (
                    <span>Started: {new Date(goal.start_date).toLocaleDateString()}</span>
                  )}
                  {goal.due_date && (
                    <span>Due: {new Date(goal.due_date).toLocaleDateString()}</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategicGoals;
