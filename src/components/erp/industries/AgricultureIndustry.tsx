import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sprout, Tractor, Beef, Wheat } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganization } from '@/contexts/OrganizationContext';
import IndustryStarterPanel from './IndustryStarterPanel';

const AgricultureIndustry: React.FC = () => {
  const { organizationId } = useOrganization();
  const orgId = organizationId || '';
  const { entities: fields, isLoading: l1 } = useERPEntities(orgId, 'agriculture', 'field');
  const { entities: cycles, isLoading: l2 } = useERPEntities(orgId, 'agriculture', 'crop_cycle');
  const { entities: livestock, isLoading: l3 } = useERPEntities(orgId, 'agriculture', 'livestock');
  const { entities: equipment, isLoading: l4 } = useERPEntities(orgId, 'agriculture', 'equipment');
  const isLoading = l1 || l2 || l3 || l4;

  const totalArea = fields.reduce((s: number, f: any) => s + (Number(f.entity_data?.area_hectares) || 0), 0);
  const totalLivestock = livestock.reduce((s: number, l: any) => s + (Number(l.entity_data?.count) || 0), 0);
  const expectedYield = cycles.reduce((s: number, c: any) => s + (Number(c.entity_data?.expected_yield_tons) || 0), 0);

  return (
    <section aria-labelledby="agriculture-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="agriculture-erp-heading" className="text-2xl font-bold">Agriculture Suite</h2>
          <p className="text-muted-foreground">Manage fields, crops, livestock, equipment, and harvest planning</p>
        </div>
        <Button variant="default" size="sm"><Sprout className="mr-2 h-4 w-4" /> New Crop Cycle</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Area (ha)', value: totalArea.toLocaleString(), icon: Wheat },
          { label: 'Active Crop Cycles', value: cycles.length, icon: Sprout },
          { label: 'Livestock Head', value: totalLivestock.toLocaleString(), icon: Beef },
          { label: 'Expected Yield (t)', value: expectedYield.toLocaleString(), icon: Tractor },
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

      <IndustryStarterPanel industryKey="agriculture" />

      <Tabs defaultValue="fields">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="crops">Crop Cycles</TabsTrigger>
          <TabsTrigger value="livestock">Livestock</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="harvest">Harvest</TabsTrigger>
        </TabsList>

        <TabsContent value="fields"><Card><CardHeader><CardTitle>Fields</CardTitle><CardDescription>Land parcels and current usage</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : fields.length === 0 ? <p className="text-sm text-muted-foreground p-4 text-center">No fields tracked yet.</p> : <p className="text-sm text-muted-foreground">{fields.length} fields covering {totalArea.toLocaleString()} ha.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="crops"><Card><CardHeader><CardTitle>Crop Cycles</CardTitle><CardDescription>Plant → grow → harvest stages</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{cycles.length} active crop cycles tracked.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="livestock"><Card><CardHeader><CardTitle>Livestock</CardTitle><CardDescription>Health, vaccination and yield</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{totalLivestock.toLocaleString()} head across {livestock.length} herds.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="equipment"><Card><CardHeader><CardTitle>Equipment</CardTitle><CardDescription>Maintenance and utilization</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{equipment.length} pieces of equipment in service.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="harvest"><Card><CardHeader><CardTitle>Harvest Planning</CardTitle><CardDescription>Forecast yield and logistics</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Expected total yield: {expectedYield.toLocaleString()} tons.</p></CardContent></Card></TabsContent>
      </Tabs>
    </section>
  );
};

export default AgricultureIndustry;
