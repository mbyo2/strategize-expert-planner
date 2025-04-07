
import { toast } from "sonner";
import { customSupabase } from "@/integrations/supabase/customClient";

export interface StrategyReview {
  id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  duration_minutes?: number;
  created_at: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export const fetchStrategyReviews = async (): Promise<StrategyReview[]> => {
  try {
    const { data, error } = await customSupabase
      .from('strategy_reviews')
      .select('*')
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching strategy reviews:', error);
      throw error;
    }

    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      status: item.status as StrategyReview['status']
    }));
  } catch (error) {
    console.error('Failed to fetch strategy reviews:', error);
    toast.error('Failed to load strategy reviews');
    return [];
  }
};

export const fetchUpcomingStrategyReviews = async (limit: number = 1): Promise<StrategyReview[]> => {
  try {
    const { data, error } = await customSupabase
      .from('strategy_reviews')
      .select('*')
      .eq('status', 'scheduled')
      .order('scheduled_date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming strategy reviews:', error);
      throw error;
    }

    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      status: item.status as StrategyReview['status']
    }));
  } catch (error) {
    console.error('Failed to fetch upcoming strategy reviews:', error);
    toast.error('Failed to load strategy reviews');
    return [];
  }
};
