
import React from 'react';
import { WidgetProps } from './WidgetTypes';
import WidgetWrapper from './WidgetWrapper';
import { Calendar } from 'lucide-react';

const UpcomingReviewsWidget: React.FC<WidgetProps> = (props) => {
  return (
    <WidgetWrapper {...props}>
      <div className="space-y-3">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm font-medium">Quarterly Strategy Review</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold">Dec 15</span>
          <span className="text-xs text-muted-foreground">2:00 PM - 4:00 PM</span>
        </div>
        <span className="text-xs text-primary">On schedule</span>
      </div>
    </WidgetWrapper>
  );
};

export default UpcomingReviewsWidget;
