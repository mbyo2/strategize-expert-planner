
import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ImportService } from '@/services/importService';
import { toast } from 'sonner';

type ImportType = 'goals' | 'metrics';

const ImportDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [importType, setImportType] = useState<ImportType>('goals');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setImportResult(null);
      } else {
        toast.error('Please select a CSV file');
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setIsImporting(true);
      let result;

      switch (importType) {
        case 'goals':
          result = await ImportService.importGoalsFromCSV(selectedFile);
          break;
        case 'metrics':
          result = await ImportService.importMetricsFromCSV(selectedFile);
          break;
        default:
          throw new Error('Invalid import type');
      }

      setImportResult(result);
      
      if (result.success) {
        toast.success(`Import completed: ${result.processed} records processed`);
      } else {
        toast.error('Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    } finally {
      setIsImporting(false);
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setImportResult(null);
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetDialog();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Import data from a CSV file. Download a template to see the required format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="import-type">Data Type</Label>
            <Select value={importType} onValueChange={(value) => setImportType(value as ImportType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goals">Strategic Goals</SelectItem>
                <SelectItem value="metrics">Industry Metrics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="file-upload">CSV File</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                {selectedFile ? selectedFile.name : 'Choose CSV file...'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {selectedFile && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                File selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </AlertDescription>
            </Alert>
          )}

          {isImporting && (
            <div className="space-y-2">
              <Progress value={50} />
              <p className="text-sm text-muted-foreground">Processing import...</p>
            </div>
          )}

          {importResult && (
            <div className="space-y-2">
              <Alert className={importResult.success ? "border-green-200" : "border-red-200"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {importResult.success 
                    ? `Import completed: ${importResult.processed} records processed, ${importResult.failed} failed`
                    : 'Import failed'
                  }
                </AlertDescription>
              </Alert>
              
              {importResult.errors.length > 0 && (
                <div className="max-h-32 overflow-y-auto text-sm text-red-600 bg-red-50 p-2 rounded">
                  {importResult.errors.map((error: string, index: number) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {importResult ? 'Close' : 'Cancel'}
          </Button>
          {!importResult && (
            <Button 
              onClick={handleImport} 
              disabled={!selectedFile || isImporting}
            >
              {isImporting ? 'Importing...' : 'Import'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
