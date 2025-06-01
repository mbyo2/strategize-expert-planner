
import React, { useState, useEffect } from 'react';
import { WidgetProps } from './WidgetTypes';
import WidgetWrapper from './WidgetWrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';

interface MarketChange {
  id: string;
  title: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  date_identified: string;
  category?: string;
  source?: string;
}

const MarketChangesWidget: React.FC<WidgetProps> = (props) => {
  const [marketChanges, setMarketChanges] = useState<MarketChange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketChanges();
  }, []);

  const fetchMarketChanges = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: MarketChange[] = [
        {
          id: '1',
          title: 'New Competitor Entry',
          description: 'TechCorp launched a competing product with 20% lower pricing',
          impact_level: 'high',
          date_identified: new Date().toISOString(),
          category: 'Competition',
          source: 'Market Research'
        },
        {
          id: '2',
          title: 'Regulatory Changes',
          description: 'New data privacy regulations announced for Q2',
          impact_level: 'medium',
          date_identified: new Date(Date.now() - 86400000).toISOString(),
          category: 'Regulatory',
          source: 'Government'
        },
        {
          id: '3',
          title: 'Supply Chain Disruption',
          description: 'Key supplier experiencing delays due to port issues',
          impact_level: 'medium',
          date_identified: new Date(Date.now() - 172800000).toISOString(),
          category: 'Supply Chain',
          source: 'Supplier Network'
        }
      ];
      
      setMarketChanges(mockData);
    } catch (error) {
      console.error('Error fetching market changes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <WidgetWrapper {...props}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-5 w-16" />
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
          <h3 className="text-sm font-medium">Recent Market Changes</h3>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {marketChanges.slice(0, 3).map((change) => (
            <div key={change.id} className="border-l-2 border-gray-200 pl-3 space-y-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getImpactIcon(change.impact_level)}
                  <span className="text-sm font-medium">{change.title}</span>
                </div>
                <Badge variant={getImpactColor(change.impact_level) as any} className="text-xs">
                  {change.impact_level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{change.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {new Date(change.date_identified).toLocaleDateString()}
                </span>
                {change.category && (
                  <span className="text-xs text-muted-foreground">{change.category}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {marketChanges.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No recent market changes detected
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
};

export default MarketChangesWidget;
