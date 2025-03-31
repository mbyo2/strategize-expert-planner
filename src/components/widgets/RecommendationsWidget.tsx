
import React from 'react';
import { WidgetProps } from './WidgetTypes';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import WidgetWrapper from './WidgetWrapper';

const RecommendationsWidget: React.FC<WidgetProps> = (props) => {
  const isMobile = window.innerWidth < 640;
  
  return (
    <WidgetWrapper {...props}>
      <h3 className="text-base sm:text-lg font-medium mb-2">Strategic Recommendations</h3>
      <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
        <li className="flex items-start">
          <span className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs mr-2">1</span>
          <span>Increase R&D investment in AI technologies to maintain competitive edge</span>
        </li>
        <li className="flex items-start">
          <span className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs mr-2">2</span>
          <span>Expand distribution channels in emerging markets to capture growth</span>
        </li>
        <li className="flex items-start">
          <span className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs mr-2">3</span>
          <span>Develop strategic partnerships with complementary service providers</span>
        </li>
      </ul>
      
      <Button variant="ghost" size={isMobile ? "sm" : "default"} className="mt-3 sm:mt-4 text-primary hover:text-primary/80">
        See all recommendations <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </WidgetWrapper>
  );
};

export default RecommendationsWidget;
