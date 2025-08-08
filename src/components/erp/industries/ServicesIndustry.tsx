import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Timer, Users, FileText, Wrench } from 'lucide-react';

export const ServicesIndustry: React.FC = () => {
  const kpis = {
    utilization: 82,
    billableRate: 74,
    openProjects: 18,
    avgSLA: '98.2%'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Professional Services Suite</h2>
        <Button>
          <FolderKanban className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Open Projects</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{kpis.openProjects}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Utilization</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{kpis.utilization}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Billable Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{kpis.billableRate}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">SLA Compliance</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{kpis.avgSLA}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="time">Time & Expense</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="sla">SLAs & FSM</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>Plan, execute and track projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Portfolio View','Cost Tracking','Milestones'].map((f)=> (
                  <div key={f} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2"><FolderKanban className="w-4 h-4" /><span>{f}</span></div>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Time & Expense</CardTitle>
              <CardDescription>Capture billable hours and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col"><Timer className="w-6 h-6 mb-2" /><span>Log Time</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><FileText className="w-6 h-6 mb-2" /><span>Submit Expenses</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><Users className="w-6 h-6 mb-2" /><span>Approve</span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Management</CardTitle>
              <CardDescription>Allocation and capacity planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Advanced scheduling coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla">
          <Card>
            <CardHeader>
              <CardTitle>SLAs & Field Service</CardTitle>
              <CardDescription>Dispatch, service requests, and SLAs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Service Requests','Technician Dispatch','SLA Tracking'].map((f)=> (
                  <div key={f} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2"><Wrench className="w-4 h-4" /><span>{f}</span></div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesIndustry;
