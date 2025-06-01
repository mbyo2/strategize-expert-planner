
import { DatabaseService, DatabaseRecord } from './databaseService';

export interface DataImport extends DatabaseRecord {
  user_id: string;
  file_name: string;
  import_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_size?: number;
  total_records: number;
  processed_records: number;
  failed_records: number;
  error_log?: Record<string, any>;
  completed_at?: string;
}

export class DataImportService {
  /**
   * Export data to CSV format
   */
  static exportToCsv<T extends Record<string, any>>(data: T[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      // Header row
      headers.join(','),
      // Data rows
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
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
    }
  }

  /**
   * Import CSV data
   */
  static async importFromCsv(
    file: File,
    tableName: string,
    userId: string,
    fieldMapping?: Record<string, string>
  ): Promise<string> {
    try {
      // Create import record
      const importRecord: Omit<DataImport, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        file_name: file.name,
        import_type: 'csv',
        status: 'pending',
        file_size: file.size,
        total_records: 0,
        processed_records: 0,
        failed_records: 0
      };

      const result = await DatabaseService.createRecord<DataImport>('data_imports', importRecord);
      
      if (!result.data) {
        throw new Error('Failed to create import record');
      }

      const importId = result.data.id;

      // Process the file
      this.processCsvFile(file, tableName, importId, fieldMapping);

      return importId;
    } catch (error) {
      console.error('Error starting CSV import:', error);
      throw error;
    }
  }

  /**
   * Process CSV file content
   */
  private static async processCsvFile(
    file: File,
    tableName: string,
    importId: string,
    fieldMapping?: Record<string, string>
  ): Promise<void> {
    try {
      // Update status to processing
      await DatabaseService.updateRecord('data_imports', importId, {
        status: 'processing'
      });

      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const dataLines = lines.slice(1);

      // Update total records count
      await DatabaseService.updateRecord('data_imports', importId, {
        total_records: dataLines.length
      });

      let processedCount = 0;
      let failedCount = 0;
      const errors: any[] = [];

      // Process records in batches
      const batchSize = 100;
      for (let i = 0; i < dataLines.length; i += batchSize) {
        const batch = dataLines.slice(i, i + batchSize);
        const records = [];

        for (const line of batch) {
          try {
            const values = this.parseCsvLine(line);
            if (values.length !== headers.length) {
              throw new Error('Column count mismatch');
            }

            const record: any = {};
            headers.forEach((header, index) => {
              const mappedField = fieldMapping?.[header] || header;
              record[mappedField] = values[index];
            });

            records.push(record);
            processedCount++;
          } catch (error) {
            failedCount++;
            errors.push({
              line: i + processedCount + failedCount,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        // Insert batch
        if (records.length > 0) {
          try {
            await DatabaseService.batchCreate(tableName, records);
          } catch (error) {
            failedCount += records.length;
            processedCount -= records.length;
            errors.push({
              batch: i / batchSize + 1,
              error: error instanceof Error ? error.message : 'Batch insert failed'
            });
          }
        }

        // Update progress
        await DatabaseService.updateRecord('data_imports', importId, {
          processed_records: processedCount,
          failed_records: failedCount,
          error_log: errors.length > 0 ? { errors } : undefined
        });
      }

      // Mark as completed
      await DatabaseService.updateRecord('data_imports', importId, {
        status: processedCount > 0 ? 'completed' : 'failed',
        completed_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error processing CSV file:', error);
      
      // Mark as failed
      await DatabaseService.updateRecord('data_imports', importId, {
        status: 'failed',
        error_log: { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        },
        completed_at: new Date().toISOString()
      });
    }
  }

  /**
   * Parse a CSV line, handling quoted values
   */
  private static parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add last field
    result.push(current.trim());
    
    return result;
  }

  /**
   * Get import status
   */
  static async getImportStatus(importId: string): Promise<DataImport | null> {
    try {
      const { data } = await DatabaseService.fetchData<DataImport>(
        'data_imports',
        { limit: 1 },
        { id: importId }
      );
      
      return data[0] || null;
    } catch (error) {
      console.error('Error getting import status:', error);
      return null;
    }
  }
}
