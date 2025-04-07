
import React, { useState } from 'react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import {
  Line,
  LineChart as RechartsLineChart,
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { Skeleton } from '@/components/ui/skeleton';
import { useRealTimeIndustryMetrics } from '@/hooks/useRealTimeIndustryMetrics';

const chartConfig = {
  yourCompany: { label: 'Your Company', color: '#3b82f6' },
  competitor1: { label: 'Competitor 1', color: '#ef4444' },
  competitor2: { label: 'Competitor 2', color: '#10b981' },
  competitor3: { label: 'Competitor 3', color: '#f59e0b' },
};

const IndustryMetrics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('6months');
  const { metrics, loading, error } = useRealTimeIndustryMetrics();
  
  // Process data for charts
  const marketShareData = metrics
    .filter(metric => metric.category === 'Competition')
    .map(metric => ({
      month: new Date(metric.updated_at).toLocaleString('default', { month: 'short' }),
      yourCompany: metric.name === 'Your Market Share' ? metric.value : null,
      competitor1: metric.name === 'Competitor Market Share' ? metric.value : null,
      competitor2: metric.name === 'Secondary Competitor Share' ? metric.value : null,
      competitor3: metric.name === 'Tertiary Competitor Share' ? metric.value : null,
    }));

  const industryGrowthData = metrics
    .filter(metric => metric.category === 'Market' || metric.category === 'Financial')
    .map(metric => ({
      category: metric.name,
      growth: metric.change_percentage || 0,
    }));

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-[150px]" />
        </div>
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Failed to load industry metrics</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Industry Performance</h3>
        <Select defaultValue={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[350px] rounded-lg border"
      >
        <ResizablePanel defaultSize={60}>
          <div className="p-4 h-full">
            <h4 className="text-sm font-medium mb-2">Market Share Trends</h4>
            <div className="h-[300px]">
              {marketShareData.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="w-full h-full"
                >
                  <RechartsLineChart data={marketShareData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="yourCompany" stroke={chartConfig.yourCompany.color} strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="competitor1" stroke={chartConfig.competitor1.color} />
                    <Line type="monotone" dataKey="competitor2" stroke={chartConfig.competitor2.color} />
                    <Line type="monotone" dataKey="competitor3" stroke={chartConfig.competitor3.color} />
                  </RechartsLineChart>
                </ChartContainer>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No market share data available
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40}>
          <div className="p-4 h-full">
            <h4 className="text-sm font-medium mb-2">Category Growth Rates</h4>
            <div className="h-[300px]">
              {industryGrowthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={industryGrowthData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="growth" 
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      label={{
                        position: 'top',
                        formatter: (value: number) => `${value}%`,
                        fontSize: 12
                      }}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No growth rate data available
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default IndustryMetrics;
