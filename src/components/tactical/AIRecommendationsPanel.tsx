
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle, X, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIRecommendationsPanelProps {
  onStatusUpdate: (count: number) => void;
}

const AIRecommendationsPanel: React.FC<AIRecommendationsPanelProps> = ({ onStatusUpdate }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
    
    const channel = supabase
      .channel('ai_recommendations_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_recommendations' }, 
        () => fetchRecommendations())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recommendations:', error);
    } else {
      setRecommendations(data || []);
      onStatusUpdate(data?.length || 0);
    }
    setLoading(false);
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return variants[priority] || 'secondary';
  };

  const updateRecommendationStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('ai_recommendations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update recommendation');
    } else {
      toast.success(`Recommendation ${status}`);
      fetchRecommendations();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          AI Recommendations
        </CardTitle>
        <CardDescription>
          Tactical insights and suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {recommendations.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No pending recommendations
          </div>
        ) : (
          recommendations.map((rec) => (
            <div key={rec.id} className="p-3 border rounded-lg space-y-2 bg-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getPriorityBadge(rec.priority)}>
                      {rec.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {rec.recommendation_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{rec.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                  {rec.confidence_score && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Confidence: {Math.round(rec.confidence_score * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => updateRecommendationStatus(rec.id, 'implemented')}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => updateRecommendationStatus(rec.id, 'dismissed')}
                >
                  <X className="h-3 w-3 mr-1" />
                  Dismiss
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendationsPanel;
