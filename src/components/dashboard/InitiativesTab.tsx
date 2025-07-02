
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Plus
} from 'lucide-react';
import { EnhancedPlanningInitiative } from '@/services/enhancedPlanningService';

interface InitiativesTabProps {
  initiatives: EnhancedPlanningInitiative[];
}

const InitiativesTab: React.FC<InitiativesTabProps> = ({ initiatives }) => {
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
      case 'in-progress': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
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
                
                {initiative.budget && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{initiative.currency} {initiative.budget.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{initiative.stakeholders?.length || 0} stakeholders</span>
                </div>
              </div>
            </div>

            {initiative.risks && initiative.risks.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-muted-foreground">
                  {initiative.risks.length} identified risks
                </span>
              </div>
            )}

            {initiative.success_metrics && initiative.success_metrics.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Success Metrics</h4>
                <div className="space-y-1">
                  {initiative.success_metrics.slice(0, 2).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{metric.name}</span>
                      <span className="text-muted-foreground">
                        {metric.current_value || 0} / {metric.target_value} {metric.unit}
                      </span>
                    </div>
                  ))}
                  {initiative.success_metrics.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{initiative.success_metrics.length - 2} more metrics
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {initiatives.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
  );
};

export default InitiativesTab;
