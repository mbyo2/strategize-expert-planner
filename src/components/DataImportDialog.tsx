
import React, { useState } from 'react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { DataImportService } from '@/services/dataImportService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const DataImportDialog: React.FC = () => {
  const { session } = useSimpleAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const importTypes = [
    { value: 'strategic_goals', label: 'Strategic Goals' },
    { value: 'planning_initiatives', label: 'Planning Initiatives' },
    { value: 'team_members', label: 'Team Members' }
  ];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValidationResult(null);

    // Validate file if it's a CSV
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      try {
        const validation = await DataImportService.validateCsvFile(file);
        setValidationResult(validation);
      } catch (error) {
        toast.error('Failed to validate file');
        console.error('File validation error:', error);
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !importType || !session.user) {
      toast.error('Please select a file and import type');
      return;
    }

    setIsProcessing(true);

    try {
      switch (importType) {
        case 'strategic_goals':
          await DataImportService.importStrategicGoals(selectedFile, session.user.id);
          break;
        default:
          toast.error('Import type not supported yet');
          return;
      }

      setIsOpen(false);
      setSelectedFile(null);
      setImportType('');
      setValidationResult(null);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="import-type">Import Type</Label>
            <Select value={importType} onValueChange={setImportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select what to import" />
              </SelectTrigger>
              <SelectContent>
                {importTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-input">CSV File</Label>
            <Input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isProcessing}
            />
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}

          {validationResult && (
            <div className="space-y-2">
              {validationResult.isValid ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    File is valid. Found {validationResult.data.length} records to import.
                    {validationResult.warnings.length > 0 && (
                      <div className="mt-2">
                        <strong>Warnings:</strong>
                        <ul className="list-disc list-inside text-xs">
                          {validationResult.warnings.map((warning: string, index: number) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    File validation failed:
                    <ul className="list-disc list-inside text-xs mt-1">
                      {validationResult.errors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={
                isProcessing || 
                !selectedFile || 
                !importType || 
                (validationResult && !validationResult.isValid)
              }
            >
              {isProcessing ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataImportDialog;
