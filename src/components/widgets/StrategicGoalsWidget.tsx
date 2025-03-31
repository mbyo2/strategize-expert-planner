
import React from 'react';
import { WidgetProps } from './WidgetTypes';
import StrategicGoals from '../StrategicGoals';
import WidgetWrapper from './WidgetWrapper';

const StrategicGoalsWidget: React.FC<WidgetProps> = (props) => {
  return (
    <WidgetWrapper {...props}>
      <StrategicGoals />
    </WidgetWrapper>
  );
};

export default StrategicGoalsWidget;
