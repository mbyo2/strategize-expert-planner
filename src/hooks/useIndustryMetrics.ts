import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface IndustryMetric {
  id: string;
  name: string;
  category: string;
  value: number;
  previous_value?: number;
  change_percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  source?: string;
  updated_at: string;
}

export const useIndustryMetrics = () => {
  const [metrics, setMetrics] = useState<IndustryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('industry_metrics')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          throw error;
        }

        setMetrics(data?.map(item => ({
          ...item,
          trend: item.trend as 'up' | 'down' | 'stable'
        })) || []);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Set up real-time subscription
    const channel = supabase
      .channel('industry-metrics-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'industry_metrics' 
        },
        async () => {
          await fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshMetrics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('industry_metrics')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMetrics(data?.map(item => ({
        ...item,
        trend: item.trend as 'up' | 'down' | 'stable'
      })) || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    loading,
    error,
    refreshMetrics
  };
};