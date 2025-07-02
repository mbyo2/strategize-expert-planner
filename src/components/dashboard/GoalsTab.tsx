import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  AlertTriangle, 
  Calendar, 
  MessageSquare, 
  Paperclip,
  Plus
} from 'lucide-react';
import { EnhancedStrategicGoal } from '@/services/enhancedGoalsService';

interface GoalsTabProps {
  goals: EnhancedStrategicGoal[];
}

const GoalsTab: React.FC<GoalsTabProps> = ({ goals }) => {
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

  return (
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
  );
};

export default GoalsTab;
