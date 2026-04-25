import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizations } from '@/hooks/useOrganizations';

export interface GoalIntegrationCount {
  bindings: number;
  syncedBindings: number;
  decisions: number;
  finalizedDecisions: number;
  lastSyncedValue: number | null;
  lastSyncedAt: string | null;
}

/**
 * Aggregates ERP bindings + decisions per goal so cards can show "live"
 * status without N+1 queries.
 */
export const useGoalIntegrationCounts = (goalIds: string[]) => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id;

  return useQuery({
    queryKey: ['goal-integration-counts', orgId, goalIds.sort().join(',')],
    enabled: !!orgId && goalIds.length > 0,
    queryFn: async (): Promise<Record<string, GoalIntegrationCount>> => {
      const [bindingsRes, decisionsRes] = await Promise.all([
        supabase
          .from('strategy_erp_bindings' as any)
          .select('goal_id, last_synced_at, last_synced_value')
          .eq('organization_id', orgId!)
          .in('goal_id', goalIds),
        supabase
          .from('decision_logs' as any)
          .select('id, related_goal_id, status')
          .eq('organization_id', orgId!)
          .in('related_goal_id', goalIds),
      ]);

      const map: Record<string, GoalIntegrationCount> = {};
      goalIds.forEach((id) => {
        map[id] = {
          bindings: 0,
          syncedBindings: 0,
          decisions: 0,
          finalizedDecisions: 0,
          lastSyncedValue: null,
          lastSyncedAt: null,
        };
      });

      ((bindingsRes.data as any[]) ?? []).forEach((b) => {
        const e = map[b.goal_id];
        if (!e) return;
        e.bindings += 1;
        if (b.last_synced_at) {
          e.syncedBindings += 1;
          if (!e.lastSyncedAt || new Date(b.last_synced_at) > new Date(e.lastSyncedAt)) {
            e.lastSyncedAt = b.last_synced_at;
            e.lastSyncedValue = b.last_synced_value;
          }
        }
      });

      ((decisionsRes.data as any[]) ?? []).forEach((d) => {
        if (!d.related_goal_id) return;
        const e = map[d.related_goal_id];
        if (!e) return;
        e.decisions += 1;
        if (d.status === 'decided') e.finalizedDecisions += 1;
      });

      return map;
    },
  });
};
