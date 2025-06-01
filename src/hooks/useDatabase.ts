
import { useState, useEffect, useCallback } from 'react';
import { DatabaseService, DatabaseRecord, PaginationOptions, FilterOptions } from '@/services/databaseService';

export interface UseDatabaseResult<T extends DatabaseRecord> {
  data: T[];
  loading: boolean;
  error: string | null;
  count: number;
  refresh: () => Promise<void>;
  create: (record: Omit<T, 'id' | 'created_at' | 'updated_at'>) => Promise<T | null>;
  update: (id: string, record: Partial<Omit<T, 'id' | 'created_at'>>) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
  search: (term: string) => Promise<void>;
}

export function useDatabase<T extends DatabaseRecord>(
  tableName: string,
  initialOptions: PaginationOptions = {},
  initialFilters: FilterOptions = {},
  enableRealTime: boolean = true
): UseDatabaseResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState<PaginationOptions>(initialOptions);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  // Fetch data function
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await DatabaseService.fetchData<T>(tableName, options, filters);
      
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
        setCount(result.count);
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error in useDatabase fetchData:', err);
    } finally {
      setLoading(false);
    }
  }, [tableName, options, filters]);

  // Create record
  const create = useCallback(async (record: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T | null> => {
    const result = await DatabaseService.createRecord<T>(tableName, record);
    
    if (result.data) {
      // Refresh data to get updated list
      await fetchData();
      return result.data;
    }
    
    if (result.error) {
      setError(result.error);
    }
    
    return null;
  }, [tableName, fetchData]);

  // Update record
  const update = useCallback(async (id: string, record: Partial<Omit<T, 'id' | 'created_at'>>): Promise<T | null> => {
    const result = await DatabaseService.updateRecord<T>(tableName, id, record);
    
    if (result.data) {
      // Update local data
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...result.data } : item
      ));
      return result.data;
    }
    
    if (result.error) {
      setError(result.error);
    }
    
    return null;
  }, [tableName]);

  // Delete record
  const remove = useCallback(async (id: string): Promise<boolean> => {
    const result = await DatabaseService.deleteRecord(tableName, id);
    
    if (result.success) {
      // Remove from local data
      setData(prev => prev.filter(item => item.id !== id));
      setCount(prev => prev - 1);
      return true;
    }
    
    if (result.error) {
      setError(result.error);
    }
    
    return false;
  }, [tableName]);

  // Search function
  const search = useCallback(async (term: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await DatabaseService.searchRecords<T>(tableName, term, undefined, options);
      
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
        setCount(result.count);
      }
    } catch (err) {
      setError('Search failed');
      console.error('Error in useDatabase search:', err);
    } finally {
      setLoading(false);
    }
  }, [tableName, options]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up real-time subscription
  useEffect(() => {
    if (!enableRealTime) return;

    const unsubscribe = DatabaseService.subscribeToTable<T>(
      tableName,
      (payload) => {
        console.log(`Real-time update for ${tableName}:`, payload);
        
        // Refresh data when changes occur
        fetchData();
      }
    );

    return unsubscribe;
  }, [tableName, enableRealTime, fetchData]);

  return {
    data,
    loading,
    error,
    count,
    refresh: fetchData,
    create,
    update,
    remove,
    search
  };
}
