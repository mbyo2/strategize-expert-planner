
import React, { useState, useEffect } from 'react';
import { WidgetProps } from './WidgetTypes';
import WidgetWrapper from './WidgetWrapper';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const TeamAlignmentWidget: React.FC<WidgetProps> = (props) => {
  const [alignmentScore, setAlignmentScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching team alignment data
    const fetchTeamAlignment = async () => {
      try {
        setLoading(true);
        // This would normally be an API call to get actual data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAlignmentScore(87);
      } catch (error) {
        console.error('Error fetching team alignment data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamAlignment();
  }, []);

  if (loading) {
    return (
      <WidgetWrapper {...props}>
        <div>
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-60 mt-2" />
        </div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper {...props}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Strategy awareness score</span>
          <span className="font-bold">{alignmentScore}%</span>
        </div>
        <Progress value={alignmentScore || 0} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">All team members completed quarterly strategy alignment survey</p>
      </div>
    </WidgetWrapper>
  );
};

export default TeamAlignmentWidget;
