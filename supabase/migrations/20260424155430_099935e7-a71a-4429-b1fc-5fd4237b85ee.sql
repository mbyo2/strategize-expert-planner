-- =========================================================
-- decision_logs
-- =========================================================
CREATE TABLE public.decision_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  title text NOT NULL,
  context text,
  status text NOT NULL DEFAULT 'open', -- open | decided | superseded
  final_rationale text,
  decided_by uuid,
  decided_at timestamptz,
  related_goal_id uuid REFERENCES public.strategic_goals(id) ON DELETE SET NULL,
  related_initiative_id uuid REFERENCES public.planning_initiatives(id) ON DELETE SET NULL,
  superseded_by uuid REFERENCES public.decision_logs(id) ON DELETE SET NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_decision_logs_org ON public.decision_logs(organization_id);
CREATE INDEX idx_decision_logs_status ON public.decision_logs(status);
CREATE INDEX idx_decision_logs_goal ON public.decision_logs(related_goal_id);

ALTER TABLE public.decision_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members view decision logs"
  ON public.decision_logs FOR SELECT
  USING (public.is_organization_member(organization_id, auth.uid()));

CREATE POLICY "Org admins create decision logs"
  ON public.decision_logs FOR INSERT
  WITH CHECK (
    public.is_organization_admin(organization_id, auth.uid())
    AND created_by = auth.uid()
  );

CREATE POLICY "Org admins update decision logs"
  ON public.decision_logs FOR UPDATE
  USING (public.is_organization_admin(organization_id, auth.uid()));

CREATE POLICY "Org admins delete decision logs"
  ON public.decision_logs FOR DELETE
  USING (public.is_organization_admin(organization_id, auth.uid()));

CREATE TRIGGER trg_decision_logs_updated_at
  BEFORE UPDATE ON public.decision_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_site_builder_updated_at();

-- =========================================================
-- Helpers (security definer) — avoid recursive policy lookups
-- =========================================================
CREATE OR REPLACE FUNCTION public.can_view_decision(_decision_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.decision_logs d
    WHERE d.id = _decision_id
      AND public.is_organization_member(d.organization_id, auth.uid())
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_decision(_decision_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.decision_logs d
    WHERE d.id = _decision_id
      AND public.is_organization_admin(d.organization_id, auth.uid())
  );
$$;

-- =========================================================
-- decision_log_options
-- =========================================================
CREATE TABLE public.decision_log_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id uuid NOT NULL REFERENCES public.decision_logs(id) ON DELETE CASCADE,
  label text NOT NULL,
  description text,
  pros text,
  cons text,
  estimated_impact text,
  is_chosen boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_decision_options_decision ON public.decision_log_options(decision_id);

ALTER TABLE public.decision_log_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View options of accessible decisions"
  ON public.decision_log_options FOR SELECT
  USING (public.can_view_decision(decision_id));

CREATE POLICY "Manage options on managed decisions - insert"
  ON public.decision_log_options FOR INSERT
  WITH CHECK (public.can_manage_decision(decision_id));

CREATE POLICY "Manage options on managed decisions - update"
  ON public.decision_log_options FOR UPDATE
  USING (public.can_manage_decision(decision_id));

CREATE POLICY "Manage options on managed decisions - delete"
  ON public.decision_log_options FOR DELETE
  USING (public.can_manage_decision(decision_id));

CREATE TRIGGER trg_decision_options_updated_at
  BEFORE UPDATE ON public.decision_log_options
  FOR EACH ROW EXECUTE FUNCTION public.update_site_builder_updated_at();

-- =========================================================
-- decision_log_signoffs
-- =========================================================
CREATE TABLE public.decision_log_signoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id uuid NOT NULL REFERENCES public.decision_logs(id) ON DELETE CASCADE,
  signer_id uuid NOT NULL,
  signer_role text,
  stance text NOT NULL DEFAULT 'approve', -- approve | dissent | abstain
  comment text,
  signed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (decision_id, signer_id)
);

CREATE INDEX idx_decision_signoffs_decision ON public.decision_log_signoffs(decision_id);
CREATE INDEX idx_decision_signoffs_signer ON public.decision_log_signoffs(signer_id);

ALTER TABLE public.decision_log_signoffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View signoffs of accessible decisions"
  ON public.decision_log_signoffs FOR SELECT
  USING (public.can_view_decision(decision_id));

CREATE POLICY "Members can sign their own stance"
  ON public.decision_log_signoffs FOR INSERT
  WITH CHECK (
    signer_id = auth.uid()
    AND public.can_view_decision(decision_id)
  );

CREATE POLICY "Members can update their own signoff"
  ON public.decision_log_signoffs FOR UPDATE
  USING (signer_id = auth.uid());

CREATE POLICY "Members can withdraw their own signoff"
  ON public.decision_log_signoffs FOR DELETE
  USING (signer_id = auth.uid());

-- =========================================================
-- strategy_erp_bindings  (live Strategy ↔ ERP)
-- =========================================================
CREATE TABLE public.strategy_erp_bindings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  goal_id uuid NOT NULL REFERENCES public.strategic_goals(id) ON DELETE CASCADE,
  erp_entity_id uuid NOT NULL REFERENCES public.erp_entities(id) ON DELETE CASCADE,
  source_field text NOT NULL,           -- jsonb path inside erp_entities.entity_data, e.g. "revenue" or "pipeline.total"
  aggregation text NOT NULL DEFAULT 'value', -- value | sum | avg | count | max | min
  multiplier numeric NOT NULL DEFAULT 1,
  last_synced_value numeric,
  last_synced_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (goal_id, erp_entity_id, source_field)
);

CREATE INDEX idx_bindings_org ON public.strategy_erp_bindings(organization_id);
CREATE INDEX idx_bindings_goal ON public.strategy_erp_bindings(goal_id);
CREATE INDEX idx_bindings_entity ON public.strategy_erp_bindings(erp_entity_id);

ALTER TABLE public.strategy_erp_bindings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members view bindings"
  ON public.strategy_erp_bindings FOR SELECT
  USING (public.is_organization_member(organization_id, auth.uid()));

CREATE POLICY "Org admins create bindings"
  ON public.strategy_erp_bindings FOR INSERT
  WITH CHECK (
    public.is_organization_admin(organization_id, auth.uid())
    AND created_by = auth.uid()
  );

CREATE POLICY "Org admins update bindings"
  ON public.strategy_erp_bindings FOR UPDATE
  USING (public.is_organization_admin(organization_id, auth.uid()));

CREATE POLICY "Org admins delete bindings"
  ON public.strategy_erp_bindings FOR DELETE
  USING (public.is_organization_admin(organization_id, auth.uid()));

CREATE TRIGGER trg_bindings_updated_at
  BEFORE UPDATE ON public.strategy_erp_bindings
  FOR EACH ROW EXECUTE FUNCTION public.update_site_builder_updated_at();

-- =========================================================
-- board_packs
-- =========================================================
CREATE TABLE public.board_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  title text NOT NULL,
  period_label text,                       -- e.g. "Q2 2026"
  period_start date,
  period_end date,
  status text NOT NULL DEFAULT 'draft',    -- draft | published
  share_slug text UNIQUE,                  -- public URL slug
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, -- frozen goals/KPIs/decisions at time of publish
  notes text,
  published_at timestamptz,
  published_by uuid,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_board_packs_org ON public.board_packs(organization_id);
CREATE INDEX idx_board_packs_status ON public.board_packs(status);
CREATE INDEX idx_board_packs_slug ON public.board_packs(share_slug);

ALTER TABLE public.board_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members view board packs"
  ON public.board_packs FOR SELECT
  USING (public.is_organization_member(organization_id, auth.uid()));

CREATE POLICY "Anyone can view published board packs"
  ON public.board_packs FOR SELECT
  USING (status = 'published' AND share_slug IS NOT NULL);

CREATE POLICY "Org admins create board packs"
  ON public.board_packs FOR INSERT
  WITH CHECK (
    public.is_organization_admin(organization_id, auth.uid())
    AND created_by = auth.uid()
  );

CREATE POLICY "Org admins update board packs"
  ON public.board_packs FOR UPDATE
  USING (public.is_organization_admin(organization_id, auth.uid()));

CREATE POLICY "Org admins delete board packs"
  ON public.board_packs FOR DELETE
  USING (public.is_organization_admin(organization_id, auth.uid()));

CREATE TRIGGER trg_board_packs_updated_at
  BEFORE UPDATE ON public.board_packs
  FOR EACH ROW EXECUTE FUNCTION public.update_site_builder_updated_at();