import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, Droplet, Wind, Wrench, Building2 } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

const EnergyUtilitiesIndustry: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id || '';
  const { entities: outages, isLoading: l1 } = useERPEntities(orgId, 'energy', 'outage');
  const { entities: assets, isLoading: l2 } = useERPEntities(orgId, 'energy', 'asset');
  const { entities: workOrders, isLoading: l3 } = useERPEntities(orgId, 'energy', 'work_order');
  const isLoading = l1 || l2 || l3;

  const activeOutages = outages.filter((o: any) => o.entity_data?.status === 'active').length;
  const renewableAssets = assets.filter((a: any) => a.entity_data?.type === 'renewable').length;
  const renewableShare = assets.length > 0 ? Math.round((renewableAssets / assets.length) * 100) : 0;

  return (
    <section aria-labelledby="energy-utilities-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="energy-utilities-erp-heading" className="text-2xl font-bold">Energy & Utilities Suite</h2>
          <p className="text-muted-foreground">Manage grid assets, maintenance, distribution, sustainability, and compliance</p>
        </div>
        <Button variant="default" size="sm"><Wrench className="mr-2 h-4 w-4" /> Create Work Order</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Outages', value: activeOutages, icon: Zap },
          { label: 'Grid Assets', value: assets.length, icon: Building2 },
          { label: 'Renewable Share', value: `${renewableShare}%`, icon: Wind },
          { label: 'Open Work Orders', value: workOrders.length, icon: Droplet },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{value}</p>}
                </div>
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="assets">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="assets"><Card><CardHeader><CardTitle>Asset Management</CardTitle><CardDescription>Transformers, lines, meters, and plants</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : assets.length === 0 ? <p className="text-sm text-muted-foreground p-4 text-center">No assets found. Add energy assets to get started.</p> : <p className="text-sm text-muted-foreground">{assets.length} assets tracked across your infrastructure.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="work-orders"><Card><CardHeader><CardTitle>Maintenance & Work Orders</CardTitle><CardDescription>Preventive, corrective, and emergency work</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{workOrders.length} work orders in system.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="distribution"><Card><CardHeader><CardTitle>Distribution & Outage</CardTitle><CardDescription>Load management and restoration</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Monitor grid load and accelerate restoration with priority rules.</p></CardContent></Card></TabsContent>
        <TabsContent value="sustainability"><Card><CardHeader><CardTitle>Sustainability</CardTitle><CardDescription>Renewables integration and emissions</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Track renewable generation, emissions, and ESG reporting.</p></CardContent></Card></TabsContent>
        <TabsContent value="compliance"><Card><CardHeader><CardTitle>Compliance & Safety</CardTitle><CardDescription>Regulatory audits and safety checks</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Maintain documentation and ensure regulatory readiness.</p></CardContent></Card></TabsContent>
      </Tabs>
    </section>
  );
};

export default EnergyUtilitiesIndustry;