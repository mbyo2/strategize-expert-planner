
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface StrategicChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'pie' | 'area';
  height?: number;
  colors?: string[];
  xAxisKey?: string;
  yAxisKeys?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StrategicChart: React.FC<StrategicChartProps> = ({
  title,
  description,
  data,
  type,
  height = 300,
  colors = COLORS,
  xAxisKey = 'name',
  yAxisKeys = ['value']
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yAxisKeys.map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={colors[index % colors.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yAxisKeys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yAxisKeys.map((key, index) => (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                stackId="1"
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StrategicChart;
