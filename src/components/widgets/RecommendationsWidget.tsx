
import React, { useState, useEffect } from 'react';
import { WidgetProps } from './WidgetTypes';
import WidgetWrapper from './WidgetWrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed';
  category?: string;
  created_at: string;
}

const RecommendationsWidget: React.FC<WidgetProps> = (props) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: Recommendation[] = [
        {
          id: '1',
          title: 'Expand digital marketing budget',
          description: 'Increase digital marketing spend by 25% to capture growing online audience',
          priority: 1,
          status: 'pending',
          category: 'Marketing',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Implement customer feedback system',
          description: 'Deploy automated feedback collection to improve product development',
          priority: 2,
          status: 'in_progress',
          category: 'Product',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          title: 'Optimize supply chain efficiency',
          description: 'Review vendor contracts and consolidate suppliers for cost reduction',
          priority: 1,
          status: 'pending',
          category: 'Operations',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      setRecommendations(mockData.sort((a, b) => a.priority - b.priority));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'destructive';
      case 2:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <WidgetWrapper {...props}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-20" />
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))}
        </div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper {...props}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Strategic Recommendations</h3>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {recommendations.slice(0, 3).map((recommendation) => (
            <div key={recommendation.id} className="space-y-2 p-3 rounded-lg border">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(recommendation.status)}
                  <span className="text-sm font-medium">{recommendation.title}</span>
                </div>
                <Badge variant={getPriorityColor(recommendation.priority) as any} className="text-xs">
                  P{recommendation.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{recommendation.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground capitalize">
                  {recommendation.status.replace('_', ' ')}
                </span>
                {recommendation.category && (
                  <span className="text-xs text-muted-foreground">{recommendation.category}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {recommendations.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No recommendations available
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
};

export default RecommendationsWidget;
