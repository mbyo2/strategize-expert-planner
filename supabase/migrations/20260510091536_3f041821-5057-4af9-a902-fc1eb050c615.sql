-- Lock down SECURITY DEFINER helper functions: revoke from anon/public, grant only to authenticated
DO $$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%I(%s) FROM PUBLIC, anon', fn.proname, fn.args);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO authenticated, service_role', fn.proname, fn.args);
  END LOOP;
END $$;

-- Add full-text search GIN indexes for global search performance
CREATE INDEX IF NOT EXISTS idx_strategic_goals_fts
  ON public.strategic_goals
  USING GIN (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

CREATE INDEX IF NOT EXISTS idx_planning_initiatives_fts
  ON public.planning_initiatives
  USING GIN (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

CREATE INDEX IF NOT EXISTS idx_strategy_reviews_fts
  ON public.strategy_reviews
  USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

CREATE INDEX IF NOT EXISTS idx_recommendations_fts
  ON public.recommendations
  USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

CREATE INDEX IF NOT EXISTS idx_market_changes_fts
  ON public.market_changes
  USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));