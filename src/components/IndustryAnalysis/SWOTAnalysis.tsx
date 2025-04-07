
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SWOTData {
  type: 'strengths' | 'weaknesses' | 'opportunities' | 'threats';
  title: string;
  color: string;
  items: string[];
}

const SWOTAnalysis = () => {
  const swotData: SWOTData[] = [
    {
      type: 'strengths',
      title: 'Strengths',
      color: 'green',
      items: [
        'Strong brand recognition',
        'Innovative product pipeline',
        'Experienced leadership team'
      ]
    },
    {
      type: 'weaknesses',
      title: 'Weaknesses',
      color: 'red',
      items: [
        'High production costs',
        'Limited international presence',
        'Aging technology infrastructure'
      ]
    },
    {
      type: 'opportunities',
      title: 'Opportunities',
      color: 'blue',
      items: [
        'Emerging markets in Asia',
        'Strategic acquisition targets',
        'New technology adoption'
      ]
    },
    {
      type: 'threats',
      title: 'Threats',
      color: 'yellow',
      items: [
        'Increasing regulations',
        'Aggressive competitor pricing',
        'Economic downturn risks'
      ]
    }
  ];

  return (
    <Card className="banking-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scale className="h-5 w-5 mr-2" />
          SWOT Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {swotData.map((section) => (
            <div key={section.type} className={`bg-${section.color}-100 dark:bg-${section.color}-900/20 p-3 rounded-lg`}>
              <h4 className={`font-semibold text-${section.color}-700 dark:text-${section.color}-400 mb-2`}>
                {section.title}
              </h4>
              <ul className={`text-sm space-y-1 text-${section.color}-700 dark:text-${section.color}-400/90`}>
                {section.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Button variant="ghost" size="sm" className="mt-4 text-primary hover:text-primary/80 flex items-center">
          Update SWOT analysis
          <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SWOTAnalysis;
