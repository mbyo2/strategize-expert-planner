
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: number;
  created_at: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  category?: string;
}

export const fetchRecommendations = async () => {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    toast.error('Failed to load recommendations');
    return [];
  }
};

export const fetchTopRecommendations = async (limit: number = 3) => {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .order('priority', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching top recommendations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch top recommendations:', error);
    toast.error('Failed to load recommendations');
    return [];
  }
};
