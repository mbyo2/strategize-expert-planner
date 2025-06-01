import { DatabaseService } from './databaseService';
import { logAuditEvent } from './auditService';

export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
}

export interface ImportedGoal {
  name: string;
  description?: string;
  status: 'planned' | 'active' | 'completed' | 'paused';
  progress: number;
  target_value?: number;
  current_value?: number;
  start_date?: string;
  due_date?: string;
}

export interface DataImportRecord {
  id: string;
  user_id: string;
  file_name: string;
  import_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_size?: number;
  total_records: number;
  processed_records: number;
  failed_records: number;
  error_log?: Record<string, any>;
  created_at: string;
  completed_at?: string;
}

export class DataImportService {
  /**
   * Validate CSV file content for strategic goals import
   */
  static validateCsvFile(csvContent: string): ImportValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      const lines = csvContent.trim().split('\n');
      const rowCount = lines.length - 1; // Exclude header
      
      if (lines.length < 2) {
        errors.push('CSV file must contain at least one data row');
        return { isValid: false, errors, warnings, rowCount: 0 };
      }
      
      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredColumns = ['name'];
      const optionalColumns = ['description', 'status', 'progress', 'target_value', 'current_value', 'start_date', 'due_date'];
      
      // Check required columns
      for (const required of requiredColumns) {
        if (!header.includes(required)) {
          errors.push(`Required column '${required}' is missing`);
        }
      }
      
      // Validate data rows
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        const rowData: any = {};
        
        header.forEach((col, index) => {
          rowData[col] = row[index]?.trim() || '';
        });
        
        // Validate required fields
        if (!rowData.name) {
          errors.push(`Row ${i}: Name is required`);
        }
        
        // Validate status if provided
        if (rowData.status && !['planned', 'active', 'completed', 'paused'].includes(rowData.status)) {
          errors.push(`Row ${i}: Invalid status '${rowData.status}'. Must be one of: planned, active, completed, paused`);
        }
        
        // Validate progress if provided
        if (rowData.progress) {
          const progress = parseInt(rowData.progress);
          if (isNaN(progress) || progress < 0 || progress > 100) {
            errors.push(`Row ${i}: Progress must be a number between 0 and 100`);
          }
        }
        
        // Validate numeric fields
        if (rowData.target_value && isNaN(parseFloat(rowData.target_value))) {
          warnings.push(`Row ${i}: Target value '${rowData.target_value}' is not a valid number`);
        }
        
        if (rowData.current_value && isNaN(parseFloat(rowData.current_value))) {
          warnings.push(`Row ${i}: Current value '${rowData.current_value}' is not a valid number`);
        }
        
        // Validate dates
        if (rowData.start_date && rowData.start_date !== '' && isNaN(Date.parse(rowData.start_date))) {
          warnings.push(`Row ${i}: Start date '${rowData.start_date}' is not a valid date`);
        }
        
        if (rowData.due_date && rowData.due_date !== '' && isNaN(Date.parse(rowData.due_date))) {
          warnings.push(`Row ${i}: Due date '${rowData.due_date}' is not a valid date`);
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        rowCount
      };
      
    } catch (error) {
      errors.push('Failed to parse CSV file. Please check the file format.');
      return { isValid: false, errors, warnings, rowCount: 0 };
    }
  }

  /**
   * Import strategic goals from CSV content
   */
  static async importStrategicGoals(
    csvContent: string,
    userId: string,
    fileName: string
  ): Promise<{ success: boolean; importId: string; message: string }> {
    try {
      // Validate the CSV first
      const validation = this.validateCsvFile(csvContent);
      if (!validation.isValid) {
        return {
          success: false,
          importId: '',
          message: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Create import record
      const importRecord: Omit<DataImportRecord, 'id' | 'created_at'> = {
        user_id: userId,
        file_name: fileName,
        import_type: 'strategic_goals',
        status: 'processing',
        total_records: validation.rowCount,
        processed_records: 0,
        failed_records: 0,
        file_size: csvContent.length
      };

      const importResult = await DatabaseService.createRecord<DataImportRecord>('data_imports', importRecord);
      
      if (!importResult.data) {
        return {
          success: false,
          importId: '',
          message: 'Failed to create import record'
        };
      }

      const importId = importResult.data.id;

      // Process the CSV data
      const lines = csvContent.trim().split('\n');
      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const goals: ImportedGoal[] = [];
      let processedCount = 0;
      let failedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        try {
          const row = lines[i].split(',');
          const goalData: any = {};
          
          header.forEach((col, index) => {
            const value = row[index]?.trim() || '';
            if (value) {
              goalData[col] = value;
            }
          });

          // Create goal object
          const goal: ImportedGoal = {
            name: goalData.name,
            description: goalData.description || '',
            status: goalData.status || 'planned',
            progress: parseInt(goalData.progress) || 0,
            target_value: goalData.target_value ? parseFloat(goalData.target_value) : undefined,
            current_value: goalData.current_value ? parseFloat(goalData.current_value) : undefined,
            start_date: goalData.start_date && goalData.start_date !== '' ? new Date(goalData.start_date).toISOString() : undefined,
            due_date: goalData.due_date && goalData.due_date !== '' ? new Date(goalData.due_date).toISOString() : undefined
          };

          // Create the goal in the database
          const createResult = await DatabaseService.createRecord('strategic_goals', {
            ...goal,
            user_id: userId
          });

          if (createResult.data) {
            processedCount++;
            goals.push(goal);
          } else {
            failedCount++;
          }

          // Update progress
          await DatabaseService.updateRecord('data_imports', importId, {
            processed_records: processedCount,
            failed_records: failedCount
          } as any);

        } catch (error) {
          failedCount++;
          console.error(`Error processing row ${i}:`, error);
        }
      }

      // Mark import as completed
      await DatabaseService.updateRecord('data_imports', importId, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        processed_records: processedCount,
        failed_records: failedCount
      } as any);

      // Log the import event
      await logAuditEvent({
        action: 'create',
        resource: 'strategic_goals',
        resourceId: importId,
        description: `Imported ${processedCount} strategic goals from CSV`,
        userId,
        severity: 'medium',
        metadata: {
          fileName,
          processedCount,
          failedCount,
          totalCount: validation.rowCount
        }
      });

      return {
        success: true,
        importId,
        message: `Successfully imported ${processedCount} goals. ${failedCount} failed.`
      };

    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        importId: '',
        message: 'Import failed due to an unexpected error'
      };
    }
  }

  /**
   * Export data to CSV format
   */
  static exportToCsv(data: any[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle null/undefined values and escape commas/quotes
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          // Escape quotes and wrap in quotes if contains comma or quote
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
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
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Get import status and details
   */
  static async getImportStatus(importId: string): Promise<DataImportRecord | null> {
    try {
      const result = await DatabaseService.fetchData<DataImportRecord>(
        'data_imports',
        { limit: 1 },
        { id: importId }
      );
      
      return result.data[0] || null;
    } catch (error) {
      console.error('Error fetching import status:', error);
      return null;
    }
  }

  /**
   * Get user's import history
   */
  static async getUserImports(userId: string): Promise<DataImportRecord[]> {
    try {
      const result = await DatabaseService.fetchData<DataImportRecord>(
        'data_imports',
        { limit: 50, sortBy: 'created_at', sortOrder: 'desc' },
        { user_id: userId }
      );
      
      return result.data;
    } catch (error) {
      console.error('Error fetching user imports:', error);
      return [];
    }
  }
}
