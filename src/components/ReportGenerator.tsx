
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  FileText, 
  FileSpreadsheet, 
  FilePdf, 
  Download,
  Calendar as CalendarIcon
} from 'lucide-react';
import { toast } from "sonner";

// Report types and their corresponding icons
const reportTypes = [
  { id: 'strategic', label: 'Strategic Goals', icon: <FileText className="h-4 w-4" /> },
  { id: 'industry', label: 'Industry Analysis', icon: <FileSpreadsheet className="h-4 w-4" /> },
  { id: 'alignment', label: 'Team Alignment', icon: <FileText className="h-4 w-4" /> },
];

// Export formats
const exportFormats = [
  { id: 'pdf', label: 'PDF', icon: <FilePdf className="h-4 w-4" /> },
  { id: 'csv', label: 'CSV', icon: <FileSpreadsheet className="h-4 w-4" /> },
];

// Mock data for reports
const mockReportData = {
  strategic: {
    title: "Strategic Goals Report",
    data: [
      { id: 1, goal: "Increase market share", progress: "75%", deadline: "2023-12-31", status: "On track" },
      { id: 2, goal: "Launch new product line", progress: "50%", deadline: "2024-03-15", status: "At risk" },
      { id: 3, goal: "Expand to international markets", progress: "25%", deadline: "2024-06-30", status: "Behind" },
      { id: 4, goal: "Improve customer satisfaction", progress: "90%", deadline: "2023-11-30", status: "Completed" },
    ]
  },
  industry: {
    title: "Industry Analysis Report",
    data: [
      { id: 1, metric: "Market Growth", value: "5.2%", trend: "Increasing", period: "Q3 2023" },
      { id: 2, metric: "Competitor Activity", value: "High", trend: "Stable", period: "Q3 2023" },
      { id: 3, metric: "Regulatory Changes", value: "Moderate", trend: "Increasing", period: "Q3 2023" },
      { id: 4, metric: "Supply Chain Status", value: "Optimal", trend: "Improving", period: "Q3 2023" },
    ]
  },
  alignment: {
    title: "Team Alignment Report",
    data: [
      { id: 1, department: "Marketing", alignment: "87%", participation: "92%", quarter: "Q3 2023" },
      { id: 2, department: "Product", alignment: "93%", participation: "88%", quarter: "Q3 2023" },
      { id: 3, department: "Sales", alignment: "78%", participation: "95%", quarter: "Q3 2023" },
      { id: 4, department: "Engineering", alignment: "91%", participation: "90%", quarter: "Q3 2023" },
    ]
  }
};

// Functions to generate different export formats
const generateCsv = (data: any, title: string): string => {
  if (!data || data.length === 0) return '';
  
  // Get headers from first object
  const headers = Object.keys(data[0]).filter(key => key !== 'id');
  const csvHeader = headers.join(',');
  
  // Map data to CSV rows
  const csvRows = data.map((item: any) => {
    return headers.map(header => {
      const value = item[header] || '';
      // Escape commas and quotes in the value
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  return [csvHeader, ...csvRows].join('\n');
};

const downloadCsv = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const generatePdf = async (data: any, title: string): Promise<void> => {
  // In a real application, you would use a library like jsPDF
  // For this example, we'll just show a toast notification
  toast.info("PDF generation would use a library like jsPDF in a real application");
  
  // Mock PDF generation delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  toast.success(`${title} PDF generated successfully!`);
};

interface ReportGeneratorProps {
  triggerClassName?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ triggerClassName }) => {
  const [selectedReportType, setSelectedReportType] = useState('strategic');
  const [selectedExportFormat, setSelectedExportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleReportTypeChange = (value: string) => {
    setSelectedReportType(value);
  };
  
  const handleExportFormatChange = (value: string) => {
    setSelectedExportFormat(value);
  };
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      const reportData = mockReportData[selectedReportType as keyof typeof mockReportData];
      const { title, data } = reportData;
      const filename = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}`;
      
      if (selectedExportFormat === 'csv') {
        const csvContent = generateCsv(data, title);
        downloadCsv(csvContent, `${filename}.csv`);
        toast.success(`${title} exported successfully as CSV!`);
      } else if (selectedExportFormat === 'pdf') {
        await generatePdf(data, title);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={triggerClassName}
        >
          <Download className="h-4 w-4 mr-2" />
          Reports & Exports
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Reports</DialogTitle>
          <DialogDescription>
            Select a report type and preferred export format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Report Type</h4>
            <Tabs
              value={selectedReportType}
              onValueChange={handleReportTypeChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-2">
                {reportTypes.map((type) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className="flex items-center gap-2"
                  >
                    {type.icon}
                    <span className="hidden sm:inline">{type.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(mockReportData).map(([key, reportData]) => (
                <TabsContent key={key} value={key} className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">{reportData.title}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          {reportData.data.length > 0 && 
                            Object.keys(reportData.data[0])
                              .filter(header => header !== 'id')
                              .map(header => (
                                <th key={header} className="py-2 px-3 text-left font-medium">
                                  {header.charAt(0).toUpperCase() + header.slice(1)}
                                </th>
                              ))
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.map((row: any) => (
                          <tr key={row.id} className="border-b">
                            {Object.entries(row)
                              .filter(([key]) => key !== 'id')
                              .map(([key, value]) => (
                                <td key={key} className="py-2 px-3">
                                  {String(value)}
                                </td>
                              ))
                            }
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Export Format</h4>
            <div className="flex space-x-2">
              {exportFormats.map((format) => (
                <Button
                  key={format.id}
                  variant={selectedExportFormat === format.id ? "default" : "outline"}
                  onClick={() => handleExportFormatChange(format.id)}
                  className="flex items-center gap-2"
                >
                  {format.icon}
                  {format.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate & Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportGenerator;
