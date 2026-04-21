import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Cpu, Rocket, AlertTriangle, Users } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganization } from '@/contexts/OrganizationContext';
import IndustryStarterPanel from './IndustryStarterPanel';

const TechnologyIndustry: React.FC = () => {
  const { organizationId } = useOrganization();
  const orgId = organizationId || '';
  const { entities: products, isLoading: l1 } = useERPEntities(orgId, 'technology', 'product');
  const { entities: sprints, isLoading: l2 } = useERPEntities(orgId, 'technology', 'sprint');
  const { entities: incidents, isLoading: l3 } = useERPEntities(orgId, 'technology', 'incident');
  const { entities: customers, isLoading: l4 } = useERPEntities(orgId, 'technology', 'customer');
  const { entities: releases, isLoading: l5 } = useERPEntities(orgId, 'technology', 'release');
  const isLoading = l1 || l2 || l3 || l4 || l5;

  const mrr = products.reduce((s: number, p: any) => s + (Number(p.entity_data?.mrr) || 0), 0);
  const openIncidents = incidents.filter((i: any) => i.entity_data?.status !== 'resolved').length;
  const avgHealth = customers.length > 0
    ? Math.round(customers.reduce((s: number, c: any) => s + (Number(c.entity_data?.health_score) || 0), 0) / customers.length)
    : 0;

  return (
    <section aria-labelledby="tech-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="tech-erp-heading" className="text-2xl font-bold">Technology Suite</h2>
          <p className="text-muted-foreground">Ship faster: products, sprints, releases, incidents, and customer success</p>
        </div>
        <Button variant="default" size="sm"><Rocket className="mr-2 h-4 w-4" /> New Release</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'MRR', value: mrr > 0 ? `$${(mrr / 1000).toFixed(1)}K` : '$0', icon: Cpu },
          { label: 'Active Sprints', value: sprints.filter((s: any) => s.entity_data?.status === 'in_progress').length, icon: Rocket },
          { label: 'Open Incidents', value: openIncidents, icon: AlertTriangle },
          { label: 'Avg Customer Health', value: `${avgHealth}%`, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{value}</p>}
                </div>
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <IndustryStarterPanel industryKey="technology" />

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sprints">Sprints</TabsTrigger>
          <TabsTrigger value="releases">Releases</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="products"><Card><CardHeader><CardTitle>Product Portfolio</CardTitle><CardDescription>Lifecycle stage and revenue</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : products.length === 0 ? <p className="text-sm text-muted-foreground p-4 text-center">No products yet.</p> : <p className="text-sm text-muted-foreground">{products.length} products generating ${(mrr / 1000).toFixed(1)}K MRR.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="sprints"><Card><CardHeader><CardTitle>Engineering Sprints</CardTitle><CardDescription>Velocity and delivery</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{sprints.length} sprints tracked.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="releases"><Card><CardHeader><CardTitle>Releases</CardTitle><CardDescription>Shipped versions and changelog</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{releases.length} releases shipped.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="incidents"><Card><CardHeader><CardTitle>Incidents</CardTitle><CardDescription>Severity, MTTR, postmortems</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{openIncidents} open of {incidents.length} total incidents.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="customers"><Card><CardHeader><CardTitle>Customer Success</CardTitle><CardDescription>Health, expansion, churn risk</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{customers.length} customers, average health {avgHealth}%.</p>}</CardContent></Card></TabsContent>
      </Tabs>
    </section>
  );
};

export default TechnologyIndustry;
