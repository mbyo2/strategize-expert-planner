-- Fix critical security issues identified in security review

-- 1. Harden profiles table RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Prevent profile deletion except by admins
CREATE POLICY "Only admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (has_role_level(auth.uid(), 'admin'::text));

-- 2. Fix user_sessions table RLS (currently missing proper policies)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    session_hash text NOT NULL,
    ip_address inet,
    user_agent text,
    is_active boolean NOT NULL DEFAULT true,
    last_activity timestamp with time zone NOT NULL DEFAULT now(),
    expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_sessions if not already enabled
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and create secure ones
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON public.user_sessions;

CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Only allow users to deactivate sessions, not delete
CREATE POLICY "Users can deactivate their own sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Create trigger for automatic user role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign default viewer role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign roles
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- 4. Harden MFA table security
ALTER TABLE public.user_mfa_methods ENABLE ROW LEVEL SECURITY;

-- Drop existing MFA policies and create secure ones
DROP POLICY IF EXISTS "Users can manage their own MFA methods" ON public.user_mfa_methods;

CREATE POLICY "Users can view their own MFA methods" 
ON public.user_mfa_methods 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own MFA methods" 
ON public.user_mfa_methods 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA methods" 
ON public.user_mfa_methods 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MFA methods" 
ON public.user_mfa_methods 
FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Add audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_sensitive_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log role changes
  IF TG_TABLE_NAME = 'user_roles' THEN
    INSERT INTO public.audit_logs (
      user_id, 
      action, 
      resource_type, 
      resource_id, 
      old_values, 
      new_values
    ) VALUES (
      COALESCE(NEW.user_id, OLD.user_id),
      TG_OP,
      'user_role',
      COALESCE(NEW.id::text, OLD.id::text),
      CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit triggers for sensitive tables
DROP TRIGGER IF EXISTS audit_user_roles_changes ON public.user_roles;
CREATE TRIGGER audit_user_roles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_changes();

-- 6. Create function to check session validity
CREATE OR REPLACE FUNCTION public.is_session_valid(session_hash text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_sessions
    WHERE session_hash = $1
    AND is_active = true
    AND expires_at > now()
    AND user_id = auth.uid()
  );
$$;

-- 7. Add constraint to prevent role escalation
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS prevent_self_role_escalation;

-- Only admins can assign admin roles
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent non-admins from assigning admin/manager roles
  IF NEW.role IN ('admin', 'manager') AND NOT has_role_level(auth.uid(), 'admin'::text) THEN
    RAISE EXCEPTION 'Only administrators can assign admin or manager roles';
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_role_assignment_trigger ON public.user_roles;
CREATE TRIGGER validate_role_assignment_trigger
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.validate_role_assignment();