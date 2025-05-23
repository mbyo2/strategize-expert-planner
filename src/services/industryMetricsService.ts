
import { toast } from "sonner";
import { customSupabase } from "@/integrations/supabase/customClient";

export interface IndustryMetric {
  id: string;
  name: string;
  value: number;
  previous_value?: number;
  change_percentage?: number;
  trend?: 'up' | 'down' | 'neutral';
  category: string;
  updated_at: string;
  source?: string;
}

export const fetchIndustryMetrics = async (): Promise<IndustryMetric[]> => {
  try {
    const { data, error } = await customSupabase
      .from('industry_metrics')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching industry metrics:', error);
      throw error;
    }

    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      trend: item.trend as IndustryMetric['trend']
    }));
  } catch (error) {
    console.error('Failed to fetch industry metrics:', error);
    toast.error('Failed to load industry metrics');
    return [];
  }
};

export const fetchIndustryMetricsByCategory = async (category: string): Promise<IndustryMetric[]> => {
  try {
    const { data, error } = await customSupabase
      .from('industry_metrics')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) {
      console.error(`Error fetching industry metrics for category ${category}:`, error);
      throw error;
    }

    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      trend: item.trend as IndustryMetric['trend']
    }));
  } catch (error) {
    console.error(`Failed to fetch industry metrics for category ${category}:`, error);
    toast.error('Failed to load industry metrics');
    return [];
  }
};
