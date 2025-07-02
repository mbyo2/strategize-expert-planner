
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, DollarSign, Users, AlertCircle } from 'lucide-react';
import { type EnhancedPlanningInitiative } from '@/services/enhancedPlanningService';

interface InitiativesTabProps {
  initiatives: EnhancedPlanningInitiative[];
}

const InitiativesTab: React.FC<InitiativesTabProps> = ({ initiatives }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'planning':
        return 'bg-yellow-500';
      case 'on-hold':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initiatives.map((initiative) => (
          <Card key={initiative.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{initiative.name}</CardTitle>
                <Badge variant={getPriorityColor(initiative.priority || 'medium')}>
                  {initiative.priority || 'Medium'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(initiative.status)}`} />
                <span className="text-sm text-muted-foreground capitalize">
                  {initiative.status}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {initiative.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {initiative.progress}%
                  </span>
                </div>
                <Progress value={initiative.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {initiative.start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Date(initiative.start_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {initiative.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: initiative.currency || 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(Number(initiative.budget))}
                    </span>
                  </div>
                )}
              </div>
              
              {initiative.stakeholders && initiative.stakeholders.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {initiative.stakeholders.length} stakeholder(s)
                  </span>
                </div>
              )}
              
              {initiative.risks && initiative.risks.length > 0 && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">
                    {initiative.risks.length} risk(s) identified
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {initiatives.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No planning initiatives found.</p>
        </div>
      )}
    </div>
  );
};

export default InitiativesTab;
