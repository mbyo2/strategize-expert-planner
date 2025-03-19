import React from 'react';
import { LineChart, Building, TrendingUp, Scale, PieChart, ChevronRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IndustryMetrics from '../components/IndustryMetrics';

const Industry = () => {
  return (
    <PageLayout 
      title="Industry Analysis" 
      subtitle="Monitor market trends, competitor activities, and industry metrics"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-3 banking-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              Market Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IndustryMetrics />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="banking-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Competitor Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Acme Corp</span>
                <div className="flex items-center text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '68%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">TechGiant Inc</span>
                <div className="flex items-center text-red-500">
                  <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                  <span>-3%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '52%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Future Solutions</span>
                <div className="flex items-center text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+8%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <Button variant="ghost" size="sm" className="mt-2 text-primary hover:text-primary/80">
                View detailed comparison <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 mr-2" />
              SWOT Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Strengths</h4>
                <ul className="text-sm space-y-1 text-green-700 dark:text-green-400/90">
                  <li>• Strong brand recognition</li>
                  <li>• Innovative product pipeline</li>
                  <li>• Experienced leadership team</li>
                </ul>
              </div>
              
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Weaknesses</h4>
                <ul className="text-sm space-y-1 text-red-700 dark:text-red-400/90">
                  <li>• High production costs</li>
                  <li>• Limited international presence</li>
                  <li>• Aging technology infrastructure</li>
                </ul>
              </div>
              
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Opportunities</h4>
                <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-400/90">
                  <li>• Emerging markets in Asia</li>
                  <li>• Strategic acquisition targets</li>
                  <li>• New technology adoption</li>
                </ul>
              </div>
              
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Threats</h4>
                <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-400/90">
                  <li>• Increasing regulations</li>
                  <li>• Aggressive competitor pricing</li>
                  <li>• Economic downturn risks</li>
                </ul>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="mt-4 text-primary hover:text-primary/80">
              Update SWOT analysis <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="banking-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Market Segment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Customer Segments</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Enterprise (45%)</span>
                  <span className="text-sm font-medium">$2.4M</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '45%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">SMB (32%)</span>
                  <span className="text-sm font-medium">$1.7M</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '32%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Consumer (23%)</span>
                  <span className="text-sm font-medium">$1.2M</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Geographic Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">North America (52%)</span>
                  <span className="text-sm font-medium">$2.8M</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full" style={{ width: '52%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Europe (28%)</span>
                  <span className="text-sm font-medium">$1.5M</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '28%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Asia-Pacific (20%)</span>
                  <span className="text-sm font-medium">$1.1M</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 bg-red-500 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Product Categories</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Professional Services (38%)</span>
                  <span className="text-sm font-medium">$2.0M</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 bg-cyan-500 rounded-full" style={{ width: '38%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Software Solutions (42%)</span>
                  <span className="text-sm font-medium">$2.2M</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 bg-orange-500 rounded-full" style={{ width: '42%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Hardware (20%)</span>
                  <span className="text-sm font-medium">$1.1M</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="mt-6 text-primary hover:text-primary/80">
            Download market analysis report <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Industry;
