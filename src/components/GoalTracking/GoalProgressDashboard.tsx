
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart,
  ChevronRight, 
  Target, 
  Check, 
  Clock, 
  BarChart4, 
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchStrategicGoals, StrategicGoal } from '@/services/strategicGoalsService';

const GoalProgressDashboard = () => {
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('all');

  useEffect(() => {
    const loadGoals = async () => {
      try {
        setLoading(true);
        const fetchedGoals = await fetchStrategicGoals();
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Error loading strategic goals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  const filterGoalsByStatus = (status: string) => {
    if (status === 'all') return goals;
    return goals.filter(goal => goal.status === status);
  };

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / goals.length);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'active':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderGoalList = (filteredGoals: StrategicGoal[]) => {
    if (filteredGoals.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No goals found in this category</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredGoals.map((goal) => (
          <div key={goal.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                {getStatusIcon(goal.status)}
                <div>
                  <h4 className="font-medium">{goal.name}</h4>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium">{goal.progress}%</span>
            </div>
            
            <Progress 
              value={goal.progress} 
              className="h-1.5" 
              indicatorClassName={goal.status === 'completed' ? "bg-green-500" : "bg-blue-500"} 
            />
            
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>
                  {goal.due_date ? new Date(goal.due_date).toLocaleDateString() : 'No deadline'}
                </span>
              </div>
              
              {goal.target_value && (
                <div className="flex items-center space-x-1">
                  <Target className="h-3 w-3" />
                  <span>Target: {goal.target_value}</span>
                </div>
              )}
              
              {goal.current_value && (
                <div className="flex items-center space-x-1">
                  <BarChart4 className="h-3 w-3" />
                  <span>Current: {goal.current_value}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Strategic Goals Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Overall Progress</h3>
              <span className="text-lg font-bold">{calculateOverallProgress()}%</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-2" />
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Total Goals</p>
                <p className="text-lg font-bold">{goals.length}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg font-bold">{goals.filter(g => g.status === 'completed').length}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-lg font-bold">{goals.filter(g => g.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={view} onValueChange={setView}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All Goals</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              {renderGoalList(filterGoalsByStatus('all'))}
            </TabsContent>
            
            <TabsContent value="active" className="mt-4">
              {renderGoalList(filterGoalsByStatus('active'))}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              {renderGoalList(filterGoalsByStatus('completed'))}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between">
            <Button variant="outline" size="sm" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              View Timeline
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <BarChart className="h-4 w-4 mr-1" />
              Analytics
            </Button>
            <Button variant="default" size="sm" className="flex items-center">
              Add Goal
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgressDashboard;
