
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

/**
 * Utility for exporting data to different file formats
 */

// Type for export formats
export type ExportFormat = 'pdf' | 'excel' | 'csv';

// Options for export
export interface ExportOptions {
  fileName?: string;
  includeTimestamp?: boolean;
  sheetName?: string; // For Excel exports
}

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], options: ExportOptions = {}) => {
  try {
    // Generate filename with optional timestamp
    const timestamp = options.includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : '';
    const fileName = `${options.fileName || 'export'}${timestamp}.csv`;
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(field => {
          const value = row[field] === null || row[field] === undefined ? '' : row[field];
          // Handle commas and quotes in values
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
    
    toast.success(`Successfully exported to ${fileName}`);
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    toast.error('Failed to export to CSV');
    return false;
  }
};

/**
 * Export data to Excel format
 * Note: In a real application, you would use a library like xlsx or exceljs
 * This is a simplified version that creates a CSV with Excel extension
 */
export const exportToExcel = (data: any[], options: ExportOptions = {}) => {
  try {
    // Generate filename with optional timestamp
    const timestamp = options.includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : '';
    const fileName = `${options.fileName || 'export'}${timestamp}.xlsx`;
    
    // For now, we're just creating a CSV with an Excel extension
    // In a real application, you would use a library to create a proper Excel file
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV format for Excel
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(field => {
          const value = row[field] === null || row[field] === undefined ? '' : row[field];
          // Handle commas and quotes in values
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;' });
    saveAs(blob, fileName);
    
    toast.success(`Successfully exported to ${fileName}`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    toast.error('Failed to export to Excel');
    return false;
  }
};

/**
 * Export data to PDF format using jsPDF (auto-tabular layout).
 */
export const exportToPDF = async (data: any[], options: ExportOptions = {}) => {
  try {
    const { jsPDF } = await import('jspdf');
    const timestamp = options.includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : '';
    const fileName = `${options.fileName || 'export'}${timestamp}.pdf`;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const headers = Object.keys(data[0]);
    const margin = 32;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const colWidth = (pageWidth - margin * 2) / headers.length;
    const rowHeight = 18;
    let y = margin;

    doc.setFontSize(14);
    doc.text(options.fileName || 'Export', margin, y);
    y += 24;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    headers.forEach((h, i) => doc.text(String(h), margin + i * colWidth, y));
    y += rowHeight;
    doc.setFont('helvetica', 'normal');

    for (const row of data) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      headers.forEach((h, i) => {
        const v = row[h];
        const text = v === null || v === undefined ? '' : String(v);
        doc.text(text.length > 60 ? text.slice(0, 57) + '…' : text, margin + i * colWidth, y);
      });
      y += rowHeight;
    }

    doc.save(fileName);
    toast.success(`Successfully exported to ${fileName}`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    toast.error('Failed to export to PDF');
    return false;
  }
};

/**
 * Main export function that handles different formats
 */
export const exportData = (data: any[], format: ExportFormat, options: ExportOptions = {}) => {
  if (!data || data.length === 0) {
    toast.error('No data to export');
    return false;
  }
  
  switch (format) {
    case 'csv':
      return exportToCSV(data, options);
    case 'excel':
      return exportToExcel(data, options);
    case 'pdf':
      return exportToPDF(data, options);
    default:
      toast.error(`Unsupported export format: ${format}`);
      return false;
  }
};
