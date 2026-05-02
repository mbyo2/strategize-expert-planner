import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';

export interface StrategyPlan {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'on_hold' | 'completed' | 'archived';
  start_date: string | null;
  end_date: string | null;
  owner_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface StrategyProgressLog {
  id: string;
  organization_id: string;
  entity_type: 'plan' | 'objective' | 'initiative';
  entity_id: string;
  progress: number;
  note: string | null;
  user_id: string;
  created_at: string;
}

export const STRATEGY_STATUS_COLUMNS: { key: StrategyPlan['status']; label: string }[] = [
  { key: 'draft', label: 'Draft' },
  { key: 'active', label: 'Active' },
  { key: 'on_hold', label: 'On Hold' },
  { key: 'completed', label: 'Completed' },
  { key: 'archived', label: 'Archived' },
];

export const useStrategy = () => {
  const qc = useQueryClient();
  const { currentOrganization } = useOrganizations();
  const { session } = useSimpleAuth();
  const orgId = currentOrganization?.id;
  const userId = session?.user?.id;

  const plansQuery = useQuery({
    queryKey: ['strategy-plans', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategy_plans' as any)
        .select('*')
        .eq('organization_id', orgId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as StrategyPlan[];
    },
  });

  const logsQuery = useQuery({
    queryKey: ['strategy-progress-logs', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategy_progress_logs' as any)
        .select('*')
        .eq('organization_id', orgId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as StrategyProgressLog[];
    },
  });

  const createPlan = useMutation({
    mutationFn: async (input: Partial<StrategyPlan> & { name: string }) => {
      if (!orgId || !userId) throw new Error('Missing org or user');
      const { data, error } = await supabase
        .from('strategy_plans' as any)
        .insert({
          organization_id: orgId,
          created_by: userId,
          owner_id: input.owner_id ?? userId,
          name: input.name,
          description: input.description ?? null,
          status: input.status ?? 'draft',
          start_date: input.start_date ?? null,
          end_date: input.end_date ?? null,
        })
        .select()
        .maybeSingle();
      if (error) throw error;
      return data as unknown as StrategyPlan;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['strategy-plans', orgId] });
      toast.success('Strategy plan created');
    },
    onError: (err: any) => toast.error(err?.message ?? 'Failed to create plan'),
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StrategyPlan> }) => {
      const { data, error } = await supabase
        .from('strategy_plans' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data as unknown as StrategyPlan;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['strategy-plans', orgId] });
    },
    onError: (err: any) => toast.error(err?.message ?? 'Failed to update plan'),
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('strategy_plans' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['strategy-plans', orgId] });
      toast.success('Plan deleted');
    },
    onError: (err: any) => toast.error(err?.message ?? 'Failed to delete plan'),
  });

  const addProgressLog = useMutation({
    mutationFn: async (input: {
      entity_type: StrategyProgressLog['entity_type'];
      entity_id: string;
      progress: number;
      note?: string | null;
    }) => {
      if (!orgId || !userId) throw new Error('Missing org or user');
      const { data, error } = await supabase
        .from('strategy_progress_logs' as any)
        .insert({
          organization_id: orgId,
          user_id: userId,
          entity_type: input.entity_type,
          entity_id: input.entity_id,
          progress: input.progress,
          note: input.note ?? null,
        })
        .select()
        .maybeSingle();
      if (error) throw error;
      return data as unknown as StrategyProgressLog;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['strategy-progress-logs', orgId] });
      toast.success('Check-in recorded');
    },
    onError: (err: any) => toast.error(err?.message ?? 'Failed to add check-in'),
  });

  return {
    orgId,
    plans: plansQuery.data ?? [],
    isLoading: plansQuery.isLoading || logsQuery.isLoading,
    progressLogs: logsQuery.data ?? [],
    createPlan,
    updatePlan,
    deletePlan,
    addProgressLog,
  };
};

/** Roll up progress from initiatives -> objective avg, and objectives -> plan avg. */
export const useStrategyRollups = (
  plans: StrategyPlan[],
  goals: Array<{ id: string; progress?: number; strategy_plan_id?: string | null }>,
  initiatives: Array<{ id: string; progress?: number; strategy_plan_id?: string | null }>,
) => {
  return useMemo(() => {
    const planRollup = new Map<string, number>();
    plans.forEach((p) => {
      const planGoals = goals.filter((g) => g.strategy_plan_id === p.id);
      const planInits = initiatives.filter((i) => i.strategy_plan_id === p.id);
      const all = [...planGoals, ...planInits].map((x) => Number(x.progress ?? 0));
      const avg = all.length ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : 0;
      planRollup.set(p.id, avg);
    });
    return { planRollup };
  }, [plans, goals, initiatives]);
};
