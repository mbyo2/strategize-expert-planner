
import React from 'react';
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

const marketShareData = [
  { month: 'Jan', yourCompany: 18, competitor1: 22, competitor2: 15, competitor3: 12 },
  { month: 'Feb', yourCompany: 19, competitor1: 21, competitor2: 15, competitor3: 13 },
  { month: 'Mar', yourCompany: 20, competitor1: 20, competitor2: 16, competitor3: 13 },
  { month: 'Apr', yourCompany: 21, competitor1: 19, competitor2: 16, competitor3: 14 },
  { month: 'May', yourCompany: 22, competitor1: 19, competitor2: 15, competitor3: 14 },
  { month: 'Jun', yourCompany: 23, competitor1: 18, competitor2: 14, competitor3: 15 },
];

const industryGrowthData = [
  { category: 'Product A', growth: 12 },
  { category: 'Product B', growth: 18 },
  { category: 'Product C', growth: -4 },
  { category: 'Product D', growth: 8 },
  { category: 'Product E', growth: 5 },
];

const chartConfig = {
  yourCompany: { label: 'Your Company', color: '#3b82f6' },
  competitor1: { label: 'Competitor 1', color: '#ef4444' },
  competitor2: { label: 'Competitor 2', color: '#10b981' },
  competitor3: { label: 'Competitor 3', color: '#f59e0b' },
};

const IndustryMetrics: React.FC = () => {
  const [timeframe, setTimeframe] = React.useState('6months');
  
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
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40}>
          <div className="p-4 h-full">
            <h4 className="text-sm font-medium mb-2">Category Growth Rates</h4>
            <div className="h-[300px]">
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
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default IndustryMetrics;
