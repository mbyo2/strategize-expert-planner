
import React, { useEffect, useState } from 'react';
import { WidgetProps } from './WidgetTypes';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import WidgetWrapper from './WidgetWrapper';
import { fetchRecentMarketChanges, MarketChange } from '@/services/marketChangesService';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const MarketChangesWidget: React.FC<WidgetProps> = (props) => {
  const isMobile = window.innerWidth < 640;
  const navigate = useNavigate();
  const [marketChanges, setMarketChanges] = useState<MarketChange[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadMarketChanges = async () => {
      try {
        setLoading(true);
        const changes = await fetchRecentMarketChanges(3);
        setMarketChanges(changes);
      } catch (error) {
        console.error('Error loading market changes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMarketChanges();
  }, []);
  
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'positive':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const handleViewAll = () => {
    navigate('/industry');
  };
  
  return (
    <WidgetWrapper {...props}>
      <h3 className="text-base sm:text-lg font-medium mb-2">Recent Market Changes</h3>
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start">
              <Skeleton className="h-2 w-2 rounded-full mt-2 mr-2" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      ) : marketChanges.length > 0 ? (
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          {marketChanges.map((change) => (
            <li key={change.id} className="flex items-start">
              <span className={`h-2 w-2 rounded-full ${getImpactColor(change.impact_level)} mt-2 mr-2`}></span>
              <span>{change.title}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-muted-foreground py-2">No recent market changes found.</div>
      )}
      
      <Button 
        variant="ghost" 
        size={isMobile ? "sm" : "default"} 
        className="mt-3 sm:mt-4 text-primary hover:text-primary/80"
        onClick={handleViewAll}
      >
        View all updates <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </WidgetWrapper>
  );
};

export default MarketChangesWidget;
