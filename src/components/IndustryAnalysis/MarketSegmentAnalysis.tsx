
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SegmentData {
  name: string;
  percentage: number;
  value: string;
  color: string;
}

const MarketSegmentAnalysis = () => {
  const segments = {
    customer: [
      { name: 'Enterprise (45%)', percentage: 45, value: '$2.4M', color: 'primary' },
      { name: 'SMB (32%)', percentage: 32, value: '$1.7M', color: 'blue-500' },
      { name: 'Consumer (23%)', percentage: 23, value: '$1.2M', color: 'green-500' }
    ],
    geographic: [
      { name: 'North America (52%)', percentage: 52, value: '$2.8M', color: 'purple-500' },
      { name: 'Europe (28%)', percentage: 28, value: '$1.5M', color: 'yellow-500' },
      { name: 'Asia-Pacific (20%)', percentage: 20, value: '$1.1M', color: 'red-500' }
    ],
    product: [
      { name: 'Professional Services (38%)', percentage: 38, value: '$2.0M', color: 'cyan-500' },
      { name: 'Software Solutions (42%)', percentage: 42, value: '$2.2M', color: 'orange-500' },
      { name: 'Hardware (20%)', percentage: 20, value: '$1.1M', color: 'indigo-500' }
    ]
  };

  const renderSegmentGroup = (title: string, data: SegmentData[]) => (
    <div className="space-y-3">
      <h4 className="font-medium">{title}</h4>
      <div className="space-y-2">
        {data.map((segment, idx) => (
          <div key={idx}>
            <div className="flex justify-between">
              <span className="text-sm">{segment.name}</span>
              <span className="text-sm font-medium">{segment.value}</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div className={`h-2 bg-${segment.color} rounded-full`} style={{ width: `${segment.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="banking-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="h-5 w-5 mr-2" />
          Market Segment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderSegmentGroup('Customer Segments', segments.customer)}
          {renderSegmentGroup('Geographic Distribution', segments.geographic)}
          {renderSegmentGroup('Product Categories', segments.product)}
        </div>
        
        <Button variant="ghost" size="sm" className="mt-6 text-primary hover:text-primary/80 flex items-center">
          Download market analysis report
          <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MarketSegmentAnalysis;
