import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FlaskConical, ClipboardCheck, ShieldCheck, Package } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

const PharmaceuticalsIndustry: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id || '';
  const { entities: trials, isLoading: l1 } = useERPEntities(orgId, 'pharma', 'trial');
  const { entities: batches, isLoading: l2 } = useERPEntities(orgId, 'pharma', 'batch');
  const { entities: qaRecords, isLoading: l3 } = useERPEntities(orgId, 'pharma', 'qa_record');
  const { entities: recalls, isLoading: l4 } = useERPEntities(orgId, 'pharma', 'recall');
  const isLoading = l1 || l2 || l3 || l4;

  const passedQA = qaRecords.filter((r: any) => r.entity_data?.result === 'pass').length;
  const qaRate = qaRecords.length > 0 ? Math.round((passedQA / qaRecords.length) * 1000) / 10 : 100;

  return (
    <section aria-labelledby="pharma-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="pharma-erp-heading" className="text-2xl font-bold">Pharmaceuticals Suite</h2>
          <p className="text-muted-foreground">Oversee R&D, manufacturing, quality, compliance, and supply</p>
        </div>
        <Button variant="default" size="sm"><Package className="mr-2 h-4 w-4" /> New Batch</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Trials', value: trials.length, icon: FlaskConical },
          { label: 'Batches In Prod', value: batches.length, icon: Package },
          { label: 'QA Pass Rate', value: `${qaRate}%`, icon: ClipboardCheck },
          { label: 'Recalls (30d)', value: recalls.length, icon: ShieldCheck },
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

      <Tabs defaultValue="rd">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rd">R&D</TabsTrigger>
          <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="supply">Supply Chain</TabsTrigger>
        </TabsList>

        <TabsContent value="rd"><Card><CardHeader><CardTitle>Research & Development</CardTitle><CardDescription>Clinical trials and documentation</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : trials.length === 0 ? <p className="text-sm text-muted-foreground p-4 text-center">No trials found.</p> : <p className="text-sm text-muted-foreground">{trials.length} active clinical trials tracked.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="manufacturing"><Card><CardHeader><CardTitle>Manufacturing</CardTitle><CardDescription>Batch records and process controls</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{batches.length} batches in production.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="quality"><Card><CardHeader><CardTitle>Quality Assurance</CardTitle><CardDescription>Testing, stability, and release</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">QC testing, stability studies, and lot release workflows.</p></CardContent></Card></TabsContent>
        <TabsContent value="compliance"><Card><CardHeader><CardTitle>Compliance & Validation</CardTitle><CardDescription>GxP, audits, and change control</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Maintain validation packages and audit readiness.</p></CardContent></Card></TabsContent>
        <TabsContent value="supply"><Card><CardHeader><CardTitle>Supply Chain</CardTitle><CardDescription>Materials, cold chain, and serialization</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Plan materials, monitor cold chain, and track serialization.</p></CardContent></Card></TabsContent>
      </Tabs>
    </section>
  );
};

export default PharmaceuticalsIndustry;