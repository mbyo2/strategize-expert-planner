
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: string;
  created_at: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  category?: string;
}

export const fetchRecommendations = async (): Promise<Recommendation[]> => {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }

    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      status: item.status as Recommendation['status']
    }));
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    toast.error('Failed to load recommendations');
    return [];
  }
};

export const fetchTopRecommendations = async (limit: number = 3): Promise<Recommendation[]> => {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top recommendations:', error);
      throw error;
    }

    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      status: item.status as Recommendation['status']
    }));
  } catch (error) {
    console.error('Failed to fetch top recommendations:', error);
    toast.error('Failed to load recommendations');
    return [];
  }
};
