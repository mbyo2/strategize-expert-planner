-- 1. strategy_plans
CREATE TABLE public.strategy_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft',
  start_date date,
  end_date date,
  owner_id uuid,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_strategy_plans_org ON public.strategy_plans(organization_id);

ALTER TABLE public.strategy_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members view strategy plans"
ON public.strategy_plans FOR SELECT
USING (public.is_organization_member(organization_id, auth.uid()));

CREATE POLICY "Org managers create strategy plans"
ON public.strategy_plans FOR INSERT
WITH CHECK (
  public.is_organization_admin(organization_id, auth.uid())
  AND created_by = auth.uid()
);

CREATE POLICY "Org managers or creator update strategy plans"
ON public.strategy_plans FOR UPDATE
USING (
  public.is_organization_admin(organization_id, auth.uid())
  OR created_by = auth.uid()
);

CREATE POLICY "Org managers or creator delete strategy plans"
ON public.strategy_plans FOR DELETE
USING (
  public.is_organization_admin(organization_id, auth.uid())
  OR created_by = auth.uid()
);

CREATE TRIGGER trg_strategy_plans_updated
BEFORE UPDATE ON public.strategy_plans
FOR EACH ROW EXECUTE FUNCTION public.update_profiles_updated_at();

-- 2. strategy_progress_logs
CREATE TABLE public.strategy_progress_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('plan','objective','initiative')),
  entity_id uuid NOT NULL,
  progress integer NOT NULL CHECK (progress >= 0 AND progress <= 100),
  note text,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_strategy_progress_entity ON public.strategy_progress_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_strategy_progress_org ON public.strategy_progress_logs(organization_id);

ALTER TABLE public.strategy_progress_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members view progress logs"
ON public.strategy_progress_logs FOR SELECT
USING (public.is_organization_member(organization_id, auth.uid()));

CREATE POLICY "Org members create progress logs"
ON public.strategy_progress_logs FOR INSERT
WITH CHECK (
  public.is_organization_member(organization_id, auth.uid())
  AND user_id = auth.uid()
);

CREATE POLICY "Author or org manager update progress logs"
ON public.strategy_progress_logs FOR UPDATE
USING (
  user_id = auth.uid()
  OR public.is_organization_admin(organization_id, auth.uid())
);

CREATE POLICY "Author or org manager delete progress logs"
ON public.strategy_progress_logs FOR DELETE
USING (
  user_id = auth.uid()
  OR public.is_organization_admin(organization_id, auth.uid())
);

-- 3. Link existing tables to a plan (optional)
ALTER TABLE public.strategic_goals  ADD COLUMN IF NOT EXISTS strategy_plan_id uuid;
ALTER TABLE public.planning_initiatives ADD COLUMN IF NOT EXISTS strategy_plan_id uuid;

CREATE INDEX IF NOT EXISTS idx_strategic_goals_plan ON public.strategic_goals(strategy_plan_id);
CREATE INDEX IF NOT EXISTS idx_planning_initiatives_plan ON public.planning_initiatives(strategy_plan_id);