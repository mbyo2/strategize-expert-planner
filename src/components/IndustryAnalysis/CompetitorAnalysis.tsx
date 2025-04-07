
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompetitorData {
  name: string;
  changePercentage: number;
  marketShare: number;
  color: string;
}

const CompetitorAnalysis = () => {
  const competitors: CompetitorData[] = [
    { name: 'Acme Corp', changePercentage: 12, marketShare: 68, color: 'green-500' },
    { name: 'TechGiant Inc', changePercentage: -3, marketShare: 52, color: 'blue-500' },
    { name: 'Future Solutions', changePercentage: 8, marketShare: 45, color: 'purple-500' }
  ];

  return (
    <Card className="banking-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Competitor Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competitors.map((competitor) => (
            <div key={competitor.name}>
              <div className="flex justify-between items-center">
                <span className="font-medium">{competitor.name}</span>
                <div className={`flex items-center text-${competitor.changePercentage >= 0 ? 'green-500' : 'red-500'}`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${competitor.changePercentage < 0 ? 'transform rotate-180' : ''}`} />
                  <span>{competitor.changePercentage >= 0 ? '+' : ''}{competitor.changePercentage}%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                <div className={`h-2 bg-${competitor.color} rounded-full`} style={{ width: `${competitor.marketShare}%` }}></div>
              </div>
            </div>
          ))}
          
          <Button variant="ghost" size="sm" className="mt-2 text-primary hover:text-primary/80 flex items-center">
            View detailed comparison 
            <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorAnalysis;
