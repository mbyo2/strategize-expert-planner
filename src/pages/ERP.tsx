import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ERPModuleSelector from '@/components/erp/ERPModuleSelector';
import ERPStrategicIntegration from '@/components/erp/ERPStrategicIntegration';
import ERPOnboardingWizard from '@/components/erp/ERPOnboardingWizard';
import { FinancialModule } from '@/components/erp/modules/FinancialModule';
import { HRModule } from '@/components/erp/modules/HRModule';
import { OperationsModule } from '@/components/erp/modules/OperationsModule';
import { SalesModule } from '@/components/erp/modules/SalesModule';
import { ProcurementModule } from '@/components/erp/modules/ProcurementModule';
import { SupplyChainModule } from '@/components/erp/modules/SupplyChainModule';
import { ManufacturingModule } from '@/components/erp/modules/ManufacturingModule';
import { ProjectModule } from '@/components/erp/modules/ProjectModule';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useOrganizationERP, useERPAnalytics } from '@/hooks/useERP';
import { 
  Package, Link2, BarChart3, Building2, 
  DollarSign, Users, Cog, ShoppingCart, 
  Truck, Factory, FolderKanban, Layers,
  ArrowUpRight, Activity, Settings
} from 'lucide-react';
import ManufacturingIndustry from '@/components/erp/industries/ManufacturingIndustry';
import RetailIndustry from '@/components/erp/industries/RetailIndustry';
import ServicesIndustry from '@/components/erp/industries/ServicesIndustry';
import HealthcareIndustry from '@/components/erp/industries/HealthcareIndustry';
import FinancialServicesIndustry from '@/components/erp/industries/FinancialServicesIndustry';
import EducationIndustry from '@/components/erp/industries/EducationIndustry';
import ConstructionIndustry from '@/components/erp/industries/ConstructionIndustry';
import LogisticsIndustry from '@/components/erp/industries/LogisticsIndustry';
import EnergyUtilitiesIndustry from '@/components/erp/industries/EnergyUtilitiesIndustry';
import PharmaceuticalsIndustry from '@/components/erp/industries/PharmaceuticalsIndustry';
import HospitalityIndustry from '@/components/erp/industries/HospitalityIndustry';
import AgricultureIndustry from '@/components/erp/industries/AgricultureIndustry';
import TechnologyIndustry from '@/components/erp/industries/TechnologyIndustry';
import NonProfitIndustry from '@/components/erp/industries/NonProfitIndustry';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ 
  label, value, icon: Icon, subtitle 
}: { 
  label: string; value: string | number; icon: React.ElementType; subtitle?: string 
}) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ERPPage: React.FC = () => {
  const { session } = useSimpleAuth();
  const { organizationId } = useOrganization();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSetup, setShowSetup] = useState(false);
  
  const { config, isLoading } = useOrganizationERP(organizationId || '');
  const { analytics } = useERPAnalytics(organizationId || '');

  const activeModules = config?.active_modules || [];
  const hasModules = activeModules.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Show onboarding wizard if no modules active and not manually showing setup
  if (!hasModules && !showSetup) {
    return (
      <div className="space-y-6">
        <SEO title="ERP Setup" description="Configure your Enterprise Resource Planning modules" />
        <div className="flex flex-col items-center gap-2 pt-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-2">
            <Layers className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center">Set Up Your ERP</h1>
          <p className="text-muted-foreground text-center max-w-lg">
            Configure your enterprise modules in 3 simple steps. Choose your industry, pick the modules you need, and start managing your business.
          </p>
        </div>
        <ERPOnboardingWizard 
          organizationId={organizationId || ''} 
          onComplete={() => setShowSetup(false)} 
        />
      </div>
    );
  }

  const integrationHealth = analytics && analytics.totalEntities > 0 
    ? Math.round((analytics.totalStrategicLinks / analytics.totalEntities) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <SEO title="ERP Integration" description="Enterprise Resource Planning modules integrated with strategic planning" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ERP Integration</h1>
            <p className="text-sm text-muted-foreground">
              {activeModules.length} module{activeModules.length !== 1 ? 's' : ''} active
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setActiveTab('setup')}>
          <Settings className="h-4 w-4 mr-1" /> Manage Modules
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Modules" value={activeModules.length} icon={Package} subtitle="Configured" />
        <StatCard label="ERP Entities" value={analytics?.totalEntities || 0} icon={Building2} subtitle="Total records" />
        <StatCard label="Strategic Links" value={analytics?.totalStrategicLinks || 0} icon={Link2} subtitle="Goal connections" />
        <StatCard label="Integration" value={`${integrationHealth}%`} icon={Activity} subtitle={integrationHealth > 70 ? 'Strong' : integrationHealth > 30 ? 'Moderate' : 'Needs attention'} />
      </div>

      {/* Main Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="h-auto p-0 bg-transparent gap-0">
            {[
              { value: 'overview', label: 'Overview', icon: BarChart3 },
              { value: 'financial', label: 'Financial', icon: DollarSign },
              { value: 'sales', label: 'Sales & CRM', icon: ShoppingCart },
              { value: 'hr', label: 'HR', icon: Users },
              { value: 'operations', label: 'Operations', icon: Cog },
              { value: 'manufacturing', label: 'Manufacturing', icon: Factory },
              { value: 'supply', label: 'Supply Chain', icon: Truck },
              { value: 'projects', label: 'Projects', icon: FolderKanban },
              { value: 'integration', label: 'Strategy', icon: Link2 },
              { value: 'industries', label: 'Industries', icon: Building2 },
              { value: 'setup', label: 'Setup', icon: Package },
            ].map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="relative rounded-none border-b-2 border-transparent px-3 py-2.5 text-xs font-medium text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
              >
                <tab.icon className="mr-1.5 h-3.5 w-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 pt-4">
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Module Usage</CardTitle>
                  <CardDescription>Entity distribution across modules</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.entitiesByModule && Object.keys(analytics.entitiesByModule).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(analytics.entitiesByModule)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .map(([moduleKey, count]) => {
                          const maxCount = Math.max(...Object.values(analytics.entitiesByModule) as number[]);
                          return (
                            <div key={moduleKey} className="space-y-1.5">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium capitalize">{moduleKey.replace(/_/g, ' ')}</span>
                                <span className="text-muted-foreground tabular-nums">{count as number}</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-secondary">
                                <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${((count as number) / maxCount) * 100}%` }} />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                        <BarChart3 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">No data yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Create entities in any module to see analytics</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Active Modules</CardTitle>
                  <CardDescription>{activeModules.length} module(s) enabled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {activeModules.map(mod => (
                      <Badge key={mod} variant="secondary" className="px-3 py-1.5 text-sm capitalize">
                        {mod.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="financial" className="pt-4"><FinancialModule /></TabsContent>
        <TabsContent value="sales" className="pt-4"><SalesModule /></TabsContent>
        <TabsContent value="hr" className="pt-4"><HRModule /></TabsContent>
        
        <TabsContent value="operations" className="pt-4"><OperationsModule /></TabsContent>
        <TabsContent value="manufacturing" className="pt-4"><ManufacturingModule /></TabsContent>
        
        <TabsContent value="supply" className="pt-4">
          <div className="space-y-8">
            <SupplyChainModule />
            <Separator />
            <ProcurementModule />
          </div>
        </TabsContent>

        <TabsContent value="projects" className="pt-4"><ProjectModule /></TabsContent>

        <TabsContent value="integration" className="pt-4">
          <ERPStrategicIntegration organizationId={organizationId || ''} />
        </TabsContent>

        {/* Industries */}
        <TabsContent value="industries" className="pt-4">
          <Tabs defaultValue="construction">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
              {[
                { value: 'construction', label: 'Construction' },
                { value: 'logistics', label: 'Logistics' },
                { value: 'energy', label: 'Energy' },
                { value: 'pharma', label: 'Pharma' },
                { value: 'hospitality', label: 'Hospitality' },
                { value: 'manufacturing', label: 'Manufacturing' },
                { value: 'retail', label: 'Retail' },
                { value: 'services', label: 'Services' },
                { value: 'healthcare', label: 'Healthcare' },
                { value: 'financial', label: 'Financial Svcs' },
                { value: 'education', label: 'Education' },
                { value: 'agriculture', label: 'Agriculture' },
                { value: 'technology', label: 'Technology' },
                { value: 'nonprofit', label: 'Non-Profit' },
              ].map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-3 py-1.5">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="construction" className="mt-4"><ConstructionIndustry /></TabsContent>
            <TabsContent value="logistics" className="mt-4"><LogisticsIndustry /></TabsContent>
            <TabsContent value="energy" className="mt-4"><EnergyUtilitiesIndustry /></TabsContent>
            <TabsContent value="pharma" className="mt-4"><PharmaceuticalsIndustry /></TabsContent>
            <TabsContent value="hospitality" className="mt-4"><HospitalityIndustry /></TabsContent>
            <TabsContent value="manufacturing" className="mt-4"><ManufacturingIndustry /></TabsContent>
            <TabsContent value="retail" className="mt-4"><RetailIndustry /></TabsContent>
            <TabsContent value="services" className="mt-4"><ServicesIndustry /></TabsContent>
            <TabsContent value="healthcare" className="mt-4"><HealthcareIndustry /></TabsContent>
            <TabsContent value="financial" className="mt-4"><FinancialServicesIndustry /></TabsContent>
            <TabsContent value="education" className="mt-4"><EducationIndustry /></TabsContent>
            <TabsContent value="agriculture" className="mt-4"><AgricultureIndustry /></TabsContent>
            <TabsContent value="technology" className="mt-4"><TechnologyIndustry /></TabsContent>
            <TabsContent value="nonprofit" className="mt-4"><NonProfitIndustry /></TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="setup" className="pt-4">
          <ERPModuleSelector organizationId={organizationId || ''} onConfigurationChange={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ERPPage;
