
import { toast } from 'sonner';
import { DatabaseService } from './databaseService';

interface ImportResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: string[];
}

export class ImportService {
  static parseCSV(csvContent: string): { headers: string[]; rows: string[][] } {
    const lines = csvContent.trim().split('\n');
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    const headers = this.parseCSVLine(lines[0]);
    const rows = lines.slice(1).map(line => this.parseCSVLine(line));

    return { headers, rows };
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  static async importGoalsFromCSV(file: File): Promise<ImportResult> {
    try {
      const csvContent = await this.readFileAsText(file);
      const { headers, rows } = this.parseCSV(csvContent);

      // Validate headers
      const requiredHeaders = ['name', 'status'];
      const headerMap = this.createHeaderMap(headers, requiredHeaders);

      let processed = 0;
      let failed = 0;
      const errors: string[] = [];

      for (let i = 0; i < rows.length; i++) {
        try {
          const row = rows[i];
          const goalData = {
            name: this.getCellValue(row, headerMap.name),
            description: this.getCellValue(row, headerMap.description),
            status: this.getCellValue(row, headerMap.status, 'planned'),
            progress: parseInt(this.getCellValue(row, headerMap.progress, '0')) || 0,
            target_value: parseFloat(this.getCellValue(row, headerMap.target_value)) || undefined,
            current_value: parseFloat(this.getCellValue(row, headerMap.current_value)) || undefined,
            start_date: this.getCellValue(row, headerMap.start_date) || undefined,
            due_date: this.getCellValue(row, headerMap.due_date) || undefined,
            user_id: 'current-user' // This should be replaced with actual user ID
          };

          // Validate required fields
          if (!goalData.name) {
            throw new Error('Name is required');
          }

          await DatabaseService.createRecord('strategic_goals', goalData);
          processed++;
        } catch (error) {
          failed++;
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return { success: true, processed, failed, errors };
    } catch (error) {
      return {
        success: false,
        processed: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  static async importMetricsFromCSV(file: File): Promise<ImportResult> {
    try {
      const csvContent = await this.readFileAsText(file);
      const { headers, rows } = this.parseCSV(csvContent);

      const requiredHeaders = ['name', 'value', 'category'];
      const headerMap = this.createHeaderMap(headers, requiredHeaders);

      let processed = 0;
      let failed = 0;
      const errors: string[] = [];

      for (let i = 0; i < rows.length; i++) {
        try {
          const row = rows[i];
          const metricData = {
            name: this.getCellValue(row, headerMap.name),
            value: parseFloat(this.getCellValue(row, headerMap.value)) || 0,
            category: this.getCellValue(row, headerMap.category),
            source: this.getCellValue(row, headerMap.source),
            previous_value: parseFloat(this.getCellValue(row, headerMap.previous_value)) || undefined,
            trend: this.getCellValue(row, headerMap.trend),
          };

          if (!metricData.name || !metricData.category) {
            throw new Error('Name and category are required');
          }

          await DatabaseService.createRecord('industry_metrics', metricData);
          processed++;
        } catch (error) {
          failed++;
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return { success: true, processed, failed, errors };
    } catch (error) {
      return {
        success: false,
        processed: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  private static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private static createHeaderMap(headers: string[], requiredHeaders: string[]): Record<string, number> {
    const headerMap: Record<string, number> = {};
    
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().replace(/\s+/g, '_');
      headerMap[normalizedHeader] = index;
    });

    // Check for required headers
    for (const required of requiredHeaders) {
      if (!(required in headerMap)) {
        throw new Error(`Required header '${required}' not found in CSV`);
      }
    }

    return headerMap;
  }

  private static getCellValue(row: string[], index: number | undefined, defaultValue: string = ''): string {
    if (index === undefined || index >= row.length) {
      return defaultValue;
    }
    return row[index] || defaultValue;
  }
}
