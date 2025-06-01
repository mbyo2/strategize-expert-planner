
import React, { useState } from 'react';
import { Download, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ExportService } from '@/services/exportService';
import { fetchStrategicGoals } from '@/services/strategicGoalsService';
import { fetchIndustryMetrics } from '@/services/industryMetricsService';
import { useTeams } from '@/hooks/useTeams';
import { toast } from 'sonner';

type ExportType = 'goals' | 'metrics' | 'teams';
type ExportFormat = 'csv' | 'json';

const ExportDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [exportType, setExportType] = useState<ExportType>('goals');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const { teams } = useTeams();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      let data: any[] = [];
      let filename = '';

      switch (exportType) {
        case 'goals':
          data = await fetchStrategicGoals();
          filename = `strategic-goals-${new Date().toISOString().split('T')[0]}`;
          break;
        case 'metrics':
          data = await fetchIndustryMetrics();
          filename = `industry-metrics-${new Date().toISOString().split('T')[0]}`;
          break;
        case 'teams':
          data = teams;
          filename = `teams-${new Date().toISOString().split('T')[0]}`;
          break;
      }

      if (exportFormat === 'csv') {
        switch (exportType) {
          case 'goals':
            ExportService.exportGoalsToCSV(data);
            break;
          case 'metrics':
            ExportService.exportMetricsToCSV(data);
            break;
          case 'teams':
            ExportService.exportTeamsToCSV(data);
            break;
        }
      } else {
        ExportService.exportToJSON(data, `${filename}.json`);
      }

      toast.success('Export completed successfully');
      setOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Choose what data to export and in which format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="export-type">Data Type</Label>
            <Select value={exportType} onValueChange={(value) => setExportType(value as ExportType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goals">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Strategic Goals
                  </div>
                </SelectItem>
                <SelectItem value="metrics">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Industry Metrics
                  </div>
                </SelectItem>
                <SelectItem value="teams">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Teams
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="export-format">Format</Label>
            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    CSV (Excel compatible)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    JSON
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
