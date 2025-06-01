
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database';

export interface DatabaseRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
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

export interface DatabaseResult<T> {
  data: T[];
  count: number;
  error?: string;
}

export interface DatabaseSingleResult<T> {
  data: T | null;
  error?: string;
}

export interface DatabaseMutationResult<T> {
  data: T | null;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export class DatabaseService {
  /**
   * Fetch data from a table with pagination and filtering
   */
  static async fetchData<T extends DatabaseRecord>(
    tableName: string,
    options: PaginationOptions = {},
    filters: FilterOptions = {}
  ): Promise<DatabaseResult<T>> {
    try {
      const { page = 1, limit = 50, sortBy = 'created_at', sortOrder = 'desc' } = options;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from(tableName as any)
        .select('*', { count: 'exact' })
        .range(from, to)
        .order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });

      const { data, error, count } = await query;

      if (error) {
        console.error('Database fetch error:', error);
        return { data: [], count: 0, error: error.message };
      }

      return {
        data: (data || []) as T[],
        count: count || 0
      };
    } catch (error) {
      console.error('Database service error:', error);
      return { data: [], count: 0, error: 'Database operation failed' };
    }
  }

  /**
   * Create a new record
   */
  static async createRecord<T extends DatabaseRecord>(
    tableName: string,
    record: Omit<T, 'id' | 'created_at' | 'updated_at'>
  ): Promise<DatabaseMutationResult<T>> {
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .insert(record)
        .select()
        .single();

      if (error) {
        console.error('Database create error:', error);
        return { data: null, error: error.message };
      }

      return { data: data as T };
    } catch (error) {
      console.error('Database service error:', error);
      return { data: null, error: 'Database operation failed' };
    }
  }

  /**
   * Update a record
   */
  static async updateRecord<T extends DatabaseRecord>(
    tableName: string,
    id: string,
    updates: Partial<Omit<T, 'id' | 'created_at'>>
  ): Promise<DatabaseMutationResult<T>> {
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Database update error:', error);
        return { data: null, error: error.message };
      }

      return { data: data as T };
    } catch (error) {
      console.error('Database service error:', error);
      return { data: null, error: 'Database operation failed' };
    }
  }

  /**
   * Delete a record
   */
  static async deleteRecord(tableName: string, id: string): Promise<DeleteResult> {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Database delete error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Database service error:', error);
      return { success: false, error: 'Database operation failed' };
    }
  }

  /**
   * Search records
   */
  static async searchRecords<T extends DatabaseRecord>(
    tableName: string,
    searchTerm: string,
    searchFields?: string[],
    options: PaginationOptions = {}
  ): Promise<DatabaseResult<T>> {
    try {
      const { page = 1, limit = 50, sortBy = 'created_at', sortOrder = 'desc' } = options;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from(tableName as any)
        .select('*', { count: 'exact' })
        .range(from, to)
        .order(sortBy, { ascending: sortOrder === 'asc' });

      // If search fields are specified, search in those fields
      if (searchFields && searchFields.length > 0) {
        const searchConditions = searchFields.map(field => 
          `${field}.ilike.%${searchTerm}%`
        ).join(',');
        query = query.or(searchConditions);
      } else {
        // Default search in common text fields
        query = query.or(`name.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Database search error:', error);
        return { data: [], count: 0, error: error.message };
      }

      return {
        data: (data || []) as T[],
        count: count || 0
      };
    } catch (error) {
      console.error('Database service error:', error);
      return { data: [], count: 0, error: 'Database operation failed' };
    }
  }

  /**
   * Batch create records
   */
  static async batchCreate<T extends Omit<DatabaseRecord, 'id'>>(
    tableName: string,
    records: T[]
  ): Promise<DatabaseMutationResult<T[]>> {
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .insert(records)
        .select();

      if (error) {
        console.error('Database batch create error:', error);
        return { data: null, error: error.message };
      }

      return { data: data as T[] };
    } catch (error) {
      console.error('Database service error:', error);
      return { data: null, error: 'Database operation failed' };
    }
  }

  /**
   * Subscribe to real-time changes for a table
   */
  static subscribeToTable<T extends DatabaseRecord>(
    tableName: string,
    callback: (payload: any) => void
  ): () => void {
    const subscription = supabase
      .channel(`${tableName}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }
}
