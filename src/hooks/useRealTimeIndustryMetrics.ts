
import { useState, useEffect } from 'react';
import { IndustryMetric, fetchIndustryMetrics } from '@/services/industryMetricsService';
import { customSupabase } from "@/integrations/supabase/customClient";

export const useRealTimeIndustryMetrics = () => {
  const [metrics, setMetrics] = useState<IndustryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial fetch
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await fetchIndustryMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch industry metrics'));
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();

    // Set up real-time subscription
    const channel = customSupabase
      .channel('industry-metrics-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'industry_metrics' 
        },
        async (payload) => {
          console.log('Industry metrics change detected:', payload);
          // Reload all metrics when any change is detected
          const updatedMetrics = await fetchIndustryMetrics();
          setMetrics(updatedMetrics);
        }
      )
      .subscribe();

    return () => {
      customSupabase.removeChannel(channel);
    };
  }, []);

  return { metrics, loading, error };
};
