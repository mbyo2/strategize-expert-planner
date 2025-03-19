import React from 'react';
import { Target, ChevronRight, Check, ArrowUpRight, Circle, Clock, AlertCircle } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Goals = () => {
  return (
    <PageLayout 
      title="Strategic Goals" 
      subtitle="Set, track, and achieve your organization's key objectives"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-1" /> All
          </Button>
          <Button variant="outline" size="sm">
            <Check className="h-4 w-4 mr-1" /> Completed
          </Button>
          <Button variant="outline" size="sm">
            <Circle className="h-4 w-4 mr-1" /> In Progress
          </Button>
          <Button variant="outline" size="sm">
            <AlertCircle className="h-4 w-4 mr-1" /> At Risk
          </Button>
        </div>
        <Button>
          <Target className="h-4 w-4 mr-1" /> Add New Goal
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="banking-card">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Increase Market Share to 25%
              </CardTitle>
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                On Track
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">72%</span>
              </div>
              <Progress value={72} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Start Date</span>
                  <p className="text-sm font-medium">Jan 15, 2023</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Target Date</span>
                  <p className="text-sm font-medium">Dec 31, 2023</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Owner</span>
                  <p className="text-sm font-medium">Sarah Johnson</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Strategic Pillar</span>
                  <p className="text-sm font-medium">Market Leadership</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Key Results</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Launch new product in premium segment (Complete)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Expand sales team by 15% (Complete)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Circle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">Secure 3 enterprise reference customers (2/3 Complete)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Circle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">Implement partner certification program (In Progress)</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button variant="ghost" size="sm">
                  View Details <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                Achieve 95% Customer Satisfaction Rating
              </CardTitle>
              <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">
                At Risk
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Start Date</span>
                  <p className="text-sm font-medium">Feb 1, 2023</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Target Date</span>
                  <p className="text-sm font-medium">Dec 31, 2023</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Owner</span>
                  <p className="text-sm font-medium">Michael Chen</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Strategic Pillar</span>
                  <p className="text-sm font-medium">Operational Excellence</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Key Results</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Implement new customer feedback system (Complete)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Circle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">Reduce average support response time to < 2 hours (In Progress)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span className="text-sm">Achieve 90% first-contact resolution (Blocked)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Circle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">Launch customer success program for top accounts (In Progress)</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button variant="ghost" size="sm">
                  View Details <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                Reduce Operating Costs by 15%
              </CardTitle>
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                In Progress
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">58%</span>
              </div>
              <Progress value={58} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Start Date</span>
                  <p className="text-sm font-medium">Mar 10, 2023</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Target Date</span>
                  <p className="text-sm font-medium">Feb 28, 2024</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Owner</span>
                  <p className="text-sm font-medium">David Wilson</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Strategic Pillar</span>
                  <p className="text-sm font-medium">Operational Excellence</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Key Results</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Consolidate office locations (Complete)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Implement new procurement system (Complete)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Circle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">Automate key operational processes (In Progress)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Circle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-sm">Renegotiate key vendor contracts (In Progress)</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button variant="ghost" size="sm">
                  View Details <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Launch Innovation Lab
              </CardTitle>
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                Completed
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">100%</span>
              </div>
              <Progress value={100} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Start Date</span>
                  <p className="text-sm font-medium">Jan 5, 2023</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Target Date</span>
                  <p className="text-sm font-medium">Sep 30, 2023</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Owner</span>
                  <p className="text-sm font-medium">Jessica Martinez</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Strategic Pillar</span>
                  <p className="text-sm font-medium">Innovation</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Key Results</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Secure budget approval (Complete)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Hire innovation team lead (Complete)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Setup physical lab space (Complete)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Launch first innovation challenge (Complete)</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button variant="ghost" size="sm">
                  View Details <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" size="sm">
          <ArrowUpRight className="h-4 w-4 mr-1" /> Load More Goals
        </Button>
      </div>
    </PageLayout>
  );
};

export default Goals;
