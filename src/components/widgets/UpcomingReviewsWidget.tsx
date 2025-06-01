
import React, { useState, useEffect } from 'react';
import { WidgetProps } from './WidgetTypes';
import WidgetWrapper from './WidgetWrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, Users } from 'lucide-react';
import { fetchUpcomingStrategyReviews } from '@/services/strategyReviewsService';

interface ReviewData {
  id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  duration_minutes?: number;
}

const UpcomingReviewsWidget: React.FC<WidgetProps> = (props) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchUpcomingStrategyReviews(5);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching upcoming reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return `In ${days} days`;
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <WidgetWrapper {...props}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          {[1, 2].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
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
          <h3 className="text-sm font-medium">Upcoming Reviews</h3>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="space-y-2 p-3 rounded-lg border">
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium">{review.title}</span>
                <Badge variant="outline" className="text-xs">
                  {review.status}
                </Badge>
              </div>
              
              {review.description && (
                <p className="text-xs text-muted-foreground">{review.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(review.scheduled_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(review.scheduled_date)}</span>
                </div>
                {review.duration_minutes && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{review.duration_minutes}min</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {reviews.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No upcoming reviews scheduled
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
};

export default UpcomingReviewsWidget;
