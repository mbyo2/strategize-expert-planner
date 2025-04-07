
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CompanyStrategy {
  id: string;
  vision?: string;
  mission?: string;
  updated_at: string;
  updated_by?: string;
}

export const fetchCompanyStrategy = async () => {
  try {
    const { data, error } = await supabase
      .from('company_strategy')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching company strategy:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch company strategy:', error);
    toast.error('Failed to load company strategy');
    return null;
  }
};

export const updateCompanyStrategy = async (updates: { vision?: string; mission?: string }, userId: string) => {
  try {
    const existingStrategy = await fetchCompanyStrategy();
    
    if (existingStrategy) {
      // Update existing record
      const { data, error } = await supabase
        .from('company_strategy')
        .update({ ...updates, updated_by: userId })
        .eq('id', existingStrategy.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating company strategy:', error);
        throw error;
      }

      toast.success('Company strategy updated successfully');
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('company_strategy')
        .insert([{ ...updates, updated_by: userId }])
        .select()
        .single();

      if (error) {
        console.error('Error creating company strategy:', error);
        throw error;
      }

      toast.success('Company strategy created successfully');
      return data;
    }
  } catch (error) {
    console.error('Failed to update company strategy:', error);
    toast.error('Failed to update company strategy');
    throw error;
  }
};
