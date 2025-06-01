
import { saveAs } from 'file-saver';

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename?: string;
}

export class ExportService {
  static exportToCSV(data: ExportData): void {
    const { headers, rows, filename = 'export.csv' } = data;
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  static exportToJSON(data: any, filename: string = 'export.json'): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    saveAs(blob, filename);
  }

  static exportGoalsToCSV(goals: any[]): void {
    const headers = [
      'Name',
      'Description',
      'Status',
      'Progress',
      'Target Value',
      'Current Value',
      'Start Date',
      'Due Date',
      'Created At'
    ];

    const rows = goals.map(goal => [
      goal.name || '',
      goal.description || '',
      goal.status || '',
      goal.progress || 0,
      goal.target_value || '',
      goal.current_value || '',
      goal.start_date || '',
      goal.due_date || '',
      goal.created_at || ''
    ]);

    this.exportToCSV({
      headers,
      rows,
      filename: `strategic-goals-${new Date().toISOString().split('T')[0]}.csv`
    });
  }

  static exportMetricsToCSV(metrics: any[]): void {
    const headers = [
      'Name',
      'Value',
      'Previous Value',
      'Change Percentage',
      'Trend',
      'Category',
      'Source',
      'Updated At'
    ];

    const rows = metrics.map(metric => [
      metric.name || '',
      metric.value || 0,
      metric.previous_value || '',
      metric.change_percentage || '',
      metric.trend || '',
      metric.category || '',
      metric.source || '',
      metric.updated_at || ''
    ]);

    this.exportToCSV({
      headers,
      rows,
      filename: `industry-metrics-${new Date().toISOString().split('T')[0]}.csv`
    });
  }

  static exportTeamsToCSV(teams: any[]): void {
    const headers = [
      'Name',
      'Description',
      'Type',
      'Member Count',
      'Created At'
    ];

    const rows = teams.map(team => [
      team.name || '',
      team.description || '',
      team.team_type || '',
      team.members?.length || 0,
      team.created_at || ''
    ]);

    this.exportToCSV({
      headers,
      rows,
      filename: `teams-${new Date().toISOString().split('T')[0]}.csv`
    });
  }
}
