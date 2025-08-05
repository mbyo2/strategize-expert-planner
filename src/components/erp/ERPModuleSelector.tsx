import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useERPModules, useOrganizationERP } from '@/hooks/useERP';
import { INDUSTRY_CATEGORIES, IndustryCategory } from '@/types/erp';
import { Info, Building2, Shield, Package, Stethoscope, GraduationCap, CreditCard } from 'lucide-react';

interface ERPModuleSelectorProps {
  organizationId: string;
  onConfigurationChange?: () => void;
}

const getCategoryIcon = (category: IndustryCategory) => {
  switch (category) {
    case 'manufacturing': return Package;
    case 'healthcare': return Stethoscope;
    case 'education': return GraduationCap;
    case 'financial_services': return CreditCard;
    case 'retail': return Building2;
    default: return Shield;
  }
};

const ERPModuleSelector: React.FC<ERPModuleSelectorProps> = ({
  organizationId,
  onConfigurationChange
}) => {
  const { modules, isLoading: loadingModules } = useERPModules();
  const { 
    config, 
    isLoading: loadingConfig, 
    activateModules, 
    deactivateModules,
    isActivating,
    isDeactivating 
  } = useOrganizationERP(organizationId);

  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<IndustryCategory>('core');

  const activeModules = config?.active_modules || [];
  const modulesByCategory = modules.reduce((acc, module) => {
    const category = module.industry_category as IndustryCategory;
    if (!acc[category]) acc[category] = [];
    acc[category].push(module);
    return acc;
  }, {} as Record<IndustryCategory, typeof modules>);

  const handleModuleToggle = (moduleKey: string, isActive: boolean) => {
    if (isActive) {
      setSelectedModules(prev => prev.filter(key => key !== moduleKey));
    } else {
      setSelectedModules(prev => [...prev, moduleKey]);
    }
  };

  const handleActivateSelected = () => {
    activateModules(selectedModules);
    setSelectedModules([]);
    onConfigurationChange?.();
  };

  const handleDeactivateModule = (moduleKey: string) => {
    deactivateModules([moduleKey]);
    onConfigurationChange?.();
  };

  if (loadingModules || loadingConfig) {
    return <div className="flex justify-center p-8">Loading ERP modules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">ERP Module Configuration</h2>
          <p className="text-muted-foreground">
            Select industry-specific modules to integrate with your strategic planning
          </p>
        </div>
        
        {selectedModules.length > 0 && (
          <Button 
            onClick={handleActivateSelected}
            disabled={isActivating}
          >
            {isActivating ? 'Activating...' : `Activate ${selectedModules.length} Module(s)`}
          </Button>
        )}
      </div>

      {activeModules.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Active Modules:</strong> {activeModules.length} modules currently integrated with your strategic planning
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as IndustryCategory)}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          {Object.entries(INDUSTRY_CATEGORIES).map(([key, label]) => {
            const Icon = getCategoryIcon(key as IndustryCategory);
            const moduleCount = modulesByCategory[key as IndustryCategory]?.length || 0;
            
            return (
              <TabsTrigger key={key} value={key} className="flex flex-col gap-1">
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
                {moduleCount > 0 && (
                  <Badge variant="secondary" className="text-xs px-1">
                    {moduleCount}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(INDUSTRY_CATEGORIES).map(([categoryKey, categoryLabel]) => {
          const categoryModules = modulesByCategory[categoryKey as IndustryCategory] || [];
          
          return (
            <TabsContent key={categoryKey} value={categoryKey} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">{categoryLabel} Modules</h3>
                <Badge variant="outline">
                  {categoryModules.length} module(s)
                </Badge>
              </div>

              {categoryModules.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No modules available for this category yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryModules.map((module) => {
                    const isActive = activeModules.includes(module.module_key);
                    const isSelected = selectedModules.includes(module.module_key);
                    
                    return (
                      <Card 
                        key={module.id} 
                        className={`relative transition-all ${
                          isActive ? 'ring-2 ring-primary' : ''
                        } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base flex items-center gap-2">
                                {module.name}
                                {module.is_core_module && (
                                  <Badge variant="default" className="text-xs">
                                    Core
                                  </Badge>
                                )}
                                {isActive && (
                                  <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                    Active
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-sm mt-1">
                                {module.description}
                              </CardDescription>
                            </div>
                            
                            {!isActive && (
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleModuleToggle(module.module_key, isActive)}
                                className="ml-2"
                              />
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              v{module.version}
                            </div>
                            
                            {isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeactivateModule(module.module_key)}
                                disabled={isDeactivating}
                              >
                                Deactivate
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ERPModuleSelector;