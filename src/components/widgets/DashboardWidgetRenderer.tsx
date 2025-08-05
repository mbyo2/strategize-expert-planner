
import React from 'react';
import { Widget, WidgetProps } from './WidgetTypes';
import StrategicGoalsWidget from './StrategicGoalsWidget';
import IndustryMetricsWidget from './IndustryMetricsWidget';
import MarketChangesWidget from './MarketChangesWidget';
import RecommendationsWidget from './RecommendationsWidget';
import TeamAlignmentWidget from './TeamAlignmentWidget';
import UpcomingReviewsWidget from './UpcomingReviewsWidget';
import ERPIntegrationWidget from './ERPIntegrationWidget';

const DashboardWidgetRenderer: React.FC<WidgetProps> = (props) => {
  const { widget } = props;

  switch (widget.type) {
    case 'strategic-goals':
      return <StrategicGoalsWidget {...props} />;
    case 'industry-metrics':
      return <IndustryMetricsWidget {...props} />;
    case 'market-changes':
      return <MarketChangesWidget {...props} />;
    case 'recommendations':
      return <RecommendationsWidget {...props} />;
    case 'team-alignment':
      return <TeamAlignmentWidget {...props} />;
    case 'upcoming-reviews':
      return <UpcomingReviewsWidget {...props} />;
    case 'erp-integration':
      return <ERPIntegrationWidget {...props} />;
    default:
      return <div>Unknown widget type: {widget.type}</div>;
  }
};

export default DashboardWidgetRenderer;
