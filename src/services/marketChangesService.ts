
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MarketChange {
  id: string;
  title: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high' | 'positive';
  date_identified: string;
  source?: string;
  category?: string;
}

export const fetchMarketChanges = async () => {
  try {
    const { data, error } = await supabase
      .from('market_changes')
      .select('*')
      .order('date_identified', { ascending: false });

    if (error) {
      console.error('Error fetching market changes:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch market changes:', error);
    toast.error('Failed to load market changes');
    return [];
  }
};

export const fetchRecentMarketChanges = async (limit: number = 3) => {
  try {
    const { data, error } = await supabase
      .from('market_changes')
      .select('*')
      .order('date_identified', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent market changes:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch recent market changes:', error);
    toast.error('Failed to load market changes');
    return [];
  }
};
