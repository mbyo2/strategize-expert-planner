import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  fetchStrategicGoals, 
  createStrategicGoal, 
  updateStrategicGoal, 
  deleteStrategicGoal 
} from '@/services/strategicGoalsService';
import { DatabaseService } from '@/services/databaseService';

vi.mock('@/services/databaseService');

describe('strategicGoalsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchStrategicGoals', () => {
    it('should fetch strategic goals successfully', async () => {
      const mockGoals = [
        {
          id: '1',
          name: 'Test Goal',
          status: 'active' as const,
          progress: 50,
          user_id: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      vi.mocked(DatabaseService.fetchData).mockResolvedValue({
        data: mockGoals,
        error: null,
        count: 1
      });

      const result = await fetchStrategicGoals();

      expect(result).toEqual(mockGoals);
      expect(DatabaseService.fetchData).toHaveBeenCalledWith('strategic_goals');
    });

    it('should return empty array on error', async () => {
      vi.mocked(DatabaseService.fetchData).mockRejectedValue(new Error('Database error'));

      const result = await fetchStrategicGoals();

      expect(result).toEqual([]);
    });
  });

  describe('createStrategicGoal', () => {
    it('should create strategic goal with validation', async () => {
      const newGoal = {
        name: 'New Goal',
        status: 'planned' as const,
        progress: 0,
        user_id: 'user-1'
      };

      const createdGoal = {
        ...newGoal,
        id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      vi.mocked(DatabaseService.createRecord).mockResolvedValue({
        data: createdGoal,
        error: null
      });

      const result = await createStrategicGoal(newGoal);

      expect(result).toEqual(createdGoal);
      expect(DatabaseService.createRecord).toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const invalidGoal = {
        name: '', // Invalid - empty name
        status: 'planned' as const,
        progress: 0,
        user_id: 'user-1'
      };

      await expect(createStrategicGoal(invalidGoal)).rejects.toThrow();
    });
  });

  describe('updateStrategicGoal', () => {
    it('should update strategic goal with validation', async () => {
      const updates = { progress: 75 };
      const updatedGoal = {
        id: '1',
        name: 'Test Goal',
        status: 'active' as const,
        progress: 75,
        user_id: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      vi.mocked(DatabaseService.updateRecord).mockResolvedValue({
        data: updatedGoal,
        error: null
      });

      const result = await updateStrategicGoal('1', updates);

      expect(result).toEqual(updatedGoal);
      expect(DatabaseService.updateRecord).toHaveBeenCalledWith('strategic_goals', '1', expect.any(Object));
    });
  });

  describe('deleteStrategicGoal', () => {
    it('should delete strategic goal successfully', async () => {
      vi.mocked(DatabaseService.deleteRecord).mockResolvedValue({
        success: true
      });

      const result = await deleteStrategicGoal('1');

      expect(result).toBe(true);
      expect(DatabaseService.deleteRecord).toHaveBeenCalledWith('strategic_goals', '1');
    });
  });
});
