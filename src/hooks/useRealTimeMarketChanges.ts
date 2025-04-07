
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { MarketChange, fetchMarketChanges } from '@/services/marketChangesService';

export const useRealTimeMarketChanges = () => {
  const [marketChanges, setMarketChanges] = useState<MarketChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial fetch
    const loadMarketChanges = async () => {
      try {
        setLoading(true);
        const data = await fetchMarketChanges();
        setMarketChanges(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch market changes'));
      } finally {
        setLoading(false);
      }
    };

    loadMarketChanges();

    // Set up real-time subscription
    const channel = supabase
      .channel('market-changes-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'market_changes' 
        },
        async (payload) => {
          console.log('Market changes detected:', payload);
          // Reload all market changes when any change is detected
          const updatedChanges = await fetchMarketChanges();
          setMarketChanges(updatedChanges);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { marketChanges, loading, error };
};
