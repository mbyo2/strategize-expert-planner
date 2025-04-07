
import { toast } from "sonner";
import { customSupabase } from "@/integrations/supabase/customClient";
import { StrategyReview } from "@/types/database";

// Type export using 'export type' to fix the TS1205 error
export type { StrategyReview };

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

export const fetchUpcomingStrategyReviews = async (limit: number = 3): Promise<StrategyReview[]> => {
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
    toast.error('Failed to load upcoming strategy reviews');
    return [];
  }
};

// CRUD operations for strategy reviews
export const createStrategyReview = async (review: Omit<StrategyReview, 'id' | 'created_at'>): Promise<StrategyReview | null> => {
  try {
    const { data, error } = await customSupabase
      .from('strategy_reviews')
      .insert(review)
      .select()
      .single();

    if (error) {
      console.error('Error creating strategy review:', error);
      toast.error('Failed to create strategy review');
      throw error;
    }

    toast.success('Strategy review created successfully');
    return data as StrategyReview;
  } catch (error) {
    console.error('Failed to create strategy review:', error);
    return null;
  }
};

export const updateStrategyReview = async (id: string, updates: Partial<StrategyReview>): Promise<StrategyReview | null> => {
  try {
    const { data, error } = await customSupabase
      .from('strategy_reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating strategy review:', error);
      toast.error('Failed to update strategy review');
      throw error;
    }

    toast.success('Strategy review updated successfully');
    return data as StrategyReview;
  } catch (error) {
    console.error('Failed to update strategy review:', error);
    return null;
  }
};

export const deleteStrategyReview = async (id: string): Promise<boolean> => {
  try {
    const { error } = await customSupabase
      .from('strategy_reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting strategy review:', error);
      toast.error('Failed to delete strategy review');
      throw error;
    }

    toast.success('Strategy review deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete strategy review:', error);
    return false;
  }
};

// Filter reviews by date range
export const fetchStrategyReviewsByDateRange = async (startDate: Date, endDate: Date): Promise<StrategyReview[]> => {
  try {
    const { data, error } = await customSupabase
      .from('strategy_reviews')
      .select('*')
      .gte('scheduled_date', startDate.toISOString())
      .lte('scheduled_date', endDate.toISOString())
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching strategy reviews by date range:', error);
      throw error;
    }

    return (data || []).map(item => ({
      ...item,
      status: item.status as StrategyReview['status']
    }));
  } catch (error) {
    console.error('Failed to fetch strategy reviews by date range:', error);
    toast.error('Failed to load strategy reviews');
    return [];
  }
};

// Filter reviews by status
export const fetchStrategyReviewsByStatus = async (status: StrategyReview['status']): Promise<StrategyReview[]> => {
  try {
    const { data, error } = await customSupabase
      .from('strategy_reviews')
      .select('*')
      .eq('status', status)
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching strategy reviews by status:', error);
      throw error;
    }

    return (data || []).map(item => ({
      ...item,
      status: item.status as StrategyReview['status']
    }));
  } catch (error) {
    console.error('Failed to fetch strategy reviews by status:', error);
    toast.error('Failed to load strategy reviews');
    return [];
  }
};
