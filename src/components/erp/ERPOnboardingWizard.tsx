import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Factory, ShoppingCart, Briefcase, Stethoscope, 
  CreditCard, GraduationCap, HardHat, Truck, Zap, 
  Pill, Hotel, Sprout, Cpu, HeartHandshake, ChevronRight, ChevronLeft, Check,
  Package, DollarSign, Users, Cog, FolderKanban,
  ShoppingBag, Wrench, BarChart3, Layers, Home, Film, Radio, Landmark,
  Shield, Scale, Car, Plane, Pickaxe, UtensilsCrossed, Trophy, Megaphone,
  Bus, Leaf
} from 'lucide-react';
import { useOrganizationERP } from '@/hooks/useERP';
import { toast } from 'sonner';

interface ERPOnboardingWizardProps {
  organizationId: string;
  onComplete: () => void;
}

const INDUSTRIES = [
  { key: 'manufacturing', label: 'Manufacturing', icon: Factory, description: 'Production planning, quality control, shop floor management' },
  { key: 'retail', label: 'Retail & E-commerce', icon: ShoppingCart, description: 'POS, inventory, customer management, promotions' },
  { key: 'services', label: 'Professional Services', icon: Briefcase, description: 'Project management, time tracking, billing' },
  { key: 'healthcare', label: 'Healthcare', icon: Stethoscope, description: 'Patient management, scheduling, compliance' },
  { key: 'financial_services', label: 'Financial Services', icon: CreditCard, description: 'Portfolio management, compliance, risk analysis' },
  { key: 'education', label: 'Education', icon: GraduationCap, description: 'Student management, curriculum, enrollment' },
  { key: 'construction', label: 'Construction', icon: HardHat, description: 'Project tracking, procurement, safety, compliance' },
  { key: 'logistics', label: 'Logistics & Transport', icon: Truck, description: 'Fleet management, route optimization, warehouse ops' },
  { key: 'energy', label: 'Energy & Utilities', icon: Zap, description: 'Asset management, metering, regulatory compliance' },
  { key: 'pharma', label: 'Pharmaceuticals', icon: Pill, description: 'R&D tracking, quality assurance, regulatory' },
  { key: 'hospitality', label: 'Hospitality', icon: Hotel, description: 'Reservations, guest management, F&B operations' },
  { key: 'agriculture', label: 'Agriculture', icon: Sprout, description: 'Fields, crop cycles, livestock, equipment, harvest planning' },
  { key: 'technology', label: 'Technology / SaaS', icon: Cpu, description: 'Products, sprints, releases, incidents, customer success' },
  { key: 'nonprofit', label: 'Non-Profit', icon: HeartHandshake, description: 'Donors, grants, programs, volunteers, campaigns' },
  { key: 'real_estate', label: 'Real Estate', icon: Home, description: 'Properties, listings, leases, tenants, maintenance' },
  { key: 'media', label: 'Media & Entertainment', icon: Film, description: 'Productions, channels, audience, rights, licensing' },
  { key: 'telecom', label: 'Telecommunications', icon: Radio, description: 'Plans, subscribers, network ops, SLAs, sites' },
  { key: 'government', label: 'Government / Public Sector', icon: Landmark, description: 'Citizen services, permits, tenders, programs' },
  { key: 'insurance', label: 'Insurance', icon: Shield, description: 'Policies, claims, underwriting, agents, risk' },
  { key: 'legal', label: 'Legal Services', icon: Scale, description: 'Matters, documents, time entries, deadlines' },
  { key: 'automotive', label: 'Automotive', icon: Car, description: 'Vehicles, dealers, inventory, service, recalls' },
  { key: 'aerospace', label: 'Aerospace & Defense', icon: Plane, description: 'Programs, MRO, suppliers, certifications' },
  { key: 'mining', label: 'Mining & Metals', icon: Pickaxe, description: 'Sites, equipment, production, safety, environment' },
  { key: 'food_beverage', label: 'Food & Beverage', icon: UtensilsCrossed, description: 'Menu, recipes, suppliers, inventory, HACCP' },
  { key: 'sports_recreation', label: 'Sports & Recreation', icon: Trophy, description: 'Memberships, events, teams, facilities, classes' },
  { key: 'marketing', label: 'Marketing / Creative Agency', icon: Megaphone, description: 'Clients, campaigns, creative, projects, leads' },
  { key: 'transportation', label: 'Transportation & Mobility', icon: Bus, description: 'Routes, fleet, drivers, trips, maintenance' },
  { key: 'environmental', label: 'Environmental & ESG', icon: Leaf, description: 'Emissions, projects, audits, KPIs, ESG reporting' },
];

const CORE_MODULES = [
  { key: 'financial_management', label: 'Financial Management', icon: DollarSign, description: 'Accounts, transactions, budgets, reports', recommended: true },
  { key: 'human_resources', label: 'Human Resources', icon: Users, description: 'Employees, payroll, attendance, departments', recommended: true },
  { key: 'crm', label: 'Sales & CRM', icon: ShoppingBag, description: 'Customers, leads, pipeline, deals', recommended: true },
  { key: 'operations', label: 'Operations', icon: Cog, description: 'Orders, inventory, process management', recommended: false },
  { key: 'supply_chain', label: 'Supply Chain', icon: Truck, description: 'Shipments, warehouses, logistics', recommended: false },
  { key: 'procurement', label: 'Procurement', icon: Wrench, description: 'Purchase orders, suppliers, sourcing', recommended: false },
  { key: 'manufacturing_ops', label: 'Manufacturing', icon: Factory, description: 'Production lines, work orders, quality', recommended: false },
  { key: 'project_management', label: 'Project Management', icon: FolderKanban, description: 'Projects, milestones, team allocation', recommended: false },
];

const ERPOnboardingWizard: React.FC<ERPOnboardingWizardProps> = ({ organizationId, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>(['financial_management', 'human_resources', 'crm']);
  
  const { activateModules, isActivating } = useOrganizationERP(organizationId);

  const toggleModule = (key: string) => {
    setSelectedModules(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleComplete = () => {
    const allModules = [...selectedModules];
    if (selectedIndustry && !allModules.includes(selectedIndustry)) {
      allModules.push(selectedIndustry);
    }
    activateModules(allModules, {
      onSuccess: () => {
        toast.success('ERP modules activated! Your workspace is ready.');
        onComplete();
      },
      onError: () => {
        toast.error('Failed to activate modules. Please try again.');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
              s < step ? 'bg-primary text-primary-foreground' : 
              s === step ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 
              'bg-muted text-muted-foreground'
            }`}>
              {s < step ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 3 && <div className={`h-0.5 w-12 ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Industry */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">What industry are you in?</h2>
            <p className="text-muted-foreground">
              We'll tailor your ERP experience with industry-specific features
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INDUSTRIES.map(ind => (
              <button
                key={ind.key}
                onClick={() => setSelectedIndustry(ind.key)}
                className={`group relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
                  selectedIndustry === ind.key 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  selectedIndustry === ind.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }`}>
                  <ind.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{ind.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ind.description}</div>
                </div>
                {selectedIndustry === ind.key && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!selectedIndustry} size="lg">
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Core Modules */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Choose your modules</h2>
            <p className="text-muted-foreground">
              Select the core business modules you need. You can always add more later.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CORE_MODULES.map(mod => {
              const isSelected = selectedModules.includes(mod.key);
              return (
                <button
                  key={mod.key}
                  onClick={() => toggleModule(mod.key)}
                  className={`group relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <mod.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{mod.label}</span>
                      {mod.recommended && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Recommended</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{mod.description}</div>
                  </div>
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'
                  }`}>
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={selectedModules.length === 0} size="lg">
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Ready to launch</h2>
            <p className="text-muted-foreground">
              Review your configuration and get started
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your ERP Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Industry</div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const ind = INDUSTRIES.find(i => i.key === selectedIndustry);
                    if (!ind) return null;
                    return (
                      <>
                        <ind.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{ind.label}</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Active Modules ({selectedModules.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedModules.map(key => {
                    const mod = CORE_MODULES.find(m => m.key === key);
                    return (
                      <Badge key={key} variant="secondary" className="px-3 py-1.5 text-sm">
                        {mod?.label || key.replace(/_/g, ' ')}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={handleComplete} disabled={isActivating} size="lg">
              {isActivating ? 'Activating...' : 'Launch ERP'} 
              <Layers className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ERPOnboardingWizard;
