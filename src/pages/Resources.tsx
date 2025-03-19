
import React, { useState } from 'react';
import { Briefcase, FileText, Download, Clock, Search, Filter, ChevronRight, Bookmark, Globe, Plus, BarChart, Users, Percent, CheckCircle } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Resource allocation data
const resourceAllocationData = [
  { id: 1, name: 'Market Research Project', team: 'Research', allocation: 65, status: 'In Progress' },
  { id: 2, name: 'Product Development Initiative', team: 'Engineering', allocation: 80, status: 'Active' },
  { id: 3, name: 'Sales Team Expansion', team: 'Sales', allocation: 40, status: 'Planning' },
  { id: 4, name: 'Customer Experience Improvement', team: 'Customer Success', allocation: 50, status: 'In Progress' },
  { id: 5, name: 'Digital Marketing Campaign', team: 'Marketing', allocation: 90, status: 'Active' },
];

// Resource team members data
const teamMembers = [
  { id: 1, name: 'Alex Johnson', role: 'Research Analyst', allocation: 85, projects: 3 },
  { id: 2, name: 'Jamie Smith', role: 'Product Manager', allocation: 70, projects: 2 },
  { id: 3, name: 'Casey Williams', role: 'Marketing Specialist', allocation: 90, projects: 2 },
  { id: 4, name: 'Taylor Brown', role: 'Software Engineer', allocation: 75, projects: 3 },
  { id: 5, name: 'Morgan Davis', role: 'UX Designer', allocation: 60, projects: 2 },
];

const Resources = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [allocateDialogOpen, setAllocateDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);

  // Form setup for resource allocation
  const allocateForm = useForm({
    defaultValues: {
      allocation: '',
      notes: '',
    }
  });

  const onSubmitAllocation = (data: any) => {
    // In a real application, this would update the resource allocation in the database
    toast.success(`Updated allocation for ${selectedResource?.name} to ${data.allocation}%`);
    setAllocateDialogOpen(false);
    allocateForm.reset();
  };

  const handleAllocateClick = (resource: any) => {
    setSelectedResource(resource);
    allocateForm.setValue('allocation', resource.allocation.toString());
    setAllocateDialogOpen(true);
  };

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

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="allocation">Resource Allocation</TabsTrigger>
          <TabsTrigger value="team">Team Resources</TabsTrigger>
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

        {/* Resource Allocation Tab */}
        <TabsContent value="allocation">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-medium">Resource Allocation Tracking</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Resource
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Resource Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Research Team</span>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Engineering Team</span>
                      <span className="text-sm text-muted-foreground">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Marketing Team</span>
                      <span className="text-sm text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Sales Team</span>
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Customer Success</span>
                      <span className="text-sm text-muted-foreground">50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Percent className="h-5 w-5 mr-2" />
                  Allocation by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium">Active</span>
                      </div>
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                    <Progress value={40} className="h-2" indicatorClassName="bg-green-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm font-medium">In Progress</span>
                      </div>
                      <span className="text-sm text-muted-foreground">35%</span>
                    </div>
                    <Progress value={35} className="h-2" indicatorClassName="bg-blue-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm font-medium">Planning</span>
                      </div>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                    <Progress value={15} className="h-2" indicatorClassName="bg-yellow-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-gray-400 mr-2"></div>
                        <span className="text-sm font-medium">On Hold</span>
                      </div>
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                    <Progress value={10} className="h-2" indicatorClassName="bg-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Resource Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">85%</p>
                    <p className="text-sm text-muted-foreground">Team Utilization</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Departments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Resource Allocation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resourceAllocationData.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.name}</TableCell>
                      <TableCell>{resource.team}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={resource.allocation} className="h-2 w-20" />
                          <span>{resource.allocation}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          resource.status === 'Active' ? 'bg-green-100 text-green-700' :
                          resource.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          resource.status === 'Planning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {resource.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAllocateClick(resource)}
                        >
                          Update Allocation
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Resources Tab */}
        <TabsContent value="team">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-medium">Team Resource Management</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Allocation</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={member.allocation} 
                            className="h-2 w-20" 
                            indicatorClassName={`${
                              member.allocation > 90 ? 'bg-red-500' : 
                              member.allocation > 75 ? 'bg-orange-500' : 
                              'bg-green-500'
                            }`} 
                          />
                          <span>{member.allocation}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.projects}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resource Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[160px] items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-1">75%</p>
                    <p className="text-sm text-muted-foreground">Development</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resource Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[160px] items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-1">60%</p>
                    <p className="text-sm text-muted-foreground">Marketing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resource Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[160px] items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-1">45%</p>
                    <p className="text-sm text-muted-foreground">Research</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resource Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[160px] items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-1">30%</p>
                    <p className="text-sm text-muted-foreground">Operations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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

      {/* Resource Allocation Dialog */}
      <Dialog open={allocateDialogOpen} onOpenChange={setAllocateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Resource Allocation</DialogTitle>
            <DialogDescription>
              {selectedResource && `Current allocation for ${selectedResource.name} is ${selectedResource.allocation}%`}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...allocateForm}>
            <form onSubmit={allocateForm.handleSubmit(onSubmitAllocation)} className="space-y-4">
              <FormField
                control={allocateForm.control}
                name="allocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocation Percentage</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={allocateForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any notes about this resource allocation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAllocateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Resources;
