
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  MessageSquare, 
  Paperclip,
  Plus,
  BarChart3,
  Users
} from 'lucide-react';
import { enhancedGoalsService, type EnhancedStrategicGoal } from '@/services/enhancedGoalsService';
import { enhancedPlanningService, type EnhancedPlanningInitiative } from '@/services/enhancedPlanningService';

const EnhancedGoalsDashboard = () => {
  const [goals, setGoals] = useState<EnhancedStrategicGoal[]>([]);
  const [initiatives, setInitiatives] = useState<EnhancedPlanningInitiative[]>([]);
  const [goalAnalytics, setGoalAnalytics] = useState<any>(null);
  const [initiativeAnalytics, setInitiativeAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [goalsData, initiativesData, goalStats, initiativeStats] = await Promise.all([
        enhancedGoalsService.getEnhancedGoals(),
        enhancedPlanningService.getEnhancedInitiatives(),
        enhancedGoalsService.getGoalAnalytics(),
        enhancedPlanningService.getInitiativeAnalytics()
      ]);
      
      setGoals(goalsData);
      setInitiatives(initiativesData);
      setGoalAnalytics(goalStats);
      setInitiativeAnalytics(initiativeStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': case 'in-progress': return 'bg-blue-500';
      case 'planning': case 'planned': return 'bg-yellow-500';
      case 'paused': case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Enhanced Goals & Planning</h1>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Initiative
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
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

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">Strategic Goals</TabsTrigger>
          <TabsTrigger value="initiatives">Planning Initiatives</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                        <Badge variant="outline">
                          {goal.category}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(goal.status)}`} />
                        <span className="text-sm text-muted-foreground capitalize">
                          {goal.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{goal.progress}%</p>
                      <p className={`text-sm ${getRiskColor(goal.risk_level)}`}>
                        {goal.risk_level} risk
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                  
                  <Progress value={goal.progress} className="w-full" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      {goal.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {new Date(goal.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{goal.goal_comments?.length || 0} comments</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4" />
                        <span>{goal.goal_attachments?.length || 0} files</span>
                      </div>
                    </div>
                    
                    {goal.target_value && goal.current_value && (
                      <div className="text-right">
                        <span className="font-medium">{goal.current_value}</span>
                        <span className="text-muted-foreground"> / {goal.target_value}</span>
                      </div>
                    )}
                  </div>

                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Milestones</h4>
                      <div className="space-y-1">
                        {goal.milestones.slice(0, 3).map((milestone, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                        {goal.milestones.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{goal.milestones.length - 3} more milestones
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {goal.dependencies && goal.dependencies.length > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-muted-foreground">
                        {goal.dependencies.length} dependencies
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {goals.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Strategic Goals</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first strategic goal to get started
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="initiatives" className="space-y-4">
          <div className="grid gap-4">
            {initiatives.map((initiative) => (
              <Card key={initiative.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{initiative.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(initiative.priority)}>
                          {initiative.priority}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(initiative.status)}`} />
                        <span className="text-sm text-muted-foreground capitalize">
                          {initiative.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{initiative.progress}%</p>
                      {initiative.budget && (
                        <p className="text-sm text-muted-foreground">
                          {initiative.currency} {initiative.budget.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {initiative.description && (
                    <p className="text-sm text-muted-foreground">{initiative.description}</p>
                  )}
                  
                  <Progress value={initiative.progress} className="w-full" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      {initiative.end_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {new Date(initiative.end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {initiative.stakeholders && initiative.stakeholders.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{initiative.stakeholders.length} stakeholders</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {initiative.success_metrics && initiative.success_metrics.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Success Metrics</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {initiative.success_metrics.slice(0, 2).map((metric, index) => (
                          <div key={index} className="text-sm">
                            <p className="font-medium">{metric.name}</p>
                            <p className="text-muted-foreground">
                              {metric.current_value || 0} / {metric.target_value} {metric.unit}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {initiative.risks && initiative.risks.length > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-muted-foreground">
                        {initiative.risks.filter(r => r.status !== 'mitigated').length} active risks
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {initiatives.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Planning Initiatives</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first planning initiative to get started
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Initiative
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Goal Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Goals</span>
                    <span className="font-medium">{goalAnalytics?.totalGoals || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-medium text-green-600">{goalAnalytics?.completedGoals || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active</span>
                    <span className="font-medium text-blue-600">{goalAnalytics?.activeGoals || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Priority</span>
                    <span className="font-medium text-red-600">{goalAnalytics?.highPriorityGoals || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Progress</span>
                    <span className="font-medium">{Math.round(goalAnalytics?.averageProgress || 0)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Initiative Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Initiatives</span>
                    <span className="font-medium">{initiativeAnalytics?.totalInitiatives || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-medium text-green-600">{initiativeAnalytics?.completedInitiatives || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active</span>
                    <span className="font-medium text-blue-600">{initiativeAnalytics?.activeInitiatives || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Budget</span>
                    <span className="font-medium">${(initiativeAnalytics?.totalBudget || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Progress</span>
                    <span className="font-medium">{Math.round(initiativeAnalytics?.averageProgress || 0)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedGoalsDashboard;
