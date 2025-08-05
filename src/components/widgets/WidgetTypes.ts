
export type WidgetType = 
  | 'strategic-goals'
  | 'industry-metrics'
  | 'market-changes'
  | 'recommendations'
  | 'team-alignment'
  | 'upcoming-reviews'
  | 'erp-integration';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
}

export interface WidgetProps {
  widget: Widget;
  onRemove: (id: string) => void;
  onResize: (id: string, size: 'small' | 'medium' | 'large') => void;
}

export const WIDGET_TEMPLATES: Record<WidgetType, Omit<Widget, 'id' | 'position'>> = {
  'strategic-goals': {
    type: 'strategic-goals',
    title: 'Strategic Goals',
    size: 'medium'
  },
  'industry-metrics': {
    type: 'industry-metrics',
    title: 'Industry Metrics',
    size: 'large'
  },
  'market-changes': {
    type: 'market-changes',
    title: 'Market Changes',
    size: 'medium'
  },
  'recommendations': {
    type: 'recommendations',
    title: 'Strategic Recommendations',
    size: 'medium'
  },
  'team-alignment': {
    type: 'team-alignment',
    title: 'Team Alignment',
    size: 'small'
  },
  'upcoming-reviews': {
    type: 'upcoming-reviews',
    title: 'Upcoming Reviews',
    size: 'small'
  },
  'erp-integration': {
    type: 'erp-integration',
    title: 'ERP Integration',
    size: 'medium'
  }
};
