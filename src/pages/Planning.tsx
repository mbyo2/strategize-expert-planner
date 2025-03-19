
import React from 'react';
import { LayoutDashboard, Compass, Flag, Calendar, Lightbulb, Users, ChevronRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Planning = () => {
  return (
    <PageLayout 
      title="Strategic Planning" 
      subtitle="Develop, track, and refine your organization's strategic initiatives"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 banking-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Compass className="h-5 w-5 mr-2" />
              Vision & Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-6 border border-border rounded-lg bg-muted/10">
                <h3 className="text-lg font-medium mb-3">Our Vision</h3>
                <p className="text-muted-foreground">To become the leading provider of innovative solutions that transform how organizations operate and deliver value to their customers.</p>
              </div>
              
              <div className="p-6 border border-border rounded-lg bg-muted/10">
                <h3 className="text-lg font-medium mb-3">Our Mission</h3>
                <p className="text-muted-foreground">We empower organizations with cutting-edge tools and strategies that drive sustainable growth, operational excellence, and customer satisfaction through a commitment to innovation, quality, and exceptional service.</p>
              </div>
              
              <Button variant="outline" className="w-full">
                Review & Update Vision/Mission <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flag className="h-5 w-5 mr-2" />
              Strategic Pillars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border border-primary/20 bg-primary/5 rounded-md">
                <h4 className="font-medium text-primary mb-1">Market Leadership</h4>
                <p className="text-sm text-muted-foreground">Drive innovation and capture market share through differentiated offerings</p>
              </div>
              
              <div className="p-3 border border-primary/20 bg-primary/5 rounded-md">
                <h4 className="font-medium text-primary mb-1">Operational Excellence</h4>
                <p className="text-sm text-muted-foreground">Optimize processes and infrastructure to deliver superior customer experiences</p>
              </div>
              
              <div className="p-3 border border-primary/20 bg-primary/5 rounded-md">
                <h4 className="font-medium text-primary mb-1">Talent Development</h4>
                <p className="text-sm text-muted-foreground">Invest in our people to build capabilities that drive business success</p>
              </div>
              
              <div className="p-3 border border-primary/20 bg-primary/5 rounded-md">
                <h4 className="font-medium text-primary mb-1">Sustainable Growth</h4>
                <p className="text-sm text-muted-foreground">Achieve long-term growth through responsible business practices</p>
              </div>
              
              <Button variant="ghost" size="sm" className="w-full mt-2">
                Edit Strategic Pillars
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="banking-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Strategic Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-8 space-y-6 before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-border">
              <div className="relative">
                <div className="absolute top-1 left-[-24px] h-5 w-5 rounded-full bg-primary"></div>
                <h4 className="font-medium">Q4 2023: Strategy Formulation</h4>
                <p className="text-sm text-muted-foreground mt-1">Analyze market conditions, set objectives, and define action plans</p>
              </div>
              
              <div className="relative">
                <div className="absolute top-1 left-[-24px] h-5 w-5 rounded-full bg-primary/60"></div>
                <h4 className="font-medium">Q1 2024: Resource Allocation</h4>
                <p className="text-sm text-muted-foreground mt-1">Budget approval, team formation, technology preparation</p>
              </div>
              
              <div className="relative">
                <div className="absolute top-1 left-[-24px] h-5 w-5 rounded-full bg-primary/40"></div>
                <h4 className="font-medium">Q2-Q3 2024: Implementation</h4>
                <p className="text-sm text-muted-foreground mt-1">Execute initiatives, monitor progress, make adjustments</p>
              </div>
              
              <div className="relative">
                <div className="absolute top-1 left-[-24px] h-5 w-5 rounded-full bg-primary/20"></div>
                <h4 className="font-medium">Q4 2024: Evaluation & Refinement</h4>
                <p className="text-sm text-muted-foreground mt-1">Measure outcomes, identify lessons learned, refine approach</p>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="mt-4 text-primary hover:text-primary/80">
              Adjust timeline <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="banking-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Strategic Initiatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-md border">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Digital Transformation</h4>
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">On Track</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Modernize core systems and implement automation</p>
                <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full">
                  <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="p-3 rounded-md border">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Market Expansion</h4>
                  <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">Delayed</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Enter new geographic markets in APAC region</p>
                <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full">
                  <div className="h-1.5 bg-yellow-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              
              <div className="p-3 rounded-md border">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Product Innovation</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">Planning</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Develop next-gen solution with AI capabilities</p>
                <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full">
                  <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="mt-2 text-primary hover:text-primary/80 w-full">
                Manage strategic initiatives <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="banking-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Stakeholder Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">High Influence, High Interest</h4>
              <div className="space-y-2">
                <div className="p-2 bg-primary/10 rounded border border-primary/20">
                  <p className="font-medium">Board of Directors</p>
                  <p className="text-xs text-muted-foreground">Key strategic decisions and governance</p>
                </div>
                <div className="p-2 bg-primary/10 rounded border border-primary/20">
                  <p className="font-medium">Executive Team</p>
                  <p className="text-xs text-muted-foreground">Implementation leadership and accountability</p>
                </div>
                <div className="p-2 bg-primary/10 rounded border border-primary/20">
                  <p className="font-medium">Key Customers</p>
                  <p className="text-xs text-muted-foreground">Revenue impact and market validation</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Low Influence, High Interest</h4>
              <div className="space-y-2">
                <div className="p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-900/30">
                  <p className="font-medium">Employees</p>
                  <p className="text-xs text-muted-foreground">Strategy execution and implementation</p>
                </div>
                <div className="p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-900/30">
                  <p className="font-medium">Industry Analysts</p>
                  <p className="text-xs text-muted-foreground">Market perception and reputation</p>
                </div>
                <div className="p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-900/30">
                  <p className="font-medium">Small Partners</p>
                  <p className="text-xs text-muted-foreground">Distribution and implementation support</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">High Influence, Low Interest</h4>
              <div className="space-y-2">
                <div className="p-2 bg-yellow-100/50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-900/30">
                  <p className="font-medium">Regulators</p>
                  <p className="text-xs text-muted-foreground">Compliance requirements and limitations</p>
                </div>
                <div className="p-2 bg-yellow-100/50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-900/30">
                  <p className="font-medium">Investors</p>
                  <p className="text-xs text-muted-foreground">Financial resources and expectations</p>
                </div>
                <div className="p-2 bg-yellow-100/50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-900/30">
                  <p className="font-medium">Media</p>
                  <p className="text-xs text-muted-foreground">Public perception and communication</p>
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="mt-6 text-primary hover:text-primary/80">
            Edit stakeholder map <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Planning;
