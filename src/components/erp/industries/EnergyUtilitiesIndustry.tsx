import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Zap, Droplet, Wind, Wrench, ShieldCheck, Building2 } from 'lucide-react';

const EnergyUtilitiesIndustry: React.FC = () => {
  return (
    <section aria-labelledby="energy-utilities-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="energy-utilities-erp-heading" className="text-2xl font-bold">Energy & Utilities Suite</h2>
          <p className="text-muted-foreground">
            Manage grid assets, maintenance, distribution, sustainability, and compliance
          </p>
        </div>
        <Button variant="default" size="sm">
          <Wrench className="mr-2 h-4 w-4" /> Create Work Order
        </Button>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Outages</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Grid Stability</p>
                <p className="text-2xl font-bold">99.7%</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Renewable Share</p>
                <p className="text-2xl font-bold">42%</p>
              </div>
              <Wind className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Water Production</p>
                <p className="text-2xl font-bold">1.2M m³</p>
              </div>
              <Droplet className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections */}
      <Tabs defaultValue="assets">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Asset Management</CardTitle>
              <CardDescription>Transformers, lines, meters, and plants</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track health, lifecycle, and performance of critical infrastructure.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work-orders">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance & Work Orders</CardTitle>
              <CardDescription>Preventive, corrective, and emergency work</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Plan, schedule, and dispatch field crews with SLA monitoring.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Distribution & Outage</CardTitle>
              <CardDescription>Load management and restoration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Monitor grid load and accelerate restoration with priority rules.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability</CardTitle>
              <CardDescription>Renewables integration and emissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track renewable generation, emissions, and ESG reporting.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Safety</CardTitle>
              <CardDescription>Regulatory audits and safety checks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Maintain documentation and ensure regulatory readiness.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default EnergyUtilitiesIndustry;
