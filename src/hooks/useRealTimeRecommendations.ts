
import { useState, useEffect } from 'react';
import { Recommendation, fetchRecommendations } from '@/services/recommendationsService';
import { customSupabase } from "@/integrations/supabase/customClient";

export const useRealTimeRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial fetch
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const data = await fetchRecommendations();
        setRecommendations(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();

    // Set up real-time subscription
    const channel = customSupabase
      .channel('recommendations-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'recommendations' 
        },
        async (payload) => {
          console.log('Recommendations change detected:', payload);
          // Reload all recommendations when any change is detected
          const updatedRecommendations = await fetchRecommendations();
          setRecommendations(updatedRecommendations);
        }
      )
      .subscribe();

    return () => {
      customSupabase.removeChannel(channel);
    };
  }, []);

  return { recommendations, loading, error };
};
