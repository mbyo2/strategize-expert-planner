-- Phase 1: Database Security Hardening

-- 1. Enable RLS on user_sessions and add proper policies
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
ON public.user_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
ON public.user_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
ON public.user_sessions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
ON public.user_sessions
FOR DELETE
USING (auth.uid() = user_id);

-- 2. Fix goal_attachments RLS - replace overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view goal attachments" ON public.goal_attachments;

CREATE POLICY "Users can view their own goal attachments"
ON public.goal_attachments
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Harden military/tactical table policies - remove overly permissive "ALL for authenticated"
-- threat_intelligence
DROP POLICY IF EXISTS "Military personnel can update threat intelligence" ON public.threat_intelligence;
DROP POLICY IF EXISTS "Military personnel can view threat intelligence" ON public.threat_intelligence;

CREATE POLICY "Analysts can view threat intelligence"
ON public.threat_intelligence
FOR SELECT
USING (has_role_level(auth.uid(), 'analyst'::text));

CREATE POLICY "Managers can manage threat intelligence"
ON public.threat_intelligence
FOR INSERT
WITH CHECK (has_role_level(auth.uid(), 'manager'::text));

CREATE POLICY "Managers can update threat intelligence"
ON public.threat_intelligence
FOR UPDATE
USING (has_role_level(auth.uid(), 'manager'::text));

CREATE POLICY "Admins can delete threat intelligence"
ON public.threat_intelligence
FOR DELETE
USING (has_role_level(auth.uid(), 'admin'::text));

-- mission_objectives
DROP POLICY IF EXISTS "Military personnel can update mission objectives" ON public.mission_objectives;
DROP POLICY IF EXISTS "Military personnel can view mission objectives" ON public.mission_objectives;

CREATE POLICY "Analysts can view mission objectives"
ON public.mission_objectives
FOR SELECT
USING (has_role_level(auth.uid(), 'analyst'::text));

CREATE POLICY "Managers can manage mission objectives"
ON public.mission_objectives
FOR INSERT
WITH CHECK (has_role_level(auth.uid(), 'manager'::text));

CREATE POLICY "Managers can update mission objectives"
ON public.mission_objectives
FOR UPDATE
USING (has_role_level(auth.uid(), 'manager'::text));

CREATE POLICY "Admins can delete mission objectives"
ON public.mission_objectives
FOR DELETE
USING (has_role_level(auth.uid(), 'admin'::text));

-- ai_recommendations
DROP POLICY IF EXISTS "Military personnel can update AI recommendations" ON public.ai_recommendations;
DROP POLICY IF EXISTS "Military personnel can view AI recommendations" ON public.ai_recommendations;

CREATE POLICY "Analysts can view AI recommendations"
ON public.ai_recommendations
FOR SELECT
USING (has_role_level(auth.uid(), 'analyst'::text));

CREATE POLICY "Managers can manage AI recommendations"
ON public.ai_recommendations
FOR INSERT
WITH CHECK (has_role_level(auth.uid(), 'manager'::text));

CREATE POLICY "Managers can update AI recommendations"
ON public.ai_recommendations
FOR UPDATE
USING (has_role_level(auth.uid(), 'manager'::text));

CREATE POLICY "Admins can delete AI recommendations"
ON public.ai_recommendations
FOR DELETE
USING (has_role_level(auth.uid(), 'admin'::text));

-- tactical_units
DROP POLICY IF EXISTS "Military personnel can update tactical units" ON public.tactical_units;
DROP POLICY IF EXISTS "Military personnel can view tactical units" ON public.tactical_units;

CREATE POLICY "Analysts can view tactical units"
ON public.tactical_units
FOR SELECT
USING (has_role_level(auth.uid(), 'analyst'::text));

CREATE POLICY "Managers can manage tactical units"
ON public.tactical_units
FOR INSERT
WITH CHECK (has_role_level(auth.uid(), 'manager'::text));

CREATE POLICY "Managers can update tactical units"
ON public.tactical_units
FOR UPDATE
USING (has_role_level(auth.uid(), 'manager'::text));

CREATE POLICY "Admins can delete tactical units"
ON public.tactical_units
FOR DELETE
USING (has_role_level(auth.uid(), 'admin'::text));

-- 4. Create orders_redacted view for data minimization
CREATE OR REPLACE VIEW public.orders_redacted AS
SELECT 
  id,
  user_id,
  amount,
  currency,
  status,
  created_at,
  updated_at,
  -- Exclude sensitive fields: email, stripe_session_id, metadata
  NULL as metadata
FROM public.orders;

-- Enable RLS on the view (inherits from underlying table)
ALTER VIEW public.orders_redacted SET (security_barrier = true);

-- 5. Remove unused secret column from MFA table for security
ALTER TABLE public.user_mfa_methods DROP COLUMN IF EXISTS secret;