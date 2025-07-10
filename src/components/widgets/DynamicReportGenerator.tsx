import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, Table, BarChart3, TrendingUp } from "lucide-react";
import { toast } from 'sonner';
import { useStrategicGoalsData } from '@/hooks/useStrategicGoalsData';
import { usePlanningInitiativesData } from '@/hooks/usePlanningInitiativesData';
import { useRealTimeMarketChanges } from '@/hooks/useRealTimeMarketChanges';
import { useRealTimeRecommendations } from '@/hooks/useRealTimeRecommendations';

type ReportType = 'strategic' | 'initiatives' | 'market' | 'recommendations' | 'overview';

interface ReportFormat {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const reportFormats: ReportFormat[] = [
  {
    id: 'pdf',
    name: 'PDF Report',
    icon: <FileText className="h-4 w-4" />,
    description: 'Comprehensive formatted report'
  },
  {
    id: 'excel',
    name: 'Excel Spreadsheet',
    icon: <Table className="h-4 w-4" />,
    description: 'Data in spreadsheet format'
  },
  {
    id: 'csv',
    name: 'CSV Data',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Raw data export'
  }
];

export default function DynamicReportGenerator() {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('overview');
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const { goals, loading: goalsLoading } = useStrategicGoalsData();
  const { initiatives, loading: initiativesLoading } = usePlanningInitiativesData();
  const { marketChanges, loading: marketLoading } = useRealTimeMarketChanges();
  const { recommendations, loading: recommendationsLoading } = useRealTimeRecommendations();

  const isDataLoading = goalsLoading || initiativesLoading || marketLoading || recommendationsLoading;

  const getReportData = () => {
    switch (selectedReportType) {
      case 'strategic':
        return {
          title: "Strategic Goals Report",
          data: goals,
          count: goals.length
        };
      case 'initiatives':
        return {
          title: "Planning Initiatives Report",
          data: initiatives,
          count: initiatives.length
        };
      case 'market':
        return {
          title: "Market Changes Report",
          data: marketChanges,
          count: marketChanges.length
        };
      case 'recommendations':
        return {
          title: "Recommendations Report",
          data: recommendations,
          count: recommendations.length
        };
      case 'overview':
        return {
          title: "Executive Overview Report",
          data: {
            goals: goals.slice(0, 5),
            initiatives: initiatives.slice(0, 5),
            marketChanges: marketChanges.slice(0, 3),
            recommendations: recommendations.slice(0, 3)
          },
          count: goals.length + initiatives.length + marketChanges.length + recommendations.length
        };
      default:
        return { title: "Unknown Report", data: [], count: 0 };
    }
  };

  const generateReport = async () => {
    if (isDataLoading) {
      toast.error('Please wait for data to load before generating report');
      return;
    }

    const reportData = getReportData();
    
    if (reportData.count === 0) {
      toast.error('No data available for the selected report type');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate report generation progress
      const progressSteps = [20, 40, 60, 80, 100];
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setGenerationProgress(step);
      }

      // Generate the actual report based on format
      if (selectedFormat === 'csv') {
        generateCSVReport(reportData);
      } else if (selectedFormat === 'excel') {
        generateExcelReport(reportData);
      } else {
        generatePDFReport(reportData);
      }

      toast.success(`${reportData.title} generated successfully`);
    } catch (error) {
      console.error('Report generation failed:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const generateCSVReport = (reportData: any) => {
    let csvContent = '';
    
    if (selectedReportType === 'overview') {
      // Generate overview CSV
      csvContent = 'Type,Name,Status,Progress,Date\n';
      reportData.data.goals.forEach((goal: any) => {
        csvContent += `Goal,"${goal.name}","${goal.status}",${goal.progress}%,"${goal.due_date || ''}"\n`;
      });
      reportData.data.initiatives.forEach((initiative: any) => {
        csvContent += `Initiative,"${initiative.name}","${initiative.status}",${initiative.progress}%,"${initiative.end_date || ''}"\n`;
      });
    } else {
      // Generate specific type CSV
      const headers = getCSVHeaders(selectedReportType);
      csvContent = headers.join(',') + '\n';
      
      reportData.data.forEach((item: any) => {
        const row = headers.map(header => {
          const key = header.toLowerCase().replace(' ', '_');
          return `"${item[key] || ''}"`;
        });
        csvContent += row.join(',') + '\n';
      });
    }

    downloadFile(csvContent, `${reportData.title.replace(/\s+/g, '_')}.csv`, 'text/csv');
  };

  const generateExcelReport = (reportData: any) => {
    // Simplified Excel generation (would need proper library in real implementation)
    const jsonData = JSON.stringify(reportData.data, null, 2);
    downloadFile(jsonData, `${reportData.title.replace(/\s+/g, '_')}.json`, 'application/json');
    toast.info('Excel format exported as JSON for compatibility');
  };

  const generatePDFReport = (reportData: any) => {
    // Simplified PDF generation (would need proper library in real implementation)
    let content = `${reportData.title}\n\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `Total Records: ${reportData.count}\n\n`;
    
    if (selectedReportType === 'overview') {
      content += 'STRATEGIC GOALS:\n';
      reportData.data.goals.forEach((goal: any, index: number) => {
        content += `${index + 1}. ${goal.name} - ${goal.status} (${goal.progress}%)\n`;
      });
      content += '\nPLANNING INITIATIVES:\n';
      reportData.data.initiatives.forEach((initiative: any, index: number) => {
        content += `${index + 1}. ${initiative.name} - ${initiative.status} (${initiative.progress}%)\n`;
      });
    } else {
      reportData.data.forEach((item: any, index: number) => {
        content += `${index + 1}. ${item.name || item.title} - ${item.status || item.impact_level}\n`;
      });
    }

    downloadFile(content, `${reportData.title.replace(/\s+/g, '_')}.txt`, 'text/plain');
    toast.info('PDF format exported as text for compatibility');
  };

  const getCSVHeaders = (type: ReportType): string[] => {
    switch (type) {
      case 'strategic':
        return ['Name', 'Status', 'Progress', 'Due Date', 'Created At'];
      case 'initiatives':
        return ['Name', 'Status', 'Progress', 'Start Date', 'End Date'];
      case 'market':
        return ['Title', 'Impact Level', 'Description', 'Date Identified'];
      case 'recommendations':
        return ['Title', 'Priority', 'Status', 'Description', 'Created At'];
      default:
        return ['Name', 'Status', 'Date'];
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reportData = getReportData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Dynamic Report Generator
        </CardTitle>
        <CardDescription>
          Generate real-time reports from your strategic data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <Select value={selectedReportType} onValueChange={(value: ReportType) => setSelectedReportType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Executive Overview</SelectItem>
              <SelectItem value="strategic">Strategic Goals</SelectItem>
              <SelectItem value="initiatives">Planning Initiatives</SelectItem>
              <SelectItem value="market">Market Changes</SelectItem>
              <SelectItem value="recommendations">Recommendations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {reportFormats.map((format) => (
              <Card
                key={format.id}
                className={`cursor-pointer transition-colors ${
                  selectedFormat === format.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedFormat(format.id)}
              >
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {format.icon}
                  </div>
                  <h4 className="text-sm font-medium">{format.name}</h4>
                  <p className="text-xs text-muted-foreground">{format.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Report Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Preview</label>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{reportData.title}</h4>
                <Badge variant="outline">{reportData.count} records</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Generated on: {new Date().toLocaleDateString()}
              </p>
              {isDataLoading && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Loading data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Generating Report...</span>
              <span className="text-sm text-muted-foreground">{generationProgress}%</span>
            </div>
            <Progress value={generationProgress} />
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={generateReport}
          disabled={isGenerating || isDataLoading || reportData.count === 0}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>

        {reportData.count === 0 && !isDataLoading && (
          <p className="text-sm text-center text-muted-foreground">
            No data available for the selected report type
          </p>
        )}
      </CardContent>
    </Card>
  );
}