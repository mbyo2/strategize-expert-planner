
import { toast } from "sonner";
import { customSupabase } from "@/integrations/supabase/customClient";
import { StrategyReview } from "@/types/database";

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

export const fetchUpcomingStrategyReview = async (): Promise<StrategyReview | null> => {
  try {
    const { data, error } = await customSupabase
      .from('strategy_reviews')
      .select('*')
      .eq('status', 'scheduled')
      .order('scheduled_date', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No upcoming reviews found
        return null;
      }
      console.error('Error fetching upcoming strategy review:', error);
      throw error;
    }

    // Cast the data to the correct type
    return {
      ...data,
      status: data.status as StrategyReview['status']
    };
  } catch (error) {
    console.error('Failed to fetch upcoming strategy review:', error);
    toast.error('Failed to load upcoming strategy review');
    return null;
  }
};
