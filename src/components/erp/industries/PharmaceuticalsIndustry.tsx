import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FlaskConical, ClipboardCheck, ShieldCheck, Package } from 'lucide-react';

const PharmaceuticalsIndustry: React.FC = () => {
  return (
    <section aria-labelledby="pharma-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="pharma-erp-heading" className="text-2xl font-bold">Pharmaceuticals Suite</h2>
          <p className="text-muted-foreground">
            Oversee R&D, manufacturing, quality, compliance, and supply
          </p>
        </div>
        <Button variant="default" size="sm">
          <Package className="mr-2 h-4 w-4" /> New Batch
        </Button>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Trials</p>
                <p className="text-2xl font-bold">9</p>
              </div>
              <FlaskConical className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Batches In Prod</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">QA Pass Rate</p>
                <p className="text-2xl font-bold">98.4%</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recalls (30d)</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections */}
      <Tabs defaultValue="rd">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rd">R&D</TabsTrigger>
          <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="supply">Supply Chain</TabsTrigger>
        </TabsList>

        <TabsContent value="rd">
          <Card>
            <CardHeader>
              <CardTitle>Research & Development</CardTitle>
              <CardDescription>Clinical trials and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track trial phases, protocols, and investigator sites.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manufacturing">
          <Card>
            <CardHeader>
              <CardTitle>Manufacturing</CardTitle>
              <CardDescription>Batch records and process controls</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage MBR/EBR, deviations, and CAPAs.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Quality Assurance</CardTitle>
              <CardDescription>Testing, stability, and release</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">QC testing, stability studies, and lot release workflows.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Validation</CardTitle>
              <CardDescription>GxP, audits, and change control</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Maintain validation packages and audit readiness.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supply">
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain</CardTitle>
              <CardDescription>Materials, cold chain, and serialization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Plan materials, monitor cold chain, and track serialization.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default PharmaceuticalsIndustry;
