
import { DatabaseService } from './databaseService';

export interface StrategicGoal {
  id: string;
  name: string;
  description?: string;
  status: 'planned' | 'active' | 'completed' | 'paused';
  progress: number;
  target_value?: number;
  current_value?: number;
  start_date?: string;
  due_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const fetchStrategicGoals = async (): Promise<StrategicGoal[]> => {
  try {
    const result = await DatabaseService.fetchData<StrategicGoal>('strategic_goals');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching strategic goals:', error);
    return [];
  }
};

export const createStrategicGoal = async (goal: Omit<StrategicGoal, 'id' | 'created_at' | 'updated_at'>): Promise<StrategicGoal | null> => {
  try {
    const result = await DatabaseService.createRecord<StrategicGoal>('strategic_goals', goal);
    return result.data;
  } catch (error) {
    console.error('Error creating strategic goal:', error);
    return null;
  }
};

export const updateStrategicGoal = async (id: string, updates: Partial<StrategicGoal>): Promise<StrategicGoal | null> => {
  try {
    const result = await DatabaseService.updateRecord<StrategicGoal>('strategic_goals', id, updates);
    return result.data;
  } catch (error) {
    console.error('Error updating strategic goal:', error);
    return null;
  }
};

export const deleteStrategicGoal = async (id: string): Promise<boolean> => {
  try {
    const result = await DatabaseService.deleteRecord('strategic_goals', id);
    return result.success;
  } catch (error) {
    console.error('Error deleting strategic goal:', error);
    return false;
  }
};
