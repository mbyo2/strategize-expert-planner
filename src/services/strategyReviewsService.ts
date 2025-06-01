
import { DatabaseService } from './databaseService';

export interface StrategyReview {
  id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  duration_minutes?: number;
  created_at: string;
}

export const fetchUpcomingStrategyReviews = async (limit: number = 10): Promise<StrategyReview[]> => {
  try {
    const result = await DatabaseService.fetchData<StrategyReview>(
      'strategy_reviews',
      { limit, sortBy: 'scheduled_date', sortOrder: 'asc' },
      { status: 'scheduled' }
    );
    return result.data || [];
  } catch (error) {
    console.error('Error fetching upcoming strategy reviews:', error);
    return [];
  }
};

export const fetchAllStrategyReviews = async (): Promise<StrategyReview[]> => {
  try {
    const result = await DatabaseService.fetchData<StrategyReview>(
      'strategy_reviews',
      { sortBy: 'scheduled_date', sortOrder: 'desc' }
    );
    return result.data || [];
  } catch (error) {
    console.error('Error fetching strategy reviews:', error);
    return [];
  }
};

export const createStrategyReview = async (review: Omit<StrategyReview, 'id' | 'created_at'>): Promise<StrategyReview | null> => {
  try {
    const result = await DatabaseService.createRecord<StrategyReview>('strategy_reviews', review);
    return result.data;
  } catch (error) {
    console.error('Error creating strategy review:', error);
    return null;
  }
};

export const updateStrategyReview = async (id: string, updates: Partial<StrategyReview>): Promise<StrategyReview | null> => {
  try {
    const result = await DatabaseService.updateRecord<StrategyReview>('strategy_reviews', id, updates);
    return result.data;
  } catch (error) {
    console.error('Error updating strategy review:', error);
    return null;
  }
};
