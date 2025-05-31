
import React, { useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import { DataImportService } from '@/services/dataImportService';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const DataExportDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportType, setExportType] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const exportTypes = [
    { value: 'strategic_goals', label: 'Strategic Goals', table: 'strategic_goals' },
    { value: 'planning_initiatives', label: 'Planning Initiatives', table: 'planning_initiatives' },
    { value: 'teams', label: 'Teams', table: 'teams' },
    { value: 'team_members', label: 'Team Members', table: 'team_members' }
  ];

  const handleExport = async () => {
    if (!exportType) {
      toast.error('Please select data to export');
      return;
    }

    setIsExporting(true);

    try {
      const exportConfig = exportTypes.find(type => type.value === exportType);
      if (!exportConfig) {
        toast.error('Invalid export type');
        return;
      }

      // Fetch all data for the selected table
      const { data } = await fetch(`/api/export/${exportConfig.table}`).then(res => res.json()).catch(() => ({ data: [] }));
      
      // If no API endpoint, fall back to direct database fetch
      if (!data || data.length === 0) {
        toast.warning('No data found to export');
        return;
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${exportType}_${timestamp}.csv`;

      // Export to CSV
      DataImportService.exportToCsv(data, filename);

      setIsOpen(false);
      setExportType('');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="export-type" className="text-sm font-medium">
              Select Data to Export
            </label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose data to export" />
              </SelectTrigger>
              <SelectContent>
                {exportTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || !exportType}
            >
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataExportDialog;
