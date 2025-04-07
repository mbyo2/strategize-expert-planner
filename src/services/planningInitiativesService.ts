
import { toast } from "sonner";
import { customSupabase } from "@/integrations/supabase/customClient";
import { PlanningInitiative } from "@/types/database";

export const fetchPlanningInitiatives = async (): Promise<PlanningInitiative[]> => {
  try {
    const { data, error } = await customSupabase
      .from('planning_initiatives')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching planning initiatives:', error);
      throw error;
    }

    // Cast the data to the correct type
    return (data || []).map(item => ({
      ...item,
      status: item.status as PlanningInitiative['status']
    }));
  } catch (error) {
    console.error('Failed to fetch planning initiatives:', error);
    toast.error('Failed to load planning initiatives');
    return [];
  }
};

export const createPlanningInitiative = async (initiative: Omit<PlanningInitiative, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await customSupabase
      .from('planning_initiatives')
      .insert([initiative])
      .select()
      .single();

    if (error) {
      console.error('Error creating planning initiative:', error);
      throw error;
    }

    toast.success('Planning initiative created successfully');
    
    // Cast the data to the correct type
    return {
      ...data,
      status: data.status as PlanningInitiative['status']
    };
  } catch (error) {
    console.error('Failed to create planning initiative:', error);
    toast.error('Failed to create planning initiative');
    throw error;
  }
};

export const updatePlanningInitiative = async (id: string, updates: Partial<PlanningInitiative>) => {
  try {
    const { data, error } = await customSupabase
      .from('planning_initiatives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating planning initiative:', error);
      throw error;
    }

    toast.success('Planning initiative updated successfully');
    
    // Cast the data to the correct type
    return {
      ...data,
      status: data.status as PlanningInitiative['status']
    };
  } catch (error) {
    console.error('Failed to update planning initiative:', error);
    toast.error('Failed to update planning initiative');
    throw error;
  }
};

export const deletePlanningInitiative = async (id: string) => {
  try {
    const { error } = await customSupabase
      .from('planning_initiatives')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting planning initiative:', error);
      throw error;
    }

    toast.success('Planning initiative deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete planning initiative:', error);
    toast.error('Failed to delete planning initiative');
    throw error;
  }
};
