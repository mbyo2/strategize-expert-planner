import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  fetchPlanningInitiatives, 
  createPlanningInitiative, 
  updatePlanningInitiative, 
  deletePlanningInitiative 
} from '@/services/planningInitiativesService';
import { DatabaseService } from '@/services/databaseService';

vi.mock('@/services/databaseService');

describe('planningInitiativesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPlanningInitiatives', () => {
    it('should fetch planning initiatives successfully', async () => {
      const mockInitiatives = [
        {
          id: '1',
          name: 'Test Initiative',
          status: 'planning' as const,
          progress: 30,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      vi.mocked(DatabaseService.fetchData).mockResolvedValue({
        data: mockInitiatives,
        error: null,
        count: 1
      });

      const result = await fetchPlanningInitiatives();

      expect(result).toEqual(mockInitiatives);
      expect(DatabaseService.fetchData).toHaveBeenCalledWith('planning_initiatives');
    });

    it('should return empty array on error', async () => {
      vi.mocked(DatabaseService.fetchData).mockRejectedValue(new Error('Database error'));

      const result = await fetchPlanningInitiatives();

      expect(result).toEqual([]);
    });
  });

  describe('createPlanningInitiative', () => {
    it('should create planning initiative with validation', async () => {
      const newInitiative = {
        name: 'New Initiative',
        description: 'Test description',
        status: 'planning' as const,
        progress: 0
      };

      const createdInitiative = {
        ...newInitiative,
        id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      vi.mocked(DatabaseService.createRecord).mockResolvedValue({
        data: createdInitiative,
        error: null
      });

      const result = await createPlanningInitiative(newInitiative);

      expect(result).toEqual(createdInitiative);
      expect(DatabaseService.createRecord).toHaveBeenCalled();
    });

    it('should validate priority field', async () => {
      const invalidInitiative = {
        name: 'Test',
        status: 'planning' as const,
        progress: 0,
        priority: 'invalid-priority' as any // Invalid priority
      };

      await expect(createPlanningInitiative(invalidInitiative)).rejects.toThrow();
    });
  });

  describe('updatePlanningInitiative', () => {
    it('should update planning initiative with validation', async () => {
      const updates = { progress: 60, status: 'in-progress' as const };
      const updatedInitiative = {
        id: '1',
        name: 'Test Initiative',
        status: 'in-progress' as const,
        progress: 60,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      vi.mocked(DatabaseService.updateRecord).mockResolvedValue({
        data: updatedInitiative,
        error: null
      });

      const result = await updatePlanningInitiative('1', updates);

      expect(result).toEqual(updatedInitiative);
      expect(DatabaseService.updateRecord).toHaveBeenCalledWith('planning_initiatives', '1', expect.any(Object));
    });
  });

  describe('deletePlanningInitiative', () => {
    it('should delete planning initiative successfully', async () => {
      vi.mocked(DatabaseService.deleteRecord).mockResolvedValue({
        success: true
      });

      const result = await deletePlanningInitiative('1');

      expect(result).toBe(true);
      expect(DatabaseService.deleteRecord).toHaveBeenCalledWith('planning_initiatives', '1');
    });
  });
});
