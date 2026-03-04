import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, TrendingUp, TrendingDown, PieChart, FileText, Calculator, Plus
} from 'lucide-react';
import { useFinancialMetrics } from '@/hooks/useERPMetrics';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganization } from '@/contexts/OrganizationContext';
import ERPEntityDialog, { ENTITY_FIELDS } from '../ERPEntityDialog';

export const FinancialModule: React.FC = () => {
  const { organizationId: orgId } = useOrganization();
  const organizationId = orgId || '';
  const { metrics, isLoading: metricsLoading } = useFinancialMetrics(organizationId);
  const { entities: transactions, isLoading: transactionsLoading } = useERPEntities(organizationId, 'financial', 'transaction');
  const [dialogType, setDialogType] = useState<'account' | 'transaction' | null>(null);

  const isLoading = metricsLoading || transactionsLoading;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Financial Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setDialogType('account')}>
            <Plus className="w-4 h-4 mr-1" /> Account
          </Button>
          <Button size="sm" onClick={() => setDialogType('transaction')}>
            <Plus className="w-4 h-4 mr-1" /> Transaction
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(metrics.revenue), icon: DollarSign, sub: metrics.revenue > 0 ? 'From transactions' : 'No revenue recorded' },
          { label: 'Total Expenses', value: formatCurrency(metrics.expenses), icon: TrendingDown, sub: metrics.expenses > 0 ? 'From transactions' : 'No expenses recorded' },
          { label: 'Net Profit', value: formatCurrency(metrics.profit), icon: Calculator, sub: 'Revenue - Expenses', color: metrics.profit >= 0 ? 'text-green-600' : 'text-red-600' },
          { label: 'Cash Flow', value: formatCurrency(metrics.cashFlow), icon: PieChart, sub: 'Total account balance' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-24" /> : (
                <>
                  <div className={`text-2xl font-bold ${kpi.color || ''}`}>{kpi.value}</div>
                  <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Account Overview</CardTitle><CardDescription>Manage financial accounts</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => setDialogType('account')}><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
              ) : metrics.accounts.length === 0 ? (
                <div className="text-center p-8">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No accounts found</p>
                  <Button onClick={() => setDialogType('account')}>Add Account</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {metrics.accounts.map(account => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{account.name}</h3>
                          <Badge variant="outline">{account.type}</Badge>
                        </div>
                      </div>
                      <div className="text-lg font-semibold">{formatCurrency(account.balance)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Recent Transactions</CardTitle><CardDescription>Track financial transactions</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => setDialogType('transaction')}><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </div>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : transactions.length === 0 ? (
                <div className="text-center p-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No transactions found</p>
                  <Button onClick={() => setDialogType('transaction')}>Add Transaction</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((t: any) => {
                    const data = t.entity_data || {};
                    return (
                      <div key={t.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{data.description || 'Transaction'}</div>
                          <div className="text-sm text-muted-foreground">{data.category || 'Uncategorized'}</div>
                        </div>
                        <div className={`font-semibold ${(data.amount || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(data.type === 'income' ? '+' : '-')}{formatCurrency(Math.abs(data.amount || 0))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader><CardTitle>Financial Reports</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: FileText, label: 'Profit & Loss' },
                  { icon: PieChart, label: 'Balance Sheet' },
                  { icon: TrendingUp, label: 'Cash Flow' },
                  { icon: Calculator, label: 'Tax Summary' },
                ].map(r => (
                  <Button key={r.label} variant="outline" className="p-6 h-auto flex-col">
                    <r.icon className="w-8 h-8 mb-2" /><span>{r.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ERPEntityDialog
        open={dialogType === 'account'}
        onOpenChange={open => !open && setDialogType(null)}
        moduleKey="financial"
        entityType="account"
        title="Add Financial Account"
        fields={ENTITY_FIELDS.account}
      />
      <ERPEntityDialog
        open={dialogType === 'transaction'}
        onOpenChange={open => !open && setDialogType(null)}
        moduleKey="financial"
        entityType="transaction"
        title="Add Transaction"
        fields={ENTITY_FIELDS.transaction}
      />
    </div>
  );
};
