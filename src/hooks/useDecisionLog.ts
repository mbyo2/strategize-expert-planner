import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';

export type DecisionStatus = 'open' | 'decided' | 'superseded';
export type SignoffStance = 'approve' | 'dissent' | 'abstain';

export interface DecisionOption {
  id: string;
  decision_id: string;
  label: string;
  description: string | null;
  pros: string | null;
  cons: string | null;
  estimated_impact: string | null;
  is_chosen: boolean;
  position: number;
}

export interface DecisionSignoff {
  id: string;
  decision_id: string;
  signer_id: string;
  signer_role: string | null;
  stance: SignoffStance;
  comment: string | null;
  signed_at: string;
}

export interface DecisionLog {
  id: string;
  organization_id: string;
  title: string;
  context: string | null;
  status: DecisionStatus;
  final_rationale: string | null;
  decided_by: string | null;
  decided_at: string | null;
  related_goal_id: string | null;
  related_initiative_id: string | null;
  superseded_by: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  options?: DecisionOption[];
  signoffs?: DecisionSignoff[];
}

export const useDecisionLog = () => {
  const qc = useQueryClient();
  const { currentOrganization } = useOrganizations();
  const { session } = useSimpleAuth();
  const orgId = currentOrganization?.id;
  const userId = session?.user?.id;

  const { data: decisions = [], isLoading } = useQuery({
    queryKey: ['decision-logs', orgId],
    enabled: !!orgId,
    queryFn: async (): Promise<DecisionLog[]> => {
      const { data, error } = await supabase
        .from('decision_logs' as any)
        .select('*, options:decision_log_options(*), signoffs:decision_log_signoffs(*)')
        .eq('organization_id', orgId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any) ?? [];
    },
  });

  const createDecision = useMutation({
    mutationFn: async (input: {
      title: string;
      context?: string;
      related_goal_id?: string | null;
      options: { label: string; description?: string; pros?: string; cons?: string; estimated_impact?: string }[];
    }) => {
      if (!orgId || !userId) throw new Error('Not ready');
      const { data: dec, error } = await supabase
        .from('decision_logs' as any)
        .insert({
          organization_id: orgId,
          title: input.title,
          context: input.context ?? null,
          related_goal_id: input.related_goal_id ?? null,
          created_by: userId,
        })
        .select()
        .single();
      if (error) throw error;
      const decision = dec as any;
      if (input.options.length) {
        const optsPayload = input.options.map((o, i) => ({
          decision_id: decision.id,
          label: o.label,
          description: o.description ?? null,
          pros: o.pros ?? null,
          cons: o.cons ?? null,
          estimated_impact: o.estimated_impact ?? null,
          position: i,
        }));
        const { error: oErr } = await supabase.from('decision_log_options' as any).insert(optsPayload);
        if (oErr) throw oErr;
      }
      return decision;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decision-logs', orgId] });
      toast.success('Decision recorded');
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to create decision'),
  });

  const decide = useMutation({
    mutationFn: async (input: { decisionId: string; chosenOptionId: string; rationale: string }) => {
      if (!userId) throw new Error('Not ready');
      // mark chosen option
      await supabase.from('decision_log_options' as any).update({ is_chosen: false }).eq('decision_id', input.decisionId);
      await supabase.from('decision_log_options' as any).update({ is_chosen: true }).eq('id', input.chosenOptionId);
      const { error } = await supabase
        .from('decision_logs' as any)
        .update({
          status: 'decided',
          final_rationale: input.rationale,
          decided_by: userId,
          decided_at: new Date().toISOString(),
        })
        .eq('id', input.decisionId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decision-logs', orgId] });
      toast.success('Decision finalized');
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to finalize'),
  });

  const sign = useMutation({
    mutationFn: async (input: { decisionId: string; stance: SignoffStance; comment?: string; role?: string }) => {
      if (!userId) throw new Error('Not signed in');
      const { error } = await supabase.from('decision_log_signoffs' as any).upsert(
        {
          decision_id: input.decisionId,
          signer_id: userId,
          stance: input.stance,
          comment: input.comment ?? null,
          signer_role: input.role ?? null,
          signed_at: new Date().toISOString(),
        },
        { onConflict: 'decision_id,signer_id' },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decision-logs', orgId] });
      toast.success('Signature recorded');
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to sign'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('decision_logs' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decision-logs', orgId] });
      toast.success('Decision removed');
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to delete'),
  });

  return { decisions, isLoading, createDecision, decide, sign, remove };
};
