import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';

export interface BoardPack {
  id: string;
  organization_id: string;
  title: string;
  period_label: string | null;
  period_start: string | null;
  period_end: string | null;
  status: 'draft' | 'published';
  share_slug: string | null;
  snapshot: any;
  notes: string | null;
  published_at: string | null;
  published_by: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) +
  '-' +
  Math.random().toString(36).slice(2, 8);

export const useBoardPacks = () => {
  const qc = useQueryClient();
  const { currentOrganization } = useOrganizations();
  const { session } = useSimpleAuth();
  const orgId = currentOrganization?.id;
  const userId = session?.user?.id;

  const { data: packs = [], isLoading } = useQuery({
    queryKey: ['board-packs', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('board_packs' as any)
        .select('*')
        .eq('organization_id', orgId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });

  const generate = useMutation({
    mutationFn: async (input: { title: string; periodLabel?: string; notes?: string }) => {
      if (!orgId || !userId) throw new Error('Not ready');
      // Snapshot full strategic context: goals, decisions, bindings, initiatives, reviews, industry KPIs, org
      const [goalsRes, decisionsRes, bindingsRes, orgRes, initiativesRes, reviewsRes, metricsRes] =
        await Promise.all([
          supabase.from('strategic_goals').select('*'),
          supabase
            .from('decision_logs' as any)
            .select('*, options:decision_log_options(*), signoffs:decision_log_signoffs(*)')
            .eq('organization_id', orgId),
          supabase
            .from('strategy_erp_bindings' as any)
            .select('*')
            .eq('organization_id', orgId),
          supabase
            .from('organizations')
            .select('name, logo_url, website, industry')
            .eq('id', orgId)
            .maybeSingle(),
          supabase.from('planning_initiatives').select('*').eq('organization_id', orgId),
          supabase.from('strategy_reviews' as any).select('*').eq('organization_id', orgId),
          supabase.from('industry_metrics').select('*').eq('organization_id', orgId),
        ]);

      const goals = (goalsRes.data ?? []) as any[];
      const decisions = (decisionsRes.data ?? []) as any[];
      const bindings = (bindingsRes.data as any[]) ?? [];
      const initiatives = (initiativesRes.data as any[]) ?? [];
      const reviews = (reviewsRes.data as any[]) ?? [];
      const metrics = (metricsRes.data as any[]) ?? [];

      // KPI rollup
      const totalGoals = goals.length;
      const onTrack = goals.filter((g) => (g.progress ?? 0) >= 70).length;
      const atRisk = goals.filter((g) => g.risk_level === 'high' || (g.progress ?? 0) < 30).length;
      const avgProgress = totalGoals
        ? Math.round(goals.reduce((s, g) => s + (g.progress ?? 0), 0) / totalGoals)
        : 0;

      const snapshot = {
        generated_at: new Date().toISOString(),
        organization: orgRes.data ?? null,
        kpis: {
          totalGoals,
          onTrack,
          atRisk,
          avgProgress,
          decisionsLogged: decisions.length,
          decisionsFinalized: decisions.filter((d) => d.status === 'decided').length,
          liveBindings: bindings.length,
          syncedBindings: bindings.filter((b) => b.last_synced_at).length,
          activeInitiatives: initiatives.filter((i) => i.status === 'active' || i.status === 'in_progress').length,
          totalInitiatives: initiatives.length,
          reviewsScheduled: reviews.length,
          industryMetrics: metrics.length,
        },
        goals,
        decisions,
        bindings,
        initiatives,
        reviews,
        industry_metrics: metrics,
      };

      const { data, error } = await supabase
        .from('board_packs' as any)
        .insert({
          organization_id: orgId,
          title: input.title,
          period_label: input.periodLabel ?? null,
          notes: input.notes ?? null,
          snapshot,
          created_by: userId,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board-packs', orgId] });
      toast.success('Board pack drafted with live KPIs');
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to generate'),
  });

  const publish = useMutation({
    mutationFn: async (pack: BoardPack) => {
      if (!userId) throw new Error('Not ready');
      const slug = pack.share_slug ?? slugify(pack.title);
      const { error } = await supabase
        .from('board_packs' as any)
        .update({
          status: 'published',
          share_slug: slug,
          published_at: new Date().toISOString(),
          published_by: userId,
        })
        .eq('id', pack.id);
      if (error) throw error;
      return slug;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board-packs', orgId] });
      toast.success('Board pack published');
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to publish'),
  });

  const unpublish = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('board_packs' as any).update({ status: 'draft' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board-packs', orgId] });
      toast.success('Unpublished');
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('board_packs' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board-packs', orgId] });
      toast.success('Removed');
    },
  });

  return { packs, isLoading, generate, publish, unpublish, remove };
};
