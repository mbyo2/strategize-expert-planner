
import { DatabaseService } from './databaseService';

export interface IndustryMetric {
  id: string;
  name: string;
  value: number;
  previous_value?: number;
  change_percentage?: number;
  trend?: 'up' | 'down' | 'neutral';
  category: string;
  source?: string;
  updated_at: string;
}

export const fetchIndustryMetrics = async (): Promise<IndustryMetric[]> => {
  try {
    const result = await DatabaseService.fetchData<IndustryMetric>('industry_metrics');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching industry metrics:', error);
    return [];
  }
};

export const createIndustryMetric = async (metric: Omit<IndustryMetric, 'id' | 'updated_at'>): Promise<IndustryMetric | null> => {
  try {
    const result = await DatabaseService.createRecord<IndustryMetric>('industry_metrics', metric);
    return result.data;
  } catch (error) {
    console.error('Error creating industry metric:', error);
    return null;
  }
};

export const updateIndustryMetric = async (id: string, updates: Partial<IndustryMetric>): Promise<IndustryMetric | null> => {
  try {
    const result = await DatabaseService.updateRecord<IndustryMetric>('industry_metrics', id, updates);
    return result.data;
  } catch (error) {
    console.error('Error updating industry metric:', error);
    return null;
  }
};
