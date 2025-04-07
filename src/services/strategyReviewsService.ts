
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StrategyReview {
  id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  duration_minutes?: number;
  created_at: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export const fetchStrategyReviews = async () => {
  try {
    const { data, error } = await supabase
      .from('strategy_reviews')
      .select('*')
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching strategy reviews:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch strategy reviews:', error);
    toast.error('Failed to load strategy reviews');
    return [];
  }
};

export const fetchUpcomingStrategyReviews = async (limit: number = 1) => {
  try {
    const { data, error } = await supabase
      .from('strategy_reviews')
      .select('*')
      .eq('status', 'scheduled')
      .order('scheduled_date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming strategy reviews:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch upcoming strategy reviews:', error);
    toast.error('Failed to load strategy reviews');
    return [];
  }
};
