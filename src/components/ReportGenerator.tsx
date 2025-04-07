
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
  FileType, 
  Download,
  Calendar as CalendarIcon,
  BarChart,
  PieChart,
  LineChart,
  Filter
} from 'lucide-react';
import { toast } from "sonner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';

// Report types and their corresponding icons
const reportTypes = [
  { id: 'strategic', label: 'Strategic Goals', icon: <FileText className="h-4 w-4" /> },
  { id: 'industry', label: 'Industry Analysis', icon: <FileSpreadsheet className="h-4 w-4" /> },
  { id: 'alignment', label: 'Team Alignment', icon: <FileText className="h-4 w-4" /> },
  { id: 'timeline', label: 'Timeline Forecast', icon: <LineChart className="h-4 w-4" /> },
];

// Export formats
const exportFormats = [
  { id: 'pdf', label: 'PDF', icon: <FileType className="h-4 w-4" /> },
  { id: 'csv', label: 'CSV', icon: <FileSpreadsheet className="h-4 w-4" /> },
  { id: 'excel', label: 'Excel', icon: <FileSpreadsheet className="h-4 w-4" /> },
];

// Visualization types
const visualizationTypes = [
  { id: 'table', label: 'Table', icon: <FileText className="h-4 w-4" /> },
  { id: 'bar', label: 'Bar Chart', icon: <BarChart className="h-4 w-4" /> },
  { id: 'pie', label: 'Pie Chart', icon: <PieChart className="h-4 w-4" /> },
  { id: 'line', label: 'Line Chart', icon: <LineChart className="h-4 w-4" /> },
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
      { id: 1, department: "Marketing", alignment: 87, participation: 92, quarter: "Q3 2023" },
      { id: 2, department: "Product", alignment: 93, participation: 88, quarter: "Q3 2023" },
      { id: 3, department: "Sales", alignment: 78, participation: 95, quarter: "Q3 2023" },
      { id: 4, department: "Engineering", alignment: 91, participation: 90, quarter: "Q3 2023" },
    ]
  },
  timeline: {
    title: "Timeline Forecast Report",
    data: [
      { id: 1, month: "Jan", projected: 120, actual: 110, target: 100 },
      { id: 2, month: "Feb", projected: 130, actual: 125, target: 115 },
      { id: 3, month: "Mar", projected: 140, actual: 135, target: 125 },
      { id: 4, month: "Apr", projected: 150, actual: 145, target: 135 },
      { id: 5, month: "May", projected: 160, actual: 155, target: 145 },
      { id: 6, month: "Jun", projected: 170, actual: 165, target: 155 },
    ]
  }
};

// COLORS for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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

const generateExcel = async (data: any, title: string): Promise<void> => {
  // In a real application, you would use a library like xlsx or exceljs
  // For this example, we'll just format CSV with an .xlsx extension
  toast.info("Excel generation would use a library like xlsx in a real application");
  
  // Mock Excel generation delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const csvContent = generateCsv(data, title);
  const filename = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  toast.success(`${title} Excel file generated successfully!`);
};

const generatePdf = async (data: any, title: string): Promise<void> => {
  // In a real application, you would use a library like jsPDF
  // For this example, we'll just show a toast notification
  toast.info("PDF generation would use a library like jsPDF in a real application");
  
  // Mock PDF generation delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  toast.success(`${title} PDF generated successfully!`);
};

// Function to prepare chart data
const prepareChartData = (data: any[], type: string): any[] => {
  if (type === 'alignment') {
    // For alignment data, we just need to ensure numeric values
    return data.map(item => ({
      ...item,
      alignment: typeof item.alignment === 'string' ? parseInt(item.alignment) : item.alignment,
      participation: typeof item.participation === 'string' ? parseInt(item.participation) : item.participation
    }));
  }
  
  if (type === 'timeline') {
    // Timeline data is already in the right format
    return data;
  }
  
  // For other types, we may need to extract numeric values
  return data;
};

interface ReportGeneratorProps {
  triggerClassName?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ triggerClassName }) => {
  const [selectedReportType, setSelectedReportType] = useState('strategic');
  const [selectedExportFormat, setSelectedExportFormat] = useState('pdf');
  const [selectedVisualization, setSelectedVisualization] = useState('table');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterOptions, setFilterOptions] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  
  const handleReportTypeChange = (value: string) => {
    setSelectedReportType(value);
    
    // Reset filter options when changing report type
    const newFilterOptions: Record<string, boolean> = {};
    if (mockReportData[value as keyof typeof mockReportData]?.data?.length > 0) {
      const firstItem = mockReportData[value as keyof typeof mockReportData].data[0];
      Object.keys(firstItem).forEach(key => {
        if (key !== 'id') {
          newFilterOptions[key] = true;
        }
      });
    }
    setFilterOptions(newFilterOptions);
  };
  
  const handleExportFormatChange = (value: string) => {
    setSelectedExportFormat(value);
  };
  
  const handleVisualizationChange = (value: string) => {
    setSelectedVisualization(value);
  };
  
  const toggleFilterOption = (key: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const getFilteredData = () => {
    const reportData = mockReportData[selectedReportType as keyof typeof mockReportData];
    if (!reportData) return [];
    
    // Apply filters - only include columns that are checked
    return reportData.data.map(item => {
      const filteredItem: Record<string, any> = { id: item.id };
      Object.keys(item).forEach(key => {
        if (key !== 'id' && filterOptions[key]) {
          filteredItem[key] = item[key as keyof typeof item];
        }
      });
      return filteredItem;
    });
  };
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      const reportData = mockReportData[selectedReportType as keyof typeof mockReportData];
      const { title, data } = reportData;
      const filename = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}`;
      
      if (selectedExportFormat === 'csv') {
        const csvContent = generateCsv(getFilteredData(), title);
        downloadCsv(csvContent, `${filename}.csv`);
        toast.success(`${title} exported successfully as CSV!`);
      } else if (selectedExportFormat === 'pdf') {
        await generatePdf(getFilteredData(), title);
      } else if (selectedExportFormat === 'excel') {
        await generateExcel(getFilteredData(), title);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const renderVisualization = () => {
    if (selectedVisualization === 'table') {
      return renderTable();
    }
    
    const chartData = prepareChartData(
      mockReportData[selectedReportType as keyof typeof mockReportData].data,
      selectedReportType
    );
    
    if (selectedVisualization === 'bar') {
      return renderBarChart(chartData);
    } else if (selectedVisualization === 'pie') {
      return renderPieChart(chartData);
    } else if (selectedVisualization === 'line') {
      return renderLineChart(chartData);
    }
    
    return null;
  };
  
  const renderTable = () => {
    const reportData = mockReportData[selectedReportType as keyof typeof mockReportData];
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {reportData.data.length > 0 && 
                Object.keys(reportData.data[0])
                  .filter(header => header !== 'id' && filterOptions[header])
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
                  .filter(([key]) => key !== 'id' && filterOptions[key])
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
    );
  };
  
  const renderBarChart = (data: any[]) => {
    if (selectedReportType === 'alignment') {
      return (
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="alignment" fill="#8884d8" name="Alignment %" />
              <Bar dataKey="participation" fill="#82ca9d" name="Participation %" />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      );
    }
    
    if (selectedReportType === 'timeline') {
      return (
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projected" fill="#8884d8" name="Projected" />
              <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
              <Bar dataKey="target" fill="#ffc658" name="Target" />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      );
    }
    
    // For other report types, create a simple bar chart
    const firstDataPoint = data[0];
    const numericFields = Object.keys(firstDataPoint).filter(key => {
      const value = firstDataPoint[key];
      return key !== 'id' && !isNaN(Number(value.toString().replace('%', '')));
    });
    
    if (numericFields.length === 0) {
      return <div className="text-center py-4">No numeric data available for bar chart visualization</div>;
    }
    
    const dataKey = numericFields[0];
    
    return (
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={Object.keys(firstDataPoint).find(key => key !== 'id' && key !== dataKey) || 'name'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#8884d8" />
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderPieChart = (data: any[]) => {
    if (selectedReportType === 'alignment') {
      // Transform alignment data for pie chart
      const pieData = [
        { name: 'Marketing', value: data.find(d => d.department === 'Marketing')?.alignment || 0 },
        { name: 'Product', value: data.find(d => d.department === 'Product')?.alignment || 0 },
        { name: 'Sales', value: data.find(d => d.department === 'Sales')?.alignment || 0 },
        { name: 'Engineering', value: data.find(d => d.department === 'Engineering')?.alignment || 0 },
      ];
      
      return (
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      );
    }
    
    // For other report types, find a suitable numeric field
    const firstDataPoint = data[0];
    const numericFields = Object.keys(firstDataPoint).filter(key => {
      const value = firstDataPoint[key];
      return key !== 'id' && !isNaN(Number(value.toString().replace('%', '')));
    });
    
    if (numericFields.length === 0) {
      return <div className="text-center py-4">No numeric data available for pie chart visualization</div>;
    }
    
    const valueKey = numericFields[0];
    const nameKey = Object.keys(firstDataPoint).find(key => key !== 'id' && key !== valueKey) || 'name';
    
    // Transform data for pie chart
    const pieData = data.map(item => ({
      name: String(item[nameKey]),
      value: Number(String(item[valueKey]).replace('%', ''))
    }));
    
    return (
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RePieChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderLineChart = (data: any[]) => {
    if (selectedReportType === 'timeline') {
      return (
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="projected" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="actual" stroke="#82ca9d" />
              <Line type="monotone" dataKey="target" stroke="#ffc658" strokeDasharray="5 5" />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      );
    }
    
    // Check if we have time-based data for line chart
    const firstDataPoint = data[0];
    const timeFields = Object.keys(firstDataPoint).filter(key => 
      key.includes('date') || key.includes('time') || key.includes('period') || key.includes('quarter')
    );
    
    if (timeFields.length === 0) {
      return <div className="text-center py-4">No time-series data available for line chart visualization</div>;
    }
    
    const timeKey = timeFields[0];
    const valueFields = Object.keys(firstDataPoint).filter(key => {
      const value = firstDataPoint[key];
      return key !== 'id' && key !== timeKey && !isNaN(Number(value.toString().replace('%', '')));
    });
    
    if (valueFields.length === 0) {
      return <div className="text-center py-4">No numeric data available for line chart visualization</div>;
    }
    
    return (
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={timeKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {valueFields.map((field, index) => (
              <Line 
                key={field}
                type="monotone" 
                dataKey={field} 
                stroke={COLORS[index % COLORS.length]} 
                activeDot={{ r: 8 }} 
              />
            ))}
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderFilterOptions = () => {
    if (!mockReportData[selectedReportType as keyof typeof mockReportData]?.data?.length) {
      return null;
    }
    
    const firstItem = mockReportData[selectedReportType as keyof typeof mockReportData].data[0];
    const fields = Object.keys(firstItem).filter(key => key !== 'id');
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <h4 className="text-sm font-medium mb-2">Show/Hide Columns</h4>
          <div className="space-y-2">
            {fields.map(field => (
              <div key={field} className="flex items-center space-x-2">
                <Checkbox 
                  id={`filter-${field}`} 
                  checked={!!filterOptions[field]} 
                  onCheckedChange={() => toggleFilterOption(field)}
                />
                <label htmlFor={`filter-${field}`} className="text-sm cursor-pointer">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
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
      <DialogContent className={`sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[900px] h-[80vh] max-h-[800px] flex flex-col ${isMobile ? 'px-3' : ''}`}>
        <DialogHeader>
          <DialogTitle>Advanced Reporting & Analytics</DialogTitle>
          <DialogDescription>
            Visualize, analyze, and export your strategic data
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 flex-1 overflow-hidden flex flex-col">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Report Type</h4>
            <Tabs
              value={selectedReportType}
              onValueChange={handleReportTypeChange}
              className="w-full"
            >
              <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} mb-2`}>
                {reportTypes.map((type) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className="flex items-center gap-2"
                  >
                    {type.icon}
                    <span className={isMobile ? "hidden" : "inline"}>{type.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                  {visualizationTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedVisualization === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVisualizationChange(type.id)}
                      className="flex items-center gap-1"
                    >
                      {type.icon}
                      <span className={isMobile ? "hidden" : "inline"}>{type.label}</span>
                    </Button>
                  ))}
                </div>
                
                {renderFilterOptions()}
              </div>
              
              <div className="border rounded-md p-4 overflow-auto h-[calc(100%-200px)]">
                <h3 className="font-medium mb-2">
                  {mockReportData[selectedReportType as keyof typeof mockReportData]?.title}
                </h3>
                
                {renderVisualization()}
              </div>
            </Tabs>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex space-x-2 mb-2 sm:mb-0">
            {exportFormats.map((format) => (
              <Button
                key={format.id}
                variant={selectedExportFormat === format.id ? "default" : "outline"}
                onClick={() => handleExportFormatChange(format.id)}
                className="flex items-center gap-2"
                size="sm"
              >
                {format.icon}
                {format.label}
              </Button>
            ))}
          </div>
          
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
