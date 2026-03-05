import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface IndustryMetric {
  id: string;
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
  id: string;
  name: string;
  description: string | null;
  market_share: number;
  change_percentage: number;
  strengths: string[];
  threats: string[];
  website: string | null;
  industry: string | null;
}

async function fetchIndustryData() {
  const [metricsRes, changesRes, competitorsRes] = await Promise.all([
    supabase.from('industry_metrics').select('*').order('updated_at', { ascending: false }),
    supabase.from('market_changes').select('*').order('date_identified', { ascending: false }),
    supabase.from('competitors').select('*').order('market_share', { ascending: false }),
  ]);

  const formattedMetrics: IndustryMetric[] = (metricsRes.data || []).map(m => ({
    id: m.id,
    name: m.name,
    value: m.value ?? 0,
    previous_value: m.previous_value ?? undefined,
    trend: (m.value ?? 0) >= (m.previous_value ?? 0) ? 'up' as const : 'down' as const,
    category: m.category || 'General',
    source: m.source || 'Internal',
  }));

  const formattedChanges: MarketChange[] = (changesRes.data || []).map(c => ({
    id: c.id,
    title: c.title,
    description: c.description || '',
    impact: (c.impact_level || 'medium') as 'high' | 'medium' | 'low',
    category: c.category || 'General',
    dateIdentified: c.date_identified,
    source: c.source || 'Internal',
  }));

  const formattedCompetitors: Competitor[] = (competitorsRes.data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    market_share: c.market_share ?? 0,
    change_percentage: c.change_percentage ?? 0,
    strengths: c.strengths || [],
    threats: c.threats || [],
    website: c.website,
    industry: c.industry,
  }));

  return { metrics: formattedMetrics, marketChanges: formattedChanges, competitors: formattedCompetitors };
}

export const useIndustryMetrics = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['industry-metrics'],
    queryFn: fetchIndustryData,
  });

  return {
    metrics: data?.metrics || [],
    marketChanges: data?.marketChanges || [],
    competitors: data?.competitors || [],
    isLoading,
    error,
    refetch,
  };
};
