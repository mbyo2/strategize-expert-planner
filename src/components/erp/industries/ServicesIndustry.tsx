import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderKanban, Timer, Users, FileText, Wrench } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const ServicesIndustry: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id || '';
  const { entities: projects, isLoading: l1 } = useERPEntities(orgId, 'services', 'project');
  const { entities: timeEntries, isLoading: l2 } = useERPEntities(orgId, 'services', 'time_entry');
  const { entities: resources, isLoading: l3 } = useERPEntities(orgId, 'services', 'resource');
  const isLoading = l1 || l2 || l3;

  const billableEntries = timeEntries.filter((t: any) => t.entity_data?.billable).length;
  const billableRate = timeEntries.length > 0 ? Math.round((billableEntries / timeEntries.length) * 100) : 0;
  const avgUtilization = resources.length > 0 ? Math.round(resources.reduce((s: number, r: any) => s + (r.entity_data?.utilization || 0), 0) / resources.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Professional Services Suite</h2>
        <Button><FolderKanban className="w-4 h-4 mr-2" />New Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Projects', value: projects.length },
          { label: 'Utilization', value: `${avgUtilization}%` },
          { label: 'Billable Rate', value: `${billableRate}%` },
          { label: 'Resources', value: resources.length },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
            <CardContent>{isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{value}</div>}</CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="time">Time & Expense</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="sla">SLAs & FSM</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card><CardHeader><CardTitle>Project Management</CardTitle><CardDescription>Plan, execute and track projects</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-20 w-full" /> : projects.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground"><FolderKanban className="h-12 w-12 mx-auto mb-4" /><p>No projects found. Create service project entities.</p></div>
              ) : (
                <div className="space-y-2">
                  {projects.slice(0, 5).map((p: any) => {
                    const d = p.entity_data || {};
                    return (
                      <div key={p.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2"><FolderKanban className="w-4 h-4" /><span>{d.name || 'Untitled'}</span></div>
                        <Badge variant="outline">{d.status || 'active'}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time">
          <Card><CardHeader><CardTitle>Time & Expense</CardTitle><CardDescription>Capture billable hours and expenses</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col"><Timer className="w-6 h-6 mb-2" /><span>Log Time</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><FileText className="w-6 h-6 mb-2" /><span>Submit Expenses</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><Users className="w-6 h-6 mb-2" /><span>Approve</span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources"><Card><CardHeader><CardTitle>Resource Management</CardTitle><CardDescription>Allocation and capacity planning</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{resources.length} resources tracked with {avgUtilization}% average utilization.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="sla">
          <Card><CardHeader><CardTitle>SLAs & Field Service</CardTitle><CardDescription>Dispatch, service requests, and SLAs</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Service Requests', 'Technician Dispatch', 'SLA Tracking'].map((f) => (
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