-- Security Fix Migration: Tighten RLS policies and fix data access issues

-- 1. Fix strategy_reviews - remove overly permissive policies
DROP POLICY IF EXISTS "Anyone can view strategy reviews" ON public.strategy_reviews;
DROP POLICY IF EXISTS "Everyone can view strategy reviews" ON public.strategy_reviews;

-- Create proper strategy_reviews policies
CREATE POLICY "Managers and admins can view strategy reviews" 
ON public.strategy_reviews 
FOR SELECT 
USING (has_role_level(auth.uid(), 'manager'::text));

-- 2. Fix planning_initiatives - remove public access
DROP POLICY IF EXISTS "Everyone can view planning initiatives" ON public.planning_initiatives;
DROP POLICY IF EXISTS "Users can view planning initiatives" ON public.planning_initiatives;

-- Keep only the analyst+ policy for viewing
CREATE POLICY "Analysts and above can view planning initiatives" 
ON public.planning_initiatives 
FOR SELECT 
USING (has_role_level(auth.uid(), 'analyst'::text));

-- 3. Fix industry_metrics - restrict to analysts+
DROP POLICY IF EXISTS "Anyone can view industry metrics" ON public.industry_metrics;
DROP POLICY IF EXISTS "Everyone can view industry metrics" ON public.industry_metrics;

CREATE POLICY "Analysts and above can view industry metrics" 
ON public.industry_metrics 
FOR SELECT 
USING (has_role_level(auth.uid(), 'analyst'::text));

-- 4. Fix market_changes - restrict to analysts+
DROP POLICY IF EXISTS "Anyone can view market changes" ON public.market_changes;
DROP POLICY IF EXISTS "Everyone can view market changes" ON public.market_changes;

CREATE POLICY "Analysts and above can view market changes" 
ON public.market_changes 
FOR SELECT 
USING (has_role_level(auth.uid(), 'analyst'::text));

-- 5. Add is_public column to notifications and fix policies
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Update notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

CREATE POLICY "Users can view their notifications or public ones" 
ON public.notifications 
FOR SELECT 
USING (
  (auth.uid() = "userId") OR 
  (is_public = true AND has_role_level(auth.uid(), 'analyst'::text))
);

-- 6. Create secure user sessions table for proper session management
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  session_token text NOT NULL, -- This will store hashed session identifier
  ip_address inet NULL,
  user_agent text NULL,
  is_active boolean NOT NULL DEFAULT true,
  last_activity timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
CREATE POLICY "Users can manage their own sessions" 
ON public.user_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- 7. Add require_mfa column to profiles for MFA enforcement
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS require_mfa boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mfa_enabled boolean DEFAULT false;

-- 8. Remove profiles.role column dependency (deprecate it)
-- Add trigger to prevent non-admin changes to profiles.role
CREATE OR REPLACE FUNCTION public.prevent_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow role changes only for admins or if role is NULL/unchanged
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT has_role_level(auth.uid(), 'admin'::text) THEN
    RAISE EXCEPTION 'Only admins can modify user roles. Use user_roles table instead.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS prevent_profile_role_changes ON public.profiles;
CREATE TRIGGER prevent_profile_role_changes
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_changes();

-- 9. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_public ON public.notifications("userId", is_public);

-- 10. Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE public.user_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;