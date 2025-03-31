
import React from 'react';
import { WidgetProps } from './WidgetTypes';
import IndustryMetrics from '../IndustryMetrics';
import WidgetWrapper from './WidgetWrapper';

const IndustryMetricsWidget: React.FC<WidgetProps> = (props) => {
  return (
    <WidgetWrapper {...props}>
      <IndustryMetrics />
    </WidgetWrapper>
  );
};

export default IndustryMetricsWidget;
