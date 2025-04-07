
import { toast } from "sonner";
import { customSupabase } from "@/integrations/supabase/customClient";

export interface MarketChange {
  id: string;
  title: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high' | 'positive';
  date_identified: string;
  source?: string;
  category?: string;
}

export const fetchMarketChanges = async (): Promise<MarketChange[]> => {
  try {
    const { data, error } = await customSupabase
      .from('market_changes')
      .select('*')
      .order('date_identified', { ascending: false });

    if (error) {
      console.error('Error fetching market changes:', error);
      throw error;
    }

    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      impact_level: item.impact_level as MarketChange['impact_level']
    }));
  } catch (error) {
    console.error('Failed to fetch market changes:', error);
    toast.error('Failed to load market changes');
    return [];
  }
};

export const fetchRecentMarketChanges = async (limit: number = 3): Promise<MarketChange[]> => {
  try {
    const { data, error } = await customSupabase
      .from('market_changes')
      .select('*')
      .order('date_identified', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent market changes:', error);
      throw error;
    }

    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      impact_level: item.impact_level as MarketChange['impact_level']
    }));
  } catch (error) {
    console.error('Failed to fetch recent market changes:', error);
    toast.error('Failed to load market changes');
    return [];
  }
};
