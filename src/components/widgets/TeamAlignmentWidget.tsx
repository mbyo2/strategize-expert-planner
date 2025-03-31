
import React from 'react';
import { WidgetProps } from './WidgetTypes';
import WidgetWrapper from './WidgetWrapper';
import { Progress } from '@/components/ui/progress';

const TeamAlignmentWidget: React.FC<WidgetProps> = (props) => {
  return (
    <WidgetWrapper {...props}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Strategy awareness score</span>
          <span className="font-bold">87%</span>
        </div>
        <Progress value={87} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">All team members completed quarterly strategy alignment survey</p>
      </div>
    </WidgetWrapper>
  );
};

export default TeamAlignmentWidget;
