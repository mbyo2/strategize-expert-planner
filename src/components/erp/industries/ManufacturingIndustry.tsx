import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Factory, ClipboardList, CheckCircle, Wrench, Boxes, Binary, BarChart3 } from 'lucide-react';
import { useManufacturingMetrics } from '@/hooks/useERPMetrics';
import { useOrganizations } from '@/hooks/useOrganizations';

export const ManufacturingIndustry: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id || '';
  const { metrics, isLoading } = useManufacturingMetrics(orgId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manufacturing Industry Suite</h2>
        <Button><ClipboardList className="w-4 h-4 mr-2" />Plan Production</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'OEE', value: `${metrics.efficiency}%`, icon: Factory, showProgress: true, progressVal: metrics.efficiency },
          { label: 'Quality Rate', value: `${metrics.qualityRate}%`, icon: CheckCircle },
          { label: 'WIP', value: metrics.totalProduction.toLocaleString(), icon: Boxes },
          { label: 'Active Lines', value: `${metrics.activeLines}/${metrics.totalLines}`, icon: Wrench },
        ].map(({ label, value, icon: Icon, showProgress, progressVal }) => (
          <Card key={label}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : (
                <>
                  <div className="text-2xl font-bold">{value}</div>
                  {showProgress && <Progress value={progressVal} className="mt-2" />}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="planning" className="space-y-4">
        <TabsList>
          <TabsTrigger value="planning">Planning (MPS/MRP)</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="mes">MES</TabsTrigger>
          <TabsTrigger value="plm">PLM</TabsTrigger>
        </TabsList>

        <TabsContent value="planning">
          <Card>
            <CardHeader><CardTitle>Production Planning & Control</CardTitle><CardDescription>Master schedule, MRP, capacity planning</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-20 w-full" /> : metrics.workOrders.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground"><Factory className="h-12 w-12 mx-auto mb-4" /><p>No work orders found. Create manufacturing entities to get started.</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="p-6 h-auto flex-col"><ClipboardList className="w-6 h-6 mb-2" /><span>Create MPS</span></Button>
                  <Button variant="outline" className="p-6 h-auto flex-col"><Binary className="w-6 h-6 mb-2" /><span>Run MRP</span></Button>
                  <Button variant="outline" className="p-6 h-auto flex-col"><BarChart3 className="w-6 h-6 mb-2" /><span>Capacity Plan</span></Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader><CardTitle>Quality Management</CardTitle><CardDescription>Inspections, traceability, non-conformance</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-20 w-full" /> : (
                <div className="space-y-3">
                  {[
                    { label: 'Incoming Inspection', value: metrics.qualityRate },
                    { label: 'In-Process QC', value: Math.min(100, metrics.qualityRate + 4) },
                    { label: 'Final QA', value: Math.min(100, metrics.qualityRate + 2) },
                  ].map((q) => (
                    <div key={q.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{q.label}</span><span>{q.value}%</span>
                      </div>
                      <Progress value={q.value} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mes"><Card><CardHeader><CardTitle>Manufacturing Execution (MES)</CardTitle><CardDescription>Real-time shop floor monitoring</CardDescription></CardHeader><CardContent><div className="text-sm text-muted-foreground">Live dashboards coming soon</div></CardContent></Card></TabsContent>
        <TabsContent value="plm"><Card><CardHeader><CardTitle>PLM Integration</CardTitle><CardDescription>Sync BOMs and engineering changes</CardDescription></CardHeader><CardContent><div className="text-sm text-muted-foreground">PLM connectors coming soon</div></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
};

export default ManufacturingIndustry;