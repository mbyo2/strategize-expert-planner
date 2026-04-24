import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';

export type BindingAggregation = 'value' | 'sum' | 'avg' | 'count' | 'max' | 'min';

export interface StrategyERPBinding {
  id: string;
  organization_id: string;
  goal_id: string;
  erp_entity_id: string;
  source_field: string;
  aggregation: BindingAggregation;
  multiplier: number;
  last_synced_value: number | null;
  last_synced_at: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const getValueAtPath = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
};

const computeValue = (rows: any[], field: string, agg: BindingAggregation, mult: number): number | null => {
  const values = rows
    .map((r) => getValueAtPath(r.entity_data ?? {}, field))
    .map((v) => (typeof v === 'number' ? v : Number(v)))
    .filter((v) => !Number.isNaN(v));
  if (agg === 'count') return rows.length * mult;
  if (!values.length) return null;
  let result: number;
  switch (agg) {
    case 'sum':
      result = values.reduce((a, b) => a + b, 0);
      break;
    case 'avg':
      result = values.reduce((a, b) => a + b, 0) / values.length;
      break;
    case 'max':
      result = Math.max(...values);
      break;
    case 'min':
      result = Math.min(...values);
      break;
    case 'value':
    default:
      result = values[0];
  }
  return result * mult;
};

export const useStrategyERPBindings = (goalId?: string) => {
  const qc = useQueryClient();
  const { currentOrganization } = useOrganizations();
  const { session } = useSimpleAuth();
  const orgId = currentOrganization?.id;

  const { data: bindings = [], isLoading } = useQuery({
    queryKey: ['strategy-erp-bindings', orgId, goalId],
    enabled: !!orgId,
    queryFn: async () => {
      let q = supabase.from('strategy_erp_bindings' as any).select('*').eq('organization_id', orgId!);
      if (goalId) q = q.eq('goal_id', goalId);
      const { data, error } = await q.order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async (input: {
      goal_id: string;
      erp_entity_id: string;
      source_field: string;
      aggregation: BindingAggregation;
      multiplier?: number;
    }) => {
      if (!orgId || !session?.user?.id) throw new Error('Not ready');
      const { error } = await supabase.from('strategy_erp_bindings' as any).insert({
        organization_id: orgId,
        goal_id: input.goal_id,
        erp_entity_id: input.erp_entity_id,
        source_field: input.source_field,
        aggregation: input.aggregation,
        multiplier: input.multiplier ?? 1,
        created_by: session.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['strategy-erp-bindings'] });
      toast.success('Binding created');
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to create binding'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('strategy_erp_bindings' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['strategy-erp-bindings'] });
      toast.success('Binding removed');
    },
  });

  const sync = useMutation({
    mutationFn: async (binding: StrategyERPBinding) => {
      // Fetch matching ERP rows for the same entity
      const { data: entityRow, error: entErr } = await supabase
        .from('erp_entities')
        .select('id, entity_type, organization_id, entity_data')
        .eq('id', binding.erp_entity_id)
        .maybeSingle();
      if (entErr) throw entErr;
      if (!entityRow) throw new Error('ERP entity not found');

      // For aggregations across entity_type, also pull peers of same type in same org
      const { data: peers, error: peersErr } = await supabase
        .from('erp_entities')
        .select('entity_data')
        .eq('organization_id', entityRow.organization_id)
        .eq('entity_type', (entityRow as any).entity_type);
      if (peersErr) throw peersErr;

      const rows = binding.aggregation === 'value' ? [entityRow] : peers ?? [entityRow];
      const value = computeValue(rows as any[], binding.source_field, binding.aggregation, Number(binding.multiplier));

      const { error: upErr } = await supabase
        .from('strategy_erp_bindings' as any)
        .update({ last_synced_value: value, last_synced_at: new Date().toISOString() })
        .eq('id', binding.id);
      if (upErr) throw upErr;

      // Push value into the goal's current_value
      if (value != null) {
        const { error: gErr } = await supabase
          .from('strategic_goals')
          .update({ current_value: value })
          .eq('id', binding.goal_id);
        if (gErr) throw gErr;
      }
      return value;
    },
    onSuccess: (value) => {
      qc.invalidateQueries({ queryKey: ['strategy-erp-bindings'] });
      qc.invalidateQueries({ queryKey: ['strategic-goals'] });
      toast.success(`Synced: ${value ?? 'no value'}`);
    },
    onError: (e: any) => toast.error(e.message ?? 'Sync failed'),
  });

  return { bindings, isLoading, create, remove, sync };
};
