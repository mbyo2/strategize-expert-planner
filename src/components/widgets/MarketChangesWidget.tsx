
import React from 'react';
import { WidgetProps } from './WidgetTypes';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import WidgetWrapper from './WidgetWrapper';

const MarketChangesWidget: React.FC<WidgetProps> = (props) => {
  const isMobile = window.innerWidth < 640;
  
  return (
    <WidgetWrapper {...props}>
      <h3 className="text-base sm:text-lg font-medium mb-2">Recent Market Changes</h3>
      <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
        <li className="flex items-start">
          <span className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-2"></span>
          <span>Competitor XYZ launched new product line targeting small business segment</span>
        </li>
        <li className="flex items-start">
          <span className="h-2 w-2 rounded-full bg-yellow-500 mt-2 mr-2"></span>
          <span>Regulatory changes affecting industry standards expected in Q1 2023</span>
        </li>
        <li className="flex items-start">
          <span className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
          <span>Market growth in APAC region exceeding forecasts by 12%</span>
        </li>
      </ul>
      
      <Button variant="ghost" size={isMobile ? "sm" : "default"} className="mt-3 sm:mt-4 text-primary hover:text-primary/80">
        View all updates <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </WidgetWrapper>
  );
};

export default MarketChangesWidget;
