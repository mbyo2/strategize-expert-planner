
import { DatabaseService } from './databaseService';

export interface CompanyStrategy {
  id: string;
  vision?: string;
  mission?: string;
  updated_at: string;
  updated_by?: string;
}

export const fetchCompanyStrategy = async (): Promise<CompanyStrategy | null> => {
  try {
    const result = await DatabaseService.fetchData<CompanyStrategy>('company_strategy');
    return result.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching company strategy:', error);
    return null;
  }
};

export const updateCompanyStrategy = async (
  strategy: Partial<CompanyStrategy>,
  userId: string
): Promise<CompanyStrategy> => {
  try {
    // First try to get existing strategy
    const existing = await fetchCompanyStrategy();
    
    if (existing) {
      // Update existing strategy
      const result = await DatabaseService.updateRecord<CompanyStrategy>(
        'company_strategy',
        existing.id,
        { ...strategy, updated_by: userId }
      );
      if (!result.data) {
        throw new Error(result.error || 'Failed to update company strategy');
      }
      return result.data;
    } else {
      // Create new strategy
      const result = await DatabaseService.createRecord<CompanyStrategy>(
        'company_strategy',
        { ...strategy, updated_by: userId }
      );
      if (!result.data) {
        throw new Error(result.error || 'Failed to create company strategy');
      }
      return result.data;
    }
  } catch (error) {
    console.error('Error updating company strategy:', error);
    throw error;
  }
};
