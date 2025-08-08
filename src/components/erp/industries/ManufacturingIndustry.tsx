import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Factory, ClipboardList, CheckCircle, Wrench, Boxes, Binary, BarChart3 } from 'lucide-react';

export const ManufacturingIndustry: React.FC = () => {
  const metrics = {
    oee: 86,
    defectRate: 1.7,
    wip: 1240,
    linesActive: 7,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manufacturing Industry Suite</h2>
        <Button>
          <ClipboardList className="w-4 h-4 mr-2" />
          Plan Production
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">OEE</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.oee}%</div>
            <Progress value={metrics.oee} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Defect Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.defectRate}%</div>
            <p className="text-xs text-muted-foreground">Quality management</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">WIP</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.wip.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Units in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Active Lines</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.linesActive}</div>
            <p className="text-xs text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>
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
            <CardHeader>
              <CardTitle>Production Planning & Control</CardTitle>
              <CardDescription>Master schedule, MRP, capacity planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <ClipboardList className="w-6 h-6 mb-2" />
                  <span>Create MPS</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <Binary className="w-6 h-6 mb-2" />
                  <span>Run MRP</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span>Capacity Plan</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Quality Management</CardTitle>
              <CardDescription>Inspections, traceability, non-conformance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[{label:'Incoming Inspection',value:92},{label:'In-Process QC',value:96},{label:'Final QA',value:98}].map((q)=> (
                  <div key={q.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{q.label}</span>
                      <span>{q.value}%</span>
                    </div>
                    <Progress value={q.value} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mes">
          <Card>
            <CardHeader>
              <CardTitle>Manufacturing Execution (MES)</CardTitle>
              <CardDescription>Real-time shop floor monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Live dashboards coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plm">
          <Card>
            <CardHeader>
              <CardTitle>PLM Integration</CardTitle>
              <CardDescription>Sync BOMs and engineering changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">PLM connectors coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManufacturingIndustry;
