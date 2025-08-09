import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HardHat, ClipboardList, Truck, ShieldCheck, Building2, Hammer, FileText } from 'lucide-react';

const ConstructionIndustry: React.FC = () => {
  return (
    <section aria-labelledby="construction-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="construction-erp-heading" className="text-2xl font-bold">Construction Suite</h2>
          <p className="text-muted-foreground">
            Plan and control projects, procurement, quality, and safety across sites
          </p>
        </div>
        <Button variant="default" size="sm">
          <FileText className="mr-2 h-4 w-4" /> New RFI
        </Button>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open RFIs</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Issues</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <Hammer className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Safety Incidents (30d)</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections */}
      <Tabs defaultValue="projects">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>Scheduling, tasks, and cost tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">Current Schedule</h3>
                  <p className="text-sm text-muted-foreground">Gantt and milestones overview (demo data)</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Cost Performance</h3>
                  <p className="text-sm text-muted-foreground">Budget vs actuals with variance alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procurement">
          <Card>
            <CardHeader>
              <CardTitle>Procurement & Subcontractors</CardTitle>
              <CardDescription>Purchase orders, quotes, and vendor compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Open POs</div>
                  <div className="text-xl font-semibold">15</div>
                </div>
                <Truck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Equipment & Assets</CardTitle>
              <CardDescription>Utilization and preventive maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track rentals, allocation, and maintenance schedules.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Quality & Inspections</CardTitle>
              <CardDescription>Checklists, NCRs, and material tests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Record inspections and manage quality deviations.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Safety</CardTitle>
              <CardDescription>Permits, certifications, and jobsite safety</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track permits, training, and incident logs.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ConstructionIndustry;
