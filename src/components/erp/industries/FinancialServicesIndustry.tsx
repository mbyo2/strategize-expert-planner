import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldAlert, Landmark, LineChart, FileText } from 'lucide-react';
import { useFinancialMetrics } from '@/hooks/useERPMetrics';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const FinancialServicesIndustry: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id || '';
  const { metrics, isLoading: metricsLoading } = useFinancialMetrics(orgId);
  const { entities: riskAlerts, isLoading: l1 } = useERPEntities(orgId, 'financial_services', 'risk_alert');
  const isLoading = metricsLoading || l1;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Financial Services Suite</h2>
        <Button><FileText className="w-4 h-4 mr-2" />New Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Accounts', value: metrics.accounts.length },
          { label: 'Multi-currency', value: 'Enabled', isBadge: true },
          { label: 'Risk Alerts', value: riskAlerts.length },
          { label: 'Liquidity', value: formatCurrency(metrics.cashFlow) },
        ].map(({ label, value, isBadge }) => (
          <Card key={label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
            <CardContent>{isLoading ? <Skeleton className="h-8 w-16" /> : isBadge ? <Badge variant="outline">{value}</Badge> : <div className="text-2xl font-bold">{value}</div>}</CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="ledger">
        <TabsList>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="risk">Risk & Compliance</TabsTrigger>
          <TabsTrigger value="alm">ALM</TabsTrigger>
          <TabsTrigger value="invest">Investment</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger"><Card><CardHeader><CardTitle>General Ledger</CardTitle><CardDescription>Multi-entity, multi-currency accounting</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : metrics.accounts.length === 0 ? <p className="text-sm text-muted-foreground p-4 text-center">No accounts found. Add financial entities to get started.</p> : <p className="text-sm text-muted-foreground">{metrics.accounts.length} accounts with {formatCurrency(metrics.cashFlow)} total balance.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="risk">
          <Card><CardHeader><CardTitle>Risk & Compliance</CardTitle><CardDescription>Fraud detection, regulatory reporting</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col"><ShieldAlert className="w-6 h-6 mb-2" /><span>AML/KYC</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><Landmark className="w-6 h-6 mb-2" /><span>Basel/IFRS</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><LineChart className="w-6 h-6 mb-2" /><span>Stress Tests</span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alm"><Card><CardHeader><CardTitle>Asset & Liability Management</CardTitle><CardDescription>ALM gap, duration, and liquidity</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">ALM analytics coming soon</p></CardContent></Card></TabsContent>
        <TabsContent value="invest"><Card><CardHeader><CardTitle>Investment Management</CardTitle><CardDescription>Portfolios, performance, client accounts</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio tools coming soon</p></CardContent></Card></TabsContent>
        <TabsContent value="treasury"><Card><CardHeader><CardTitle>Treasury</CardTitle><CardDescription>Cash, liquidity, and instruments</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Treasury workflows coming soon</p></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialServicesIndustry;