
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DatabaseRecord {
  id: string;
  created_at: string;
  updated_at?: string;
  [key: string]: any;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export class DatabaseService {
  
  /**
   * Generic method to fetch data with pagination and filtering
   */
  static async fetchData<T extends DatabaseRecord>(
    tableName: string,
    options: PaginationOptions = {},
    filters: FilterOptions = {}
  ): Promise<{ data: T[], count: number, error?: string }> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options;

      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string' && value.includes('%')) {
            query = query.ilike(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data as T[], count: count || 0 };
    } catch (error) {
      console.error(`Error in fetchData for ${tableName}:`, error);
      return { data: [], count: 0, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Generic method to create a new record
   */
  static async createRecord<T extends Partial<DatabaseRecord>>(
    tableName: string,
    data: T
  ): Promise<{ data: T | null, error?: string }> {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error(`Error creating ${tableName} record:`, error);
        toast.error(`Failed to create ${tableName.replace('_', ' ')}`);
        return { data: null, error: error.message };
      }

      toast.success(`${tableName.replace('_', ' ')} created successfully`);
      return { data: result as T };
    } catch (error) {
      console.error(`Error in createRecord for ${tableName}:`, error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Generic method to update a record
   */
  static async updateRecord<T extends Partial<DatabaseRecord>>(
    tableName: string,
    id: string,
    data: T
  ): Promise<{ data: T | null, error?: string }> {
    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating ${tableName} record:`, error);
        toast.error(`Failed to update ${tableName.replace('_', ' ')}`);
        return { data: null, error: error.message };
      }

      toast.success(`${tableName.replace('_', ' ')} updated successfully`);
      return { data: result as T };
    } catch (error) {
      console.error(`Error in updateRecord for ${tableName}:`, error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Generic method to delete a record
   */
  static async deleteRecord(
    tableName: string,
    id: string
  ): Promise<{ success: boolean, error?: string }> {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting ${tableName} record:`, error);
        toast.error(`Failed to delete ${tableName.replace('_', ' ')}`);
        return { success: false, error: error.message };
      }

      toast.success(`${tableName.replace('_', ' ')} deleted successfully`);
      return { success: true };
    } catch (error) {
      console.error(`Error in deleteRecord for ${tableName}:`, error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Method to get a single record by ID
   */
  static async getRecord<T extends DatabaseRecord>(
    tableName: string,
    id: string
  ): Promise<{ data: T | null, error?: string }> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error(`Error fetching ${tableName} record:`, error);
        return { data: null, error: error.message };
      }

      return { data: data as T };
    } catch (error) {
      console.error(`Error in getRecord for ${tableName}:`, error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Method to handle real-time subscriptions
   */
  static subscribeToTable<T extends DatabaseRecord>(
    tableName: string,
    callback: (payload: any) => void,
    filters?: { [key: string]: any }
  ) {
    let channel = supabase
      .channel(`${tableName}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          ...filters
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Batch operations for multiple records
   */
  static async batchCreate<T extends Partial<DatabaseRecord>>(
    tableName: string,
    records: T[]
  ): Promise<{ data: T[], error?: string }> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(records)
        .select();

      if (error) {
        console.error(`Error batch creating ${tableName} records:`, error);
        toast.error(`Failed to create multiple ${tableName.replace('_', ' ')} records`);
        return { data: [], error: error.message };
      }

      toast.success(`${records.length} ${tableName.replace('_', ' ')} records created successfully`);
      return { data: data as T[] };
    } catch (error) {
      console.error(`Error in batchCreate for ${tableName}:`, error);
      return { data: [], error: 'An unexpected error occurred' };
    }
  }

  /**
   * Search functionality with full-text search
   */
  static async searchRecords<T extends DatabaseRecord>(
    tableName: string,
    searchTerm: string,
    searchColumns: string[] = ['name', 'title', 'description'],
    options: PaginationOptions = {}
  ): Promise<{ data: T[], count: number, error?: string }> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options;

      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      // Apply search filters
      if (searchTerm) {
        const searchConditions = searchColumns
          .map(col => `${col}.ilike.%${searchTerm}%`)
          .join(',');
        query = query.or(searchConditions);
      }

      // Apply sorting and pagination
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * limit, page * limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error(`Error searching ${tableName}:`, error);
        return { data: [], count: 0, error: error.message };
      }

      return { data: data as T[], count: count || 0 };
    } catch (error) {
      console.error(`Error in searchRecords for ${tableName}:`, error);
      return { data: [], count: 0, error: 'An unexpected error occurred' };
    }
  }
}
