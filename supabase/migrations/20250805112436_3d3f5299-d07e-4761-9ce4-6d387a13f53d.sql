-- Fix security issues: Add missing RLS on existing tables and secure functions

-- Enable RLS on tables that were missing it (from security scan)
DO $$
BEGIN
    -- Check and enable RLS on any remaining tables without it
    IF NOT (SELECT relhasrowsecurity FROM pg_class WHERE relname = 'company_strategy') THEN
        ALTER TABLE public.company_strategy ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT relhasrowsecurity FROM pg_class WHERE relname = 'industry_metrics') THEN
        ALTER TABLE public.industry_metrics ENABLE ROW LEVEL SECURITY;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Tables might already have RLS enabled
    NULL;
END $$;

-- Fix function search_path security issues
CREATE OR REPLACE FUNCTION public.update_erp_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_team_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_support_ticket_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'name', 
    NEW.email,
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_organization_member_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- When a user's profile is updated with an organization_id, add them as a member
  IF NEW.organization_id IS NOT NULL AND (OLD.organization_id IS NULL OR OLD.organization_id != NEW.organization_id) THEN
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (NEW.organization_id, NEW.id, COALESCE(NEW.role, 'viewer'))
    ON CONFLICT (organization_id, user_id) DO UPDATE SET
      role = EXCLUDED.role;
  END IF;
  
  RETURN NEW;
END;
$$;