import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Workflow, Loader2 } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganization } from '@/contexts/OrganizationContext';
import { INDUSTRY_TEMPLATES } from './industryTemplates';
import { toast } from 'sonner';

interface IndustryStarterPanelProps {
  industryKey: 'agriculture' | 'technology' | 'nonprofit';
}

/**
 * Reusable panel that lets a user seed starter entities and view the
 * recommended workflows for an industry. Skips already-existing seed entities
 * so it is safe to click multiple times.
 */
export const IndustryStarterPanel: React.FC<IndustryStarterPanelProps> = ({ industryKey }) => {
  const { organizationId } = useOrganization();
  const orgId = organizationId || '';
  const template = INDUSTRY_TEMPLATES[industryKey];
  const { entities, createEntity, isCreating } = useERPEntities(orgId, industryKey);

  const seededCount = entities.length;
  const targetCount = template.entities.length;
  const fullySeeded = seededCount >= targetCount;

  const handleSeed = async () => {
    if (!orgId) {
      toast.error('No organization selected');
      return;
    }
    const existingNames = new Set(
      entities.map((e: any) => `${e.entity_type}::${e.entity_data?.name ?? ''}`)
    );

    const toCreate = template.entities.filter(
      (e) => !existingNames.has(`${e.entity_type}::${e.entity_data?.name ?? ''}`)
    );

    if (toCreate.length === 0) {
      toast.info('Starter entities already loaded');
      return;
    }

    let created = 0;
    for (const entity of toCreate) {
      await new Promise<void>((resolve) => {
        createEntity(
          {
            organization_id: orgId,
            module_key: entity.module_key,
            entity_type: entity.entity_type,
            entity_data: entity.entity_data,
            metadata: { ...(entity.metadata || {}), source: 'starter_template' },
          } as any,
          {
            onSuccess: () => {
              created += 1;
              resolve();
            },
            onError: () => resolve(),
          } as any
        );
      });
    }
    toast.success(`Seeded ${created} starter ${template.label} entities`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> Starter Template
          </CardTitle>
          <CardDescription>
            Spin up sample {template.label.toLowerCase()} records to explore KPIs immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Seeded entities</span>
            <Badge variant={fullySeeded ? 'default' : 'outline'}>
              {seededCount} / {targetCount}
            </Badge>
          </div>
          <Button onClick={handleSeed} disabled={isCreating || fullySeeded} className="w-full">
            {isCreating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding…</>
            ) : fullySeeded ? (
              'Starter data loaded'
            ) : (
              <>Load {template.label} starter data</>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Workflow className="h-4 w-4 text-primary" /> Recommended Workflows
          </CardTitle>
          <CardDescription>Battle-tested processes for {template.label.toLowerCase()} teams.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {template.workflows.map((w) => (
              <li key={w.title} className="rounded-lg border p-3">
                <div className="font-medium text-sm">{w.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{w.description}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryStarterPanel;
