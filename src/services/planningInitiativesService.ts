
import { DatabaseService } from './databaseService';

export interface PlanningInitiative {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  progress: number;
  start_date?: string;
  end_date?: string;
  owner_id?: string;
  created_at: string;
  updated_at: string;
}

export const fetchPlanningInitiatives = async (): Promise<PlanningInitiative[]> => {
  try {
    const result = await DatabaseService.fetchData<PlanningInitiative>('planning_initiatives');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching planning initiatives:', error);
    return [];
  }
};

export const createPlanningInitiative = async (
  initiative: Omit<PlanningInitiative, 'id' | 'created_at' | 'updated_at'>
): Promise<PlanningInitiative> => {
  try {
    const result = await DatabaseService.createRecord<PlanningInitiative>('planning_initiatives', initiative);
    if (!result.data) {
      throw new Error(result.error || 'Failed to create planning initiative');
    }
    return result.data;
  } catch (error) {
    console.error('Error creating planning initiative:', error);
    throw error;
  }
};

export const updatePlanningInitiative = async (
  id: string,
  updates: Partial<PlanningInitiative>
): Promise<PlanningInitiative> => {
  try {
    const result = await DatabaseService.updateRecord<PlanningInitiative>('planning_initiatives', id, updates);
    if (!result.data) {
      throw new Error(result.error || 'Failed to update planning initiative');
    }
    return result.data;
  } catch (error) {
    console.error('Error updating planning initiative:', error);
    throw error;
  }
};

export const deletePlanningInitiative = async (id: string): Promise<boolean> => {
  try {
    const result = await DatabaseService.deleteRecord('planning_initiatives', id);
    return result.success;
  } catch (error) {
    console.error('Error deleting planning initiative:', error);
    return false;
  }
};
