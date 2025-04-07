
import { toast } from "sonner";
import { customSupabase } from "@/integrations/supabase/customClient";

export interface StrategicGoal {
  id: string;
  name: string;
  description?: string;
  progress: number;
  status: string;
  start_date?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  target_value?: number;
  current_value?: number;
}

export const fetchStrategicGoals = async (): Promise<StrategicGoal[]> => {
  try {
    const { data, error } = await customSupabase
      .from('strategic_goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching strategic goals:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch strategic goals:', error);
    toast.error('Failed to load strategic goals');
    return [];
  }
};

export const createStrategicGoal = async (goal: Omit<StrategicGoal, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await customSupabase
      .from('strategic_goals')
      .insert([goal])
      .select()
      .single();

    if (error) {
      console.error('Error creating strategic goal:', error);
      throw error;
    }

    toast.success('Strategic goal created successfully');
    return data;
  } catch (error) {
    console.error('Failed to create strategic goal:', error);
    toast.error('Failed to create strategic goal');
    throw error;
  }
};

export const updateStrategicGoal = async (id: string, updates: Partial<StrategicGoal>) => {
  try {
    const { data, error } = await customSupabase
      .from('strategic_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating strategic goal:', error);
      throw error;
    }

    toast.success('Strategic goal updated successfully');
    return data;
  } catch (error) {
    console.error('Failed to update strategic goal:', error);
    toast.error('Failed to update strategic goal');
    throw error;
  }
};

export const deleteStrategicGoal = async (id: string) => {
  try {
    const { error } = await customSupabase
      .from('strategic_goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting strategic goal:', error);
      throw error;
    }

    toast.success('Strategic goal deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete strategic goal:', error);
    toast.error('Failed to delete strategic goal');
    throw error;
  }
};
