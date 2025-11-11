import { DatabaseService } from './databaseService';
import { strategicGoalSchemas } from './validation/validatedServiceWrapper';
import { validateForInsert, validateForUpdate } from './validation/validatedService';

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
    // Validate and sanitize input
    const validatedGoal = await validateForInsert(strategicGoalSchemas.create, goal);
    const result = await DatabaseService.createRecord<StrategicGoal>('strategic_goals', validatedGoal as any);
    return result.data;
  } catch (error) {
    console.error('Error creating strategic goal:', error);
    return null;
  }
};

export const updateStrategicGoal = async (id: string, updates: Partial<StrategicGoal>): Promise<StrategicGoal | null> => {
  try {
    // Validate and sanitize input
    const validatedUpdates = await validateForUpdate(strategicGoalSchemas.update, updates);
    const result = await DatabaseService.updateRecord<StrategicGoal>('strategic_goals', id, validatedUpdates as any);
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
