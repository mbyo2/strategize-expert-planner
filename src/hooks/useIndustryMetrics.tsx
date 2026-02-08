import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface IndustryMetric {
  name: string;
  value: number;
  previous_value?: number;
  trend: 'up' | 'down';
  category: string;
  source: string;
}

export interface MarketChange {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  dateIdentified: string;
  source: string;
}

export interface Competitor {
  name: string;
  marketShare: number;
  changePercentage: number;
  strengths: string[];
  threats: string[];
}

async function fetchIndustryData() {
  const { data: metrics } = await supabase
    .from('industry_metrics')
    .select('*')
    .order('updated_at', { ascending: false });

  const { data: changes } = await supabase
    .from('market_changes')
    .select('*')
    .order('date_identified', { ascending: false });

  const formattedMetrics: IndustryMetric[] = (metrics || []).map(m => ({
    name: m.name,
    value: m.value ?? 0,
    previous_value: m.previous_value ?? undefined,
    trend: (m.value ?? 0) >= (m.previous_value ?? 0) ? 'up' as const : 'down' as const,
    category: m.category || 'General',
    source: m.source || 'Internal',
  }));

  const formattedChanges: MarketChange[] = (changes || []).map(c => ({
    id: c.id,
    title: c.title,
    description: c.description || '',
    impact: (c.impact_level || 'medium') as 'high' | 'medium' | 'low',
    category: c.category || 'General',
    dateIdentified: c.date_identified,
    source: c.source || 'Internal',
  }));

  return { metrics: formattedMetrics, marketChanges: formattedChanges };
}

export const useIndustryMetrics = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['industry-metrics'],
    queryFn: fetchIndustryData,
  });

  const competitors: Competitor[] = [];

  return {
    metrics: data?.metrics || [],
    marketChanges: data?.marketChanges || [],
    competitors,
    isLoading,
    error,
    refetch,
  };
};
