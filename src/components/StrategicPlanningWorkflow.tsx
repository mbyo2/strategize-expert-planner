
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Target, 
  FileText, 
  Users, 
  BarChart3,
  Calendar,
  Plus
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  progress: number;
  estimatedTime: string;
  dependencies?: string[];
}

const StrategicPlanningWorkflow = () => {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: '1',
      title: 'Strategic Assessment',
      description: 'Analyze current state, market conditions, and competitive landscape',
      status: 'completed',
      progress: 100,
      estimatedTime: '2-3 weeks'
    },
    {
      id: '2',
      title: 'Vision & Mission Definition',
      description: 'Define organizational purpose and long-term aspirations',
      status: 'completed',
      progress: 100,
      estimatedTime: '1 week',
      dependencies: ['1']
    },
    {
      id: '3',
      title: 'Strategic Goal Setting',
      description: 'Establish specific, measurable strategic objectives',
      status: 'active',
      progress: 65,
      estimatedTime: '2 weeks',
      dependencies: ['2']
    },
    {
      id: '4',
      title: 'Resource Planning',
      description: 'Allocate resources and define budget requirements',
      status: 'pending',
      progress: 0,
      estimatedTime: '1-2 weeks',
      dependencies: ['3']
    },
    {
      id: '5',
      title: 'Implementation Timeline',
      description: 'Create detailed action plans and timelines',
      status: 'pending',
      progress: 0,
      estimatedTime: '1 week',
      dependencies: ['4']
    },
    {
      id: '6',
      title: 'Performance Metrics',
      description: 'Define KPIs and monitoring mechanisms',
      status: 'pending',
      progress: 0,
      estimatedTime: '1 week',
      dependencies: ['5']
    }
  ]);

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const overallProgress = Math.round(
    workflowSteps.reduce((sum, step) => sum + step.progress, 0) / workflowSteps.length
  );

  const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
  const totalSteps = workflowSteps.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategic Planning Workflow</h2>
          <p className="text-muted-foreground">Follow a structured approach to strategic planning</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Customize Workflow
        </Button>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overall Progress
          </CardTitle>
          <CardDescription>
            Strategic planning workflow completion status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {completedSteps} of {totalSteps} steps completed
              </span>
              <span className="text-2xl font-bold">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-green-600">{completedSteps}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">
                  {workflowSteps.filter(s => s.status === 'active').length}
                </p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-600">
                  {workflowSteps.filter(s => s.status === 'pending').length}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step, index) => (
          <Card key={step.id} className={`transition-all ${step.status === 'active' ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  {getStatusIcon(step.status)}
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription className="mt-1">{step.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(step.status)}>
                    {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">{step.progress}%</p>
                    <p className="text-xs text-muted-foreground">{step.estimatedTime}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <Progress value={step.progress} className="h-2" />
                
                {step.dependencies && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Dependencies:</span>
                    {step.dependencies.map(depId => {
                      const dep = workflowSteps.find(s => s.id === depId);
                      return dep ? (
                        <Badge key={depId} variant="outline" className="text-xs">
                          {dep.title}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Est. {step.estimatedTime}</span>
                    </div>
                    {step.status === 'active' && (
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>In Progress</span>
                      </div>
                    )}
                  </div>
                  
                  {step.status !== 'completed' && (
                    <Button 
                      variant={step.status === 'active' ? 'default' : 'outline'}
                      size="sm"
                      disabled={step.status === 'pending' && step.dependencies?.some(depId => 
                        workflowSteps.find(s => s.id === depId)?.status !== 'completed'
                      )}
                    >
                      {step.status === 'active' ? 'Continue' : 'Start'}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to accelerate your strategic planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="font-medium">Generate Template</span>
              <span className="text-xs text-muted-foreground text-center">
                Create a strategic plan template
              </span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span className="font-medium">Schedule Review</span>
              <span className="text-xs text-muted-foreground text-center">
                Plan stakeholder meetings
              </span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium">View Analytics</span>
              <span className="text-xs text-muted-foreground text-center">
                Track progress metrics
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicPlanningWorkflow;
