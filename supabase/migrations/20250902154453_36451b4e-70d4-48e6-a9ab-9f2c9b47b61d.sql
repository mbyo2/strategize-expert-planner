-- Fix security linter warnings

-- 1. Fix search_path for prevent_role_changes function
CREATE OR REPLACE FUNCTION public.prevent_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow role changes only for admins or if role is NULL/unchanged
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT has_role_level(auth.uid(), 'admin'::text) THEN
    RAISE EXCEPTION 'Only admins can modify user roles. Use user_roles table instead.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Fix search_path for cleanup_expired_sessions function  
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE public.user_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;