
import React, { useEffect, useState } from 'react';
import { WidgetProps } from './WidgetTypes';
import WidgetWrapper from './WidgetWrapper';
import { Calendar } from 'lucide-react';
import { fetchUpcomingStrategyReviews, StrategyReview } from '@/services/strategyReviewsService';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const UpcomingReviewsWidget: React.FC<WidgetProps> = (props) => {
  const [upcomingReview, setUpcomingReview] = useState<StrategyReview | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUpcomingReview = async () => {
      try {
        setLoading(true);
        const reviews = await fetchUpcomingStrategyReviews(1);
        setUpcomingReview(reviews.length > 0 ? reviews[0] : null);
      } catch (error) {
        console.error('Error loading upcoming review:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUpcomingReview();
  }, []);

  if (loading) {
    return (
      <WidgetWrapper {...props}>
        <div className="space-y-3">
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex flex-col">
            <Skeleton className="h-6 w-20 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
      </WidgetWrapper>
    );
  }

  if (!upcomingReview) {
    return (
      <WidgetWrapper {...props}>
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <Calendar className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">No upcoming reviews scheduled</p>
        </div>
      </WidgetWrapper>
    );
  }

  const reviewDate = new Date(upcomingReview.scheduled_date);
  const formattedDate = format(reviewDate, 'MMM d');
  const formattedTime = format(reviewDate, 'h:mm a');
  const durationHours = upcomingReview.duration_minutes ? 
    Math.floor(upcomingReview.duration_minutes / 60) : 1;
  const durationMinutes = upcomingReview.duration_minutes ? 
    upcomingReview.duration_minutes % 60 : 0;
  
  const endTime = new Date(reviewDate);
  endTime.setMinutes(endTime.getMinutes() + (upcomingReview.duration_minutes || 60));
  const formattedEndTime = format(endTime, 'h:mm a');

  return (
    <WidgetWrapper {...props}>
      <div className="space-y-3">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm font-medium">{upcomingReview.title}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold">{formattedDate}</span>
          <span className="text-xs text-muted-foreground">{formattedTime} - {formattedEndTime}</span>
        </div>
        <span className="text-xs text-primary">{upcomingReview.status}</span>
      </div>
    </WidgetWrapper>
  );
};

export default UpcomingReviewsWidget;
