import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStrategyERPBindings, BindingAggregation } from '@/hooks/useStrategyERPBindings';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Link2, RefreshCw, Trash2, Zap } from 'lucide-react';

interface Props {
  goalId: string;
  goalName: string;
}

const aggregations: BindingAggregation[] = ['value', 'sum', 'avg', 'count', 'max', 'min'];

const StrategyErpBindingPanel: React.FC<Props> = ({ goalId, goalName }) => {
  const { bindings, create, remove, sync } = useStrategyERPBindings(goalId);
  const { currentOrganization } = useOrganizations();
  const { entities } = useERPEntities(currentOrganization?.id ?? '');

  const [entityId, setEntityId] = useState<string>('');
  const [field, setField] = useState('');
  const [agg, setAgg] = useState<BindingAggregation>('value');
  const [multiplier, setMultiplier] = useState('1');

  const entityList = useMemo(() => (Array.isArray(entities) ? entities : []), [entities]);

  const submit = async () => {
    if (!entityId || !field.trim()) return;
    await create.mutateAsync({
      goal_id: goalId,
      erp_entity_id: entityId,
      source_field: field.trim(),
      aggregation: agg,
      multiplier: Number(multiplier) || 1,
    });
    setField('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Link2 className="w-4 h-4 text-primary" /> Live ERP bindings
        </CardTitle>
        <CardDescription>
          Auto-pull the current value of <strong>{goalName}</strong> from your operational data. No more stale plans.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bindings.length === 0 && (
          <div className="text-sm text-muted-foreground">No bindings yet. Add one below.</div>
        )}

        {bindings.map((b: any) => {
          const ent = entityList.find((e: any) => e.id === b.erp_entity_id);
          return (
            <div key={b.id} className="border rounded-lg p-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="font-medium text-sm">
                  {ent?.entity_type ?? 'ERP entity'} · <code className="text-xs">{b.source_field}</code>
                </div>
                <div className="text-xs text-muted-foreground">
                  {b.aggregation} × {b.multiplier}
                  {b.last_synced_at && (
                    <>
                      {' '}· last synced {new Date(b.last_synced_at).toLocaleString()} →{' '}
                      <span className="font-semibold">{b.last_synced_value ?? '—'}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={b.is_active ? 'default' : 'secondary'}>
                  {b.is_active ? 'Active' : 'Paused'}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => sync.mutate(b)} disabled={sync.isPending}>
                  <RefreshCw className="w-3 h-3 mr-1" /> Sync
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove.mutate(b.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}

        <div className="border-t pt-3 space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" /> New binding
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">ERP entity</Label>
              <Select value={entityId} onValueChange={setEntityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick entity" />
                </SelectTrigger>
                <SelectContent>
                  {entityList.length === 0 && (
                    <SelectItem value="none" disabled>
                      No ERP entities yet
                    </SelectItem>
                  )}
                  {entityList.map((e: any) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.entity_type} — {e.entity_data?.name ?? e.id.slice(0, 6)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Field path (in entity_data)</Label>
              <Input value={field} onChange={(e) => setField(e.target.value)} placeholder="revenue or pipeline.total" />
            </div>
            <div>
              <Label className="text-xs">Aggregation</Label>
              <Select value={agg} onValueChange={(v) => setAgg(v as BindingAggregation)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aggregations.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Multiplier</Label>
              <Input type="number" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} />
            </div>
          </div>
          <Button size="sm" onClick={submit} disabled={!entityId || !field.trim() || create.isPending}>
            Add binding
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyErpBindingPanel;
