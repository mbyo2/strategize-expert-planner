
import React from 'react';
import { Briefcase, FileText, Download, Clock, Search, Filter, ChevronRight, Bookmark, Globe } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Resources = () => {
  return (
    <PageLayout 
      title="Strategic Resources" 
      subtitle="Access tools, templates, and best practices for strategic planning"
    >
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            className="pl-9" 
          />
        </div>
        <Button variant="outline" className="whitespace-nowrap">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Strategy Document Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-grow">
                      <h4 className="font-medium">Strategic Plan Template</h4>
                      <p className="text-sm text-muted-foreground mt-1">Comprehensive framework for documenting your strategic plan</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Updated 2 months ago</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                  
                  <li className="flex items-start p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-grow">
                      <h4 className="font-medium">SWOT Analysis Worksheet</h4>
                      <p className="text-sm text-muted-foreground mt-1">Template for conducting a comprehensive SWOT analysis</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Updated 1 month ago</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                  
                  <li className="flex items-start p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-grow">
                      <h4 className="font-medium">OKR Planning Template</h4>
                      <p className="text-sm text-muted-foreground mt-1">Framework for setting objectives and key results</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Updated 3 weeks ago</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                </ul>
                
                <Button variant="ghost" size="sm" className="mt-4 w-full">
                  View all templates <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Industry Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-grow">
                      <h4 className="font-medium">Strategic Planning Handbook</h4>
                      <p className="text-sm text-muted-foreground mt-1">Comprehensive guide to strategic planning methodologies</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Updated 1 month ago</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </li>
                  
                  <li className="flex items-start p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-grow">
                      <h4 className="font-medium">Competitive Analysis Framework</h4>
                      <p className="text-sm text-muted-foreground mt-1">Methods for analyzing and responding to competitors</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Updated 2 weeks ago</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </li>
                  
                  <li className="flex items-start p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-grow">
                      <h4 className="font-medium">Market Expansion Playbook</h4>
                      <p className="text-sm text-muted-foreground mt-1">Step-by-step guide for entering new markets</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Updated 3 months ago</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </li>
                </ul>
                
                <Button variant="ghost" size="sm" className="mt-4 w-full">
                  View all guides <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="banking-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Case Studies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-grow">
                      <h4 className="font-medium">TechCorp Digital Transformation</h4>
                      <p className="text-sm text-muted-foreground mt-1">How TechCorp achieved 35% growth through strategic transformation</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>6 months ago</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                  
                  <li className="flex items-start p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-grow">
                      <h4 className="font-medium">GlobalHealth Market Expansion</h4>
                      <p className="text-sm text-muted-foreground mt-1">Strategic approach to entering 5 new markets in 3 years</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>2 months ago</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                  
                  <li className="flex items-start p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-grow">
                      <h4 className="font-medium">Retail Inc. Operational Excellence</h4>
                      <p className="text-sm text-muted-foreground mt-1">How strategic cost reduction led to 22% margin improvement</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>4 months ago</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                </ul>
                
                <Button variant="ghost" size="sm" className="mt-4 w-full">
                  View all case studies <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-8 banking-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recently Viewed Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Resource</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Last Viewed</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">Strategic Plan Template</td>
                      <td className="py-3 px-4">Template</td>
                      <td className="py-3 px-4">Today, 9:45 AM</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">Competitor Analysis Framework</td>
                      <td className="py-3 px-4">Guide</td>
                      <td className="py-3 px-4">Yesterday, 3:22 PM</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">TechCorp Digital Transformation</td>
                      <td className="py-3 px-4">Case Study</td>
                      <td className="py-3 px-4">3 days ago</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="py-3 px-4">Market Expansion Playbook</td>
                      <td className="py-3 px-4">Guide</td>
                      <td className="py-3 px-4">1 week ago</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Templates Content</h3>
            <p className="text-muted-foreground">Templates tab content would be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="guides">
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Guides Content</h3>
            <p className="text-muted-foreground">Guides tab content would be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="tools">
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Tools Content</h3>
            <p className="text-muted-foreground">Tools tab content would be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="case-studies">
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Case Studies Content</h3>
            <p className="text-muted-foreground">Case studies tab content would be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Resources;
