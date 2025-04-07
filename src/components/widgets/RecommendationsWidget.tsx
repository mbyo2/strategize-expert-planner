
import React, { useEffect, useState } from 'react';
import { WidgetProps } from './WidgetTypes';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import WidgetWrapper from './WidgetWrapper';
import { fetchTopRecommendations, Recommendation } from '@/services/recommendationsService';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const RecommendationsWidget: React.FC<WidgetProps> = (props) => {
  const isMobile = window.innerWidth < 640;
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const topRecommendations = await fetchTopRecommendations(3);
        setRecommendations(topRecommendations);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, []);
  
  const handleViewAll = () => {
    navigate('/planning');
  };
  
  return (
    <WidgetWrapper {...props}>
      <h3 className="text-base sm:text-lg font-medium mb-2">Strategic Recommendations</h3>
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start">
              <Skeleton className="h-5 w-5 rounded-full mr-2" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          {recommendations.map((recommendation, index) => (
            <li key={recommendation.id} className="flex items-start">
              <span className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs mr-2">
                {recommendation.priority}
              </span>
              <span>{recommendation.title}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-muted-foreground py-2">No recommendations found.</div>
      )}
      
      <Button 
        variant="ghost" 
        size={isMobile ? "sm" : "default"} 
        className="mt-3 sm:mt-4 text-primary hover:text-primary/80"
        onClick={handleViewAll}
      >
        See all recommendations <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </WidgetWrapper>
  );
};

export default RecommendationsWidget;
