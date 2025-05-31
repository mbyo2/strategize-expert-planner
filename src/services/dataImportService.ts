
import { supabase } from '@/integrations/supabase/client';
import { DatabaseService } from './databaseService';
import { toast } from 'sonner';

export interface DataImport {
  id?: string;
  user_id: string;
  file_name: string;
  file_size?: number;
  import_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_records?: number;
  processed_records?: number;
  failed_records?: number;
  error_log?: Record<string, any>;
  created_at?: string;
  completed_at?: string;
}

export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: any[];
}

export class DataImportService {
  /**
   * Validate CSV file format and content
   */
  static validateCsvFile(file: File): Promise<ImportValidationResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const errors: string[] = [];
          const warnings: string[] = [];
          const data: any[] = [];

          if (lines.length < 2) {
            errors.push('File must contain at least a header row and one data row');
            resolve({ isValid: false, errors, warnings, data });
            return;
          }

          // Parse header
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          if (headers.length === 0) {
            errors.push('No columns found in header row');
            resolve({ isValid: false, errors, warnings, data });
            return;
          }

          // Parse data rows
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines

            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            
            if (values.length !== headers.length) {
              warnings.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
              continue;
            }

            const rowData: any = {};
            headers.forEach((header, index) => {
              rowData[header] = values[index];
            });
            
            data.push(rowData);
          }

          const isValid = errors.length === 0;
          resolve({ isValid, errors, warnings, data });
          
        } catch (error) {
          resolve({
            isValid: false,
            errors: [`Failed to parse CSV file: ${error}`],
            warnings: [],
            data: []
          });
        }
      };

      reader.onerror = () => {
        resolve({
          isValid: false,
          errors: ['Failed to read file'],
          warnings: [],
          data: []
        });
      };

      reader.readAsText(file);
    });
  }

  /**
   * Create a new data import record
   */
  static async createImport(
    file: File,
    importType: string,
    userId: string
  ): Promise<DataImport | null> {
    try {
      const importRecord: Partial<DataImport> = {
        user_id: userId,
        file_name: file.name,
        file_size: file.size,
        import_type: importType,
        status: 'pending'
      };

      const { data, error } = await DatabaseService.createRecord<DataImport>(
        'data_imports',
        importRecord
      );

      if (error || !data) {
        console.error('Error creating import record:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createImport:', error);
      return null;
    }
  }

  /**
   * Process the import data
   */
  static async processImport(
    importId: string,
    data: any[],
    targetTable: string
  ): Promise<void> {
    try {
      // Update status to processing
      await DatabaseService.updateRecord('data_imports', importId, {
        status: 'processing',
        total_records: data.length,
        processed_records: 0
      });

      let processedCount = 0;
      let failedCount = 0;
      const errorLog: any = {};

      // Process in batches of 50
      const batchSize = 50;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        try {
          await DatabaseService.batchCreate(targetTable, batch);
          processedCount += batch.length;
        } catch (error) {
          console.error(`Error processing batch ${i / batchSize + 1}:`, error);
          failedCount += batch.length;
          errorLog[`batch_${i / batchSize + 1}`] = error;
        }

        // Update progress
        await DatabaseService.updateRecord('data_imports', importId, {
          processed_records: processedCount,
          failed_records: failedCount
        });
      }

      // Final status update
      const finalStatus = failedCount === 0 ? 'completed' : 
                         processedCount === 0 ? 'failed' : 'completed';

      await DatabaseService.updateRecord('data_imports', importId, {
        status: finalStatus,
        completed_at: new Date().toISOString(),
        error_log: Object.keys(errorLog).length > 0 ? errorLog : undefined
      });

      if (finalStatus === 'completed') {
        toast.success(`Import completed: ${processedCount} records processed`);
      } else {
        toast.warning(`Import completed with issues: ${processedCount} processed, ${failedCount} failed`);
      }

    } catch (error) {
      console.error('Error processing import:', error);
      
      await DatabaseService.updateRecord('data_imports', importId, {
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_log: { general_error: error }
      });

      toast.error('Import failed');
    }
  }

  /**
   * Import strategic goals from CSV
   */
  static async importStrategicGoals(
    file: File,
    userId: string
  ): Promise<void> {
    try {
      // Validate file
      const validation = await this.validateCsvFile(file);
      
      if (!validation.isValid) {
        toast.error('File validation failed', {
          description: validation.errors.join(', ')
        });
        return;
      }

      // Create import record
      const importRecord = await this.createImport(file, 'strategic_goals', userId);
      if (!importRecord?.id) {
        toast.error('Failed to create import record');
        return;
      }

      // Transform data for strategic goals table
      const transformedData = validation.data.map(row => ({
        name: row.name || row.title || 'Untitled Goal',
        description: row.description || '',
        status: row.status || 'planned',
        progress: parseInt(row.progress) || 0,
        target_value: row.target_value ? parseFloat(row.target_value) : null,
        current_value: row.current_value ? parseFloat(row.current_value) : null,
        start_date: row.start_date ? new Date(row.start_date).toISOString() : null,
        due_date: row.due_date ? new Date(row.due_date).toISOString() : null,
        user_id: userId
      }));

      // Process the import
      await this.processImport(importRecord.id, transformedData, 'strategic_goals');

    } catch (error) {
      console.error('Error importing strategic goals:', error);
      toast.error('Failed to import strategic goals');
    }
  }

  /**
   * Get import history for user
   */
  static async getImportHistory(userId: string): Promise<DataImport[]> {
    try {
      const { data } = await DatabaseService.fetchData<DataImport>(
        'data_imports',
        { limit: 50, sortBy: 'created_at', sortOrder: 'desc' },
        { user_id: userId }
      );

      return data;
    } catch (error) {
      console.error('Error fetching import history:', error);
      return [];
    }
  }

  /**
   * Export data to CSV
   */
  static exportToCsv(data: any[], filename: string): void {
    try {
      if (data.length === 0) {
        toast.error('No data to export');
        return;
      }

      // Get headers from first object
      const headers = Object.keys(data[0]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value || '');
            return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
          }).join(',')
        )
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('Data exported successfully');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  }
}
